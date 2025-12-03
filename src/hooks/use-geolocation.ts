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
            // zoom=18 provides street-level detail instead of just city
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=pt-BR`,
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

            // Extract address components
            const address = data.address;
            const road = address.road || address.street || "";
            const houseNumber = address.house_number || "";
            const suburb = address.suburb || address.neighbourhood || address.quarter || "";
            const city = address.city || address.town || address.village || address.municipality || "";

            // Format the address with available components
            const parts: string[] = [];

            // Add street and number
            if (road) {
                if (houseNumber) {
                    parts.push(`${road}, ${houseNumber}`);
                } else {
                    parts.push(road);
                }
            }

            // Add neighborhood if available and different from road
            if (suburb && suburb !== road) {
                parts.push(suburb);
            }

            // Add city if we don't have more specific info, or always add it for context
            if (city) {
                // Only add city if we have street/suburb, otherwise it might be redundant
                if (parts.length > 0) {
                    parts.push(city);
                } else {
                    // If we only have city, that's what we show
                    parts.push(city);
                }
            }

            // Join parts with " - " separator
            const formattedAddress = parts.length > 0 ? parts.join(" - ") : "Localização atual";

            return formattedAddress;
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
                const { latitude, longitude } = position.coords;
                const coordinates = { latitude, longitude };

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

                setState({
                    loading: false,
                    error: errorMessage,
                    coordinates: null,
                    address: null,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
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
