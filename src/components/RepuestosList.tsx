"use client";
import { GenericCard } from "./GenericCard";
import React from "react";
import { RepuestoForm } from "@/models/repuesto";

export default function RepuestosList<T extends RepuestoForm>({
  messageNothingAdded,
  repuestos,
  className,
  counter,
  remover,
  selector,
}: {
  messageNothingAdded: string;
  repuestos: T[];
  className?: string;
  counter?: (index: number, item: T) => React.ReactNode;
  remover?: (index: number, item: T) => React.ReactNode;
  selector?: (index: number, item: T) => React.ReactNode;
}) {
  return (
    <div
      className={`mx-3 overflow-y-auto ${className}`}
      style={{ height: "40h" }}
    >
      {repuestos.length === 0 ? (
        <p>{messageNothingAdded}</p>
      ) : (
        repuestos.map((item, index) => (
          <div
            key={item.idRepuesto}
            className={`pt-2 w-full ${remover && "relative"}`}
          >
            <GenericCard
              title={item.nombre}
              subtitle={item.descripcion}
              image={item.linkImg || ""}
              imageAlt={item.nombre}
            >
              <div
                className={`"flex flex-row mx-auto items-center gap-4 ${
                  counter && selector && "min-w-32"
                }"`}
              >
                {counter && counter(index, item as T)}
                {selector && selector(index, item as T)}
              </div>
            </GenericCard>
            {remover && remover(index, item as T)}
          </div>
        ))
      )}
    </div>
  );
}
