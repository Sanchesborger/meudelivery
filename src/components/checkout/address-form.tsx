"use client";

import { useState } from "react";
import { Home, Briefcase, MapPin } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Address } from "@/types";

interface AddressFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (address: Partial<Address>) => void;
    initialAddress?: Address | null;
}

const ADDRESS_TYPES = [
    { id: "home", label: "Casa", icon: Home },
    { id: "work", label: "Trabalho", icon: Briefcase },
    { id: "other", label: "Outro", icon: MapPin },
] as const;

export function AddressForm({ open, onClose, onSave, initialAddress }: AddressFormProps) {
    const [formData, setFormData] = useState({
        label: initialAddress?.label || "",
        type: initialAddress?.type || "home",
        zip_code: initialAddress?.zip_code || "",
        street: initialAddress?.street || "",
        number: initialAddress?.number || "",
        complement: initialAddress?.complement || "",
        neighborhood: initialAddress?.neighborhood || "",
        city: initialAddress?.city || "",
        state: initialAddress?.state || "",
        is_default: initialAddress?.is_default || false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleCepBlur = async () => {
        const cep = formData.zip_code.replace(/\D/g, "");
        if (cep.length === 8) {
            setIsLoadingCep(true);
            // Mock CEP lookup - in real app, call ViaCEP API
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Mock data
            setFormData((prev) => ({
                ...prev,
                street: "Rua Exemplo",
                neighborhood: "Centro",
                city: "São Paulo",
                state: "SP",
            }));
            setIsLoadingCep(false);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.label.trim()) newErrors.label = "Digite um nome para o endereço";
        if (!formData.zip_code.trim()) newErrors.zip_code = "Digite o CEP";
        if (!formData.street.trim()) newErrors.street = "Digite o logradouro";
        if (!formData.number.trim()) newErrors.number = "Digite o número";
        if (!formData.neighborhood.trim()) newErrors.neighborhood = "Digite o bairro";
        if (!formData.city.trim()) newErrors.city = "Digite a cidade";
        if (!formData.state.trim()) newErrors.state = "Digite o estado";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        onSave(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            label: "",
            type: "home",
            zip_code: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            is_default: false,
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={initialAddress ? "Editar endereço" : "Novo endereço"}
            size="md"
        >
            <div className="space-y-5">
                {/* Address Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de endereço</label>
                    <div className="grid grid-cols-3 gap-2">
                        {ADDRESS_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isSelected = formData.type === type.id;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => handleChange("type", type.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                        isSelected
                                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-5 w-5",
                                            isSelected
                                                ? "text-primary-600"
                                                : "text-neutral-600 dark:text-neutral-400"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            "text-sm font-medium",
                                            isSelected
                                                ? "text-primary-700 dark:text-primary-400"
                                                : "text-neutral-700 dark:text-neutral-300"
                                        )}
                                    >
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Label */}
                <Input
                    label="Nome do endereço"
                    placeholder="Ex: Minha casa, Trabalho..."
                    value={formData.label}
                    onChange={(e) => handleChange("label", e.target.value)}
                    error={errors.label}
                    fullWidth
                />

                {/* CEP */}
                <Input
                    label="CEP"
                    placeholder="00000-000"
                    value={formData.zip_code}
                    onChange={(e) => handleChange("zip_code", e.target.value)}
                    onBlur={handleCepBlur}
                    error={errors.zip_code}
                    disabled={isLoadingCep}
                    fullWidth
                />

                {/* Street and Number */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <Input
                            label="Logradouro"
                            placeholder="Rua, Avenida..."
                            value={formData.street}
                            onChange={(e) => handleChange("street", e.target.value)}
                            error={errors.street}
                            disabled={isLoadingCep}
                            fullWidth
                        />
                    </div>
                    <Input
                        label="Número"
                        placeholder="123"
                        value={formData.number}
                        onChange={(e) => handleChange("number", e.target.value)}
                        error={errors.number}
                        fullWidth
                    />
                </div>

                {/* Complement */}
                <Input
                    label="Complemento (opcional)"
                    placeholder="Apto, Bloco, Casa..."
                    value={formData.complement}
                    onChange={(e) => handleChange("complement", e.target.value)}
                    fullWidth
                />

                {/* Neighborhood */}
                <Input
                    label="Bairro"
                    placeholder="Centro"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                    error={errors.neighborhood}
                    disabled={isLoadingCep}
                    fullWidth
                />

                {/* City and State */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <Input
                            label="Cidade"
                            placeholder="São Paulo"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            error={errors.city}
                            disabled={isLoadingCep}
                            fullWidth
                        />
                    </div>
                    <Input
                        label="Estado"
                        placeholder="SP"
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
                        error={errors.state}
                        disabled={isLoadingCep}
                        maxLength={2}
                        fullWidth
                    />
                </div>

                {/* Default Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.is_default}
                        onChange={(e) => handleChange("is_default", e.target.checked)}
                        className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Definir como endereço padrão
                    </span>
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button variant="outline" onClick={handleClose} fullWidth>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} fullWidth>
                        Salvar endereço
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
