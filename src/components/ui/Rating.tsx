"use client";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Rating({ value, onChange, readOnly = false, size = "md" }: RatingProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange?.(star)}
          className={`${sizes[size]} transition-colors ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          } ${!readOnly && "cursor-pointer hover:text-yellow-300"}`}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
}
