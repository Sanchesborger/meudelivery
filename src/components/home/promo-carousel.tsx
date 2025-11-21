"use client";

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

const banners = [
    {
        id: 1,
        title: "Frete Grátis",
        description: "Em pedidos acima de R$ 30,00",
        image: "/banners/banner-1.svg",
        color: "from-red-500 to-red-600",
        icon: "🛵"
    },
    {
        id: 2,
        title: "Promoção de Pizza",
        description: "20% de desconto em todas as pizzas",
        image: "/banners/banner-2.svg",
        color: "from-orange-500 to-orange-600",
        icon: "🍕"
    },
    {
        id: 3,
        title: "Festival de Sushi",
        description: "Combos especiais a partir de R$ 49,90",
        image: "/banners/banner-3.svg",
        color: "from-emerald-500 to-emerald-600",
        icon: "🍣"
    },
    {
        id: 4,
        title: "Hambúrguer Artesanal",
        description: "Compre 1 e leve bebida grátis",
        image: "/banners/banner-4.svg",
        color: "from-yellow-500 to-yellow-600",
        icon: "🍔"
    },
    {
        id: 5,
        title: "Sobremesas",
        description: "Frete grátis em doces e bolos",
        image: "/banners/banner-5.svg",
        color: "from-pink-500 to-pink-600",
        icon: "🍰"
    }
]

export function PromoCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })])
    const [selectedIndex, setSelectedIndex] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    return (
        <div className="relative overflow-hidden rounded-2xl">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {banners.map((banner) => (
                        <div className="flex-[0_0_100%] min-w-0 relative" key={banner.id}>
                            <div className={`h-40 w-full bg-gradient-to-br ${banner.color} p-6 text-white flex flex-col justify-center relative overflow-hidden`}>
                                <div className="relative z-10 max-w-[70%]">
                                    <h2 className="text-2xl font-bold font-heading mb-2">{banner.title}</h2>
                                    <p className="text-sm opacity-90">{banner.description}</p>
                                    <div className="mt-4">
                                        <Badge variant="default" className="bg-white/20 hover:bg-white/30 text-white border-none">
                                            Ver ofertas
                                        </Badge>
                                    </div>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none grayscale">
                                    {banner.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? "bg-white w-4" : "bg-white/50"
                            }`}
                        onClick={() => emblaApi?.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    )
}
