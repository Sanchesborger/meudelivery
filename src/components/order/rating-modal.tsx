"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FEEDBACK_TAGS } from "@/lib/constants";

interface RatingModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (rating: {
        foodRating: number;
        deliveryRating: number;
        comment: string;
        tags: string[];
    }) => void;
    restaurantName: string;
}

export function RatingModal({
    open,
    onClose,
    onSubmit,
    restaurantName,
}: RatingModalProps) {
    const [foodRating, setFoodRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [comment, setComment] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [hoveredFoodStar, setHoveredFoodStar] = useState(0);
    const [hoveredDeliveryStar, setHoveredDeliveryStar] = useState(0);

    const handleTagToggle = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((t) => t !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = () => {
        if (foodRating === 0 || deliveryRating === 0) {
            alert("Por favor, avalie a comida e a entrega");
            return;
        }

        onSubmit({
            foodRating,
            deliveryRating,
            comment,
            tags: selectedTags,
        });

        // Reset form
        setFoodRating(0);
        setDeliveryRating(0);
        setComment("");
        setSelectedTags([]);
        onClose();
    };

    const renderStars = (
        rating: number,
        setRating: (rating: number) => void,
        hoveredStar: number,
        setHoveredStar: (star: number) => void
    ) => {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-110"
                    >
                        <Star
                            className={cn(
                                "h-8 w-8 transition-colors",
                                star <= (hoveredStar || rating)
                                    ? "fill-secondary-500 text-secondary-500"
                                    : "text-neutral-300 dark:text-neutral-600"
                            )}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Avaliar pedido"
            size="md"
        >
            <div className="space-y-6">
                {/* Food Rating */}
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold mb-1">Como estava a comida?</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Avalie a qualidade dos produtos de {restaurantName}
                        </p>
                    </div>
                    {renderStars(foodRating, setFoodRating, hoveredFoodStar, setHoveredFoodStar)}
                </div>

                {/* Delivery Rating */}
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold mb-1">Como foi a entrega?</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Avalie o serviço de entrega
                        </p>
                    </div>
                    {renderStars(
                        deliveryRating,
                        setDeliveryRating,
                        hoveredDeliveryStar,
                        setHoveredDeliveryStar
                    )}
                </div>

                {/* Feedback Tags */}
                <div className="space-y-3">
                    <h4 className="font-semibold">O que você achou?</h4>
                    <div className="flex flex-wrap gap-2">
                        {FEEDBACK_TAGS.map((tag) => {
                            const isSelected = selectedTags.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all text-sm font-medium",
                                        isSelected
                                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                                    )}
                                >
                                    {isSelected && (
                                        <Check className="h-4 w-4" strokeWidth={3} />
                                    )}
                                    <span>{tag.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label htmlFor="comment" className="font-semibold block">
                        Comentário (opcional)
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Conte mais sobre sua experiência..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-xs text-neutral-500 text-right">
                        {comment.length}/500
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button variant="outline" onClick={onClose} fullWidth>
                        Agora não
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={foodRating === 0 || deliveryRating === 0}
                        fullWidth
                    >
                        Enviar avaliação
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
