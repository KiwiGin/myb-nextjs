"use client";
import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface PictureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string; // Fuente de la imagen
  name: string; // Nombre o descripción de la imagen
  imageProps?: Omit<ImageProps, "src" | "alt">; // Propiedades de la imagen
}

export function PictureCard({
  imageSrc,
  name,
  // imageProps,
  ...props
}: PictureCardProps) {
  return (
    <div
      key={name}
      className={cn(
        "flex flex-col justify-center items-center",
        props.className
      )}
      {...props}
    >
      <Image
        src={imageSrc}
        alt={name}
        width={400}
        height={400}
        className="h-full w-auto object-contain mx-auto my-auto"
      />
    </div>
  );
}
