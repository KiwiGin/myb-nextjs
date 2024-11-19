"use client";
import React from "react";
import Image, { ImageProps } from "next/image";

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
      className={`${props.className} h-full flex flex-col justify-center items-center`}
    >
      <Image src={imageSrc} alt={name} className="h-full w-auto object-contain"/>
    </div>
  );
}
