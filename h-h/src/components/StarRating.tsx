"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
    productId: string;
    initialRating: number; // The product's average rating
    size?: "sm" | "md" | "lg";
    interactive?: boolean; // If false, just display rating
};

export default function StarRating({
    productId,
    initialRating,
    size = "md",
    interactive = true,
}: StarRatingProps) {
    const [rating, setRating] = useState<number>(initialRating);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Fetch user's existing rating on mount
    useEffect(() => {
        if (interactive) {
            fetchUserRating();
        }
    }, [productId, interactive]);

    async function fetchUserRating() {
        try {
            const res = await fetch(`/api/ratings?productId=${productId}`);
            const data = await res.json();

            setIsLoggedIn(data.loggedIn);
            if (data.rating !== null) {
                setUserRating(data.rating);
            }
        } catch (err) {
            console.error("Error fetching user rating:", err);
        }
    }

    async function handleClick(starIndex: number) {
        if (!interactive || !isLoggedIn || isSubmitting) return;

        const newRating = starIndex + 1;
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, rating: newRating }),
            });

            if (res.ok) {
                setUserRating(newRating);
                setRating(newRating); // Optimistic update
            } else {
                const data = await res.json();
                console.error("Failed to submit rating:", data.error);
            }
        } catch (err) {
            console.error("Error submitting rating:", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Determine which rating to display
    const displayRating = hoverRating ?? userRating ?? rating;

    // Size classes
    const sizeClasses = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl",
    };

    return (
        <div
            className={`flex items-center gap-1 ${interactive && isLoggedIn ? "cursor-pointer" : ""}`}
            onMouseLeave={() => setHoverRating(null)}
        >
            {[0, 1, 2, 3, 4].map((index) => {
                const isFilled = index < displayRating;
                const isUserRated = userRating !== null && index < userRating;

                return (
                    <FaStar
                        key={index}
                        className={`
              ${sizeClasses[size]}
              transition-all duration-150
              ${isFilled ? "text-yellow-400" : "text-gray-300"}
              ${interactive && isLoggedIn ? "hover:scale-110" : ""}
              ${isUserRated ? "drop-shadow-sm" : ""}
            `}
                        onMouseEnter={() => {
                            if (interactive && isLoggedIn) {
                                setHoverRating(index + 1);
                            }
                        }}
                        onClick={() => handleClick(index)}
                    />
                );
            })}

            {/* Show rating number - only for interactive mode */}
            {interactive && (
                <span className="ml-2 text-sm text-gray-600">
                    ({rating.toFixed(1)})
                </span>
            )}

            {/* Login prompt for non-logged users - only for interactive mode */}
            {interactive && !isLoggedIn && (
                <a
                    href="/api/auth/signin"
                    className="ml-3 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                    Login to rate
                </a>
            )}
        </div>
    );
}
