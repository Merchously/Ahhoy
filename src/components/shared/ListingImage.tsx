"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Ship } from "lucide-react";

interface ListingImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

export function ListingImage({
  fallbackClassName,
  alt,
  ...props
}: ListingImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !props.src) {
    return (
      <div
        className={
          fallbackClassName ||
          "flex items-center justify-center h-full w-full bg-gray-100 text-gray-300"
        }
      >
        <Ship className="h-8 w-8" />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      {...props}
      onError={() => setHasError(true)}
    />
  );
}
