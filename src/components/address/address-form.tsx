"use client";

import { useState } from "react";
import { Home, Briefcase, MapPin, MapPinned, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Address } from "@/types";
import { useGeolocation } from "@/hooks/use-geolocation";

interface AddressFormProps {
    initialData?: Partial<Address>;
    onSubmit: (address: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) => void;
    onCancel?: () => void;
}

const addressTypes = [
    { value: "home", label: "Casa", icon: Home },
    { value: "work", label: "Trabalho", icon: Briefcase },
    { value: "other", label: "Outro", icon: MapPin },
] as const;

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const { loading: locationLoading, error: locationError, address: detectedAddress, coordinates, requestLocation } = useGeolocation();

    const [formData, setFormData] = useState({
        label: initialData?.label || "",
        type: initialData?.type || "home" as const,
        zip_code: initialData?.zip_code || "",
        street: initialData?.street || "",
        number: initialData?.number || "",
        complement: initialData?.complement || "",
        neighborhood: initialData?.neighborhood || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        latitude: initialData?.latitude || -23.5505,
        longitude: initialData?.longitude || -46.6333,
        is_default: initialData?.is_default || false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-fill form when geolocation is obtained
    const handleUseLocation = async () => {
        await requestLocation();

        // The coordinates and address will be updated via the hook
        // We'll parse the detected address to fill the form
        if (coordinates) {
            setFormData(prev => ({
                ...prev,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            }));
        }

        // Parse detected address (format: "Street, Number - Neighborhood - City")
        if (detectedAddress) {
            const parts = detectedAddress.split(" - ");

            if (parts.length >= 1) {
                // First part might be "Street, Number" or just "Street" or just "City"
                const firstPart = parts[0];
                const streetParts = firstPart.split(", ");

                if (streetParts.length >= 2) {
                    setFormData(prev => ({ ...prev, street: streetParts[0], number: streetParts[1] }));
                } else {
                    setFormData(prev => ({ ...prev, street: firstPart }));
                }
            }

            if (parts.length >= 2) {
                setFormData(prev => ({ ...prev, neighborhood: parts[1] }));
            }

            if (parts.length >= 3) {
                setFormData(prev => ({ ...prev, city: parts[2] }));
            } else if (parts.length === 1) {
                // If only one part, it's probably the city
                setFormData(prev => ({ ...prev, city: parts[0] }));
            }
        }
    };

    const handleZipCodeChange = (value: string) => {
        // Format: 00000-000
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 8) {
            const formatted = cleaned.length > 5
                ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
                : cleaned;
            setFormData({ ...formData, zip_code: formatted });
            setErrors({ ...errors, zip_code: "" });

            // TODO: Implement real CEP API integration
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.zip_code || formData.zip_code.replace(/\D/g, "").length !== 8) {
            newErrors.zip_code = "CEP inválido";
        }
        if (!formData.street) {
            newErrors.street = "Rua é obrigatória";
        }
        if (!formData.number) {
            newErrors.number = "Número é obrigatório";
        }
        if (!formData.neighborhood) {
            newErrors.neighborhood = "Bairro é obrigatório";
        }
        if (!formData.city) {
            newErrors.city = "Cidade é obrigatória";
        }
        if (!formData.state) {
            newErrors.state = "Estado é obrigatório";
        }
        if (!formData.label) {
            newErrors.label = "Identificação é obrigatória";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Use Current Location Button */}
            <Button
                type="button"
                onClick={handleUseLocation}
                disabled={locationLoading || isSubmitting}
                variant="outline"
                fullWidth
                className="border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
                {locationLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Obtendo localização...
                    </>
                ) : (
                    <>
                        <MapPinned className="h-5 w-5 mr-2" />
                        Usar minha localização atual
                    </>
                )}
            </Button>

            {locationError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>
                </div>
            )}

            {/* Address Type */}
            <div>
                <label className="block text-sm font-medium mb-3">Tipo de endereço</label>
                <div className="grid grid-cols-3 gap-3">
                    {addressTypes.map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: value })}
                            className={`
                                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                                ${formData.type === value
                                    ? "border-primary-600 bg-primary-50 dark:bg-primary-950/20"
                                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                }
                            `}
                        >
                            <Icon className={`h-6 w-6 ${formData.type === value ? "text-primary-600" : "text-neutral-600 dark:text-neutral-400"}`} />
                            <span className={`text-sm font-medium ${formData.type === value ? "text-primary-600" : ""}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Label */}
            <Input
                label="Identificação"
                placeholder="Ex: Minha Casa, Escritório..."
                value={formData.label}
                onChange={(e) => {
                    setFormData({ ...formData, label: e.target.value });
                    setErrors({ ...errors, label: "" });
                }}
                error={errors.label}
                fullWidth
                disabled={isSubmitting}
            />

            {/* ZIP Code */}
            <Input
                label="CEP"
                placeholder="00000-000"
                value={formData.zip_code}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                error={errors.zip_code}
                fullWidth
                disabled={isSubmitting}
            />

            {/* Street and Number */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <Input
                        label="Rua"
                        placeholder="Nome da rua"
                        value={formData.street}
                        onChange={(e) => {
                            setFormData({ ...formData, street: e.target.value });
                            setErrors({ ...errors, street: "" });
                        }}
                        error={errors.street}
                        fullWidth
                        disabled={isSubmitting}
                    />
                </div>
                <Input
                    label="Número"
                    placeholder="123"
                    value={formData.number}
                    onChange={(e) => {
                        setFormData({ ...formData, number: e.target.value });
                        setErrors({ ...errors, number: "" });
                    }}
                    error={errors.number}
                    fullWidth
                    disabled={isSubmitting}
                />
            </div>

            {/* Complement */}
            <Input
                label="Complemento (opcional)"
                placeholder="Apto, bloco, etc"
                value={formData.complement}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                fullWidth
                disabled={isSubmitting}
            />

            {/* Neighborhood */}
            <Input
                label="Bairro"
                placeholder="Nome do bairro"
                value={formData.neighborhood}
                onChange={(e) => {
                    setFormData({ ...formData, neighborhood: e.target.value });
                    setErrors({ ...errors, neighborhood: "" });
                }}
                error={errors.neighborhood}
                fullWidth
                disabled={isSubmitting}
            />

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Cidade"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        setErrors({ ...errors, city: "" });
                    }}
                    error={errors.city}
                    fullWidth
                    disabled={isSubmitting}
                />
                <Input
                    label="Estado"
                    placeholder="UF"
                    value={formData.state}
                    onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (value.length <= 2) {
                            setFormData({ ...formData, state: value });
                            setErrors({ ...errors, state: "" });
                        }
                    }}
                    error={errors.state}
                    fullWidth
                    disabled={isSubmitting}
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        fullWidth
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                )}
                <Button type="submit" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar endereço"}
                </Button>
            </div>
        </form>
    );
}
