"use client";
import React from "react";
import { Repuesto } from "@/models/repuesto";
import { PictureCard } from "./PictureCard";
import { cn } from "@/lib/utils";

export function RepuestosList<T extends Repuesto>({
  messageNothingAdded,
  repuestos,
  className,
  counter,
  remover,
  selector,
  error,
}: {
  messageNothingAdded: string;
  repuestos: T[];
  className?: string;
  counter?: (index: number, item: T) => React.ReactNode;
  remover?: (index: number, item: T) => React.ReactNode;
  selector?: (index: number, item: T) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={`mx-3 ${className}`} style={{ height: "40h" }}>
      {repuestos.length === 0 ? (
        <p className="w-full text-lg text-center min-h-10">{messageNothingAdded}</p>
      ) : (
        repuestos.map((item, index) => (
          <div
            key={item.idRepuesto}
            className={`pt-2 w-full ${remover && "relative"}`}
          >
            <div className="flex flex-row items-center justify-center space-x-4 p-4 h-32 w-full border rounded-xl overflow-hidden">
              {item.linkImg && (
                <PictureCard
                  imageSrc={item.linkImg}
                  name={item.nombre}
                  className="w-[20%] h-full overflow-hidden"
                />
              )}
              <div className="flex-1 space-y-1 overflow-x-auto w-[50%] min-h-min">
                <p className="text-sm font-medium leading-none">
                  {item.nombre}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.descripcion.length > 100
                    ? `${item.descripcion.substring(0, 80)}...`
                    : item.descripcion}
                </p>
              </div>
              {/* Form mode */}
              {counter || selector ? (
                <div
                  className={cn(
                    "self-center gap-4 w-[30%]",
                    counter && selector && "grid grid-cols-2"
                  )}
                >
                  {counter && (
                    <div className="w-full flex items-center justify-center">
                      {counter(index, item as T)}
                    </div>
                  )}
                  {selector && (
                    <div className="w-full flex items-center justify-center">
                      {selector(index, item as T)}
                    </div>
                  )}
                </div>
              ) : (
                /* Visualize mode */
                <div className="flex flex-col justify-center items-center gap-2 px-3">
                  <p className="text-4xl font-extralight">
                    {item.stockDisponible}
                    {item.cantidad && `/${item.cantidad}`}
                  </p>
                </div>
              )}
            </div>
            {remover && remover(index, item as T)}
            {error && error(index)}
          </div>
        ))
      )}
    </div>
  );
}
