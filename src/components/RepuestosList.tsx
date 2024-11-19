"use client";
import { type ProyeccionData } from "@/app/proyeccionRepuestos/InterfazProyeccionRepuestos";
import {
  Controller,
  UseFormReturn,
} from "react-hook-form";
import { GenericCard } from "./GenericCard";
import { Counter } from "./Counter";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

export default function RepuestosList({
  messageNothingAdded,
  repuestos,
  fr,
  className,
  counter = true,
  removeAction,
  selector = true,
}: {
  messageNothingAdded: string;
  repuestos: ProyeccionData["repuestos"];
  fr: UseFormReturn<ProyeccionData>;
  className?: string;
  counter?: boolean;
  removeAction?: (index: number) => void;
  selector?: boolean;
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
            className={`pt-2 w-full ${removeAction && "relative"}`}
          >
            <GenericCard
              title={item.nombre}
              subtitle={item.descripcion}
              image={item.linkImg}
              imageAlt={item.nombre}
            >
              <div className="flex flex-row mx-auto items-center min-w-32 gap-4">
                {counter && (
                  <Controller
                    name={`repuestos.${index}.quantity`}
                    control={fr.control}
                    render={({ field }) => (
                      <Counter
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        className={`w-1/2 ${
                          fr.formState.errors.repuestos?.[index]?.quantity
                            ? "border-red-500"
                            : ""
                        }`}
                        max={item.quantity}
                        min={1}
                        disabled={!fr.watch(`repuestos.${index}.checked`)}
                      />
                    )}
                  />
                )}
                {selector && (
                  <Controller
                    name={`repuestos.${index}.checked`}
                    control={fr.control}
                    render={({ field }) => (
                      <Switch
                        id={item.idRepuesto.toString()}
                        checked={field.value}
                        onClick={() => {
                          field.onChange(!field.value);
                        }}
                      />
                    )}
                  />
                )}
                {removeAction && (
                  <Button
                    className="absolute right-0 top-0 z-50"
                    onClick={() => {
                      removeAction(index);
                    }}
                    type="button"
                  >
                    &times;
                  </Button>
                )}
              </div>
            </GenericCard>
          </div>
        ))
      )}
    </div>
  );
}
