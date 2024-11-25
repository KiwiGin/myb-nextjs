"use client";
import { GenericCard } from "./GenericCard";
import React from "react";
import { Repuesto } from "@/models/repuesto";

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
        <p className="w-full text-center">{messageNothingAdded}</p>
      ) : (
        repuestos.map((item, index) => (
          <div
            key={item.idRepuesto}
            className={`pt-2 w-full ${remover && "relative"}`}
          >
            <GenericCard
              title={`${item.nombre} - ${item.precio}`}
              subtitle={
                item.descripcion.length > 100
                  ? `${item.descripcion.substring(0, 80)}...`
                  : item.descripcion
              }
              image={item.linkImg}
              imageAlt={item.nombre}
            >
              {/* Form mode */}
              {counter || selector ? (
                <div
                  className={`"flex flex-row self-center gap-4 ${
                    counter && selector && "min-w-32"
                  }"`}
                >
                  {counter && counter(index, item as T)}
                  {selector && selector(index, item as T)}
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
            </GenericCard>
            {remover && remover(index, item as T)}
            {error && error(index)}
          </div>
        ))
      )}
    </div>
  );
}
