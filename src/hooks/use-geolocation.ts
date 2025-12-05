import { useState, useCallback } from "react";

interface GeolocationState {
    loading: boolean;
    error: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    address: string | null;
}

interface GeolocationResult {
    loading: boolean;
    error: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    address: string | null;
    requestLocation: () => Promise<void>;
    clearLocation: () => void;
}

export function useGeolocation(): GeolocationResult {
    const [state, setState] = useState<GeolocationState>({
        loading: false,
        error: null,
        coordinates: null,
        address: null,
    });

    const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
        try {
            // Using Nominatim API (OpenStreetMap) for reverse geocoding
            // Removed zoom parameter to get the most accurate result based on coordinates
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=pt-BR`,
                {
                    headers: {
                        'User-Agent': 'MeuDelivery/1.0' // Required by Nominatim usage policy
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to reverse geocode");
            }

            const data = await response.json();
            console.log("Geocoding result:", data); // Debug log

            // Extract address components with priority order
            const address = data.address;
            
            // Try multiple fields for street name
            const road = address.road || 
                        address.street || 
                        address.pedestrian || 
                        address.footway ||
                        address.path || "";
            
            const houseNumber = address.house_number || "";
            
            // Try multiple fields for neighborhood
            const suburb = address.suburb || 
                          address.neighbourhood || 
                          address.quarter || 
                          address.residential ||
                          address.district || "";
            
            // Try multiple fields for city
            const city = address.city || 
                        address.town || 
                        address.village || 
                        address.municipality ||
                        address.county || "";

            // Format the address with multiple components for better context
            const addressParts: string[] = [];

            // Add street with number (primary info)
            if (road) {
                if (houseNumber) {
                    addressParts.push(`${road}, ${houseNumber}`);
                } else {
                    addressParts.push(road);
                }
            }

            // Add neighborhood if available and different from road
            if (suburb && suburb !== road && !road.includes(suburb)) {
                addressParts.push(suburb);
            }

            // Add city for context (but keep it short)
            if (city && addressParts.length > 0) {
                addressParts.push(city);
            } else if (city && addressParts.length === 0) {
                // If we only have city, show it
                addressParts.push(city);
            }

            // If we have nothing specific, try to extract from display_name
            if (addressParts.length === 0 && data.display_name) {
                const parts = data.display_name.split(',').map((p: string) => p.trim());
                // Take first 2-3 meaningful parts
                addressParts.push(...parts.slice(0, 3));
            }

            // Join with " - " and limit total length
            let formattedAddress = addressParts.join(" - ");
            
            // Limit to reasonable length (about 50 chars)
            if (formattedAddress.length > 50) {
                formattedAddress = addressParts.slice(0, 2).join(" - ");
            }

            return formattedAddress || "Localização atual";
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return "Localização atual";
        }
    };


    const requestLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            setState({
                loading: false,
                error: "Geolocalização não é suportada neste navegador",
                coordinates: null,
                address: null,
            });
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const coordinates = { latitude, longitude };

                console.log("Location obtained:", { latitude, longitude, accuracy }); // Debug log

                // Get address from coordinates
                const address = await reverseGeocode(latitude, longitude);

                setState({
                    loading: false,
                    error: null,
                    coordinates,
                    address,
                });
            },
            (error) => {
                let errorMessage = "Erro ao obter localização";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Permissão de localização negada";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Localização não disponível";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Tempo esgotado ao obter localização";
                        break;
                }

                console.error("Geolocation error:", error); // Debug log

                setState({
                    loading: false,
                    error: errorMessage,
                    coordinates: null,
                    address: null,
                });
            },
            {
                enableHighAccuracy: true, // Use GPS if available
                timeout: 15000, // Increased timeout to 15 seconds
                maximumAge: 0, // Don't use cached position
            }
        );
    }, []);

    const clearLocation = useCallback(() => {
        setState({
            loading: false,
            error: null,
            coordinates: null,
            address: null,
        });
    }, []);

    return {
        loading: state.loading,
        error: state.error,
        coordinates: state.coordinates,
        address: state.address,
        requestLocation,
        clearLocation,
    };
}
