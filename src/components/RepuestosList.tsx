"use client";
import { type ProyeccionData } from "@/app/proyeccionRepuestos/InterfazProyeccionRepuestos";
import { Controller, UseFormReturn } from "react-hook-form";
import { GenericCard } from "./GenericCard";
import { Counter } from "./Counter";
import { Switch } from "./ui/switch";

export default function RepuestosList({
  messageNothingAdded,
  repuestos,
  fr,
  className,
}: {
  messageNothingAdded: string;
  repuestos: ProyeccionData["repuestos"];
  fr: UseFormReturn<ProyeccionData>;
  className?: string;
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
          <div key={item.idRepuesto} className="pt-2 w-full">
            <GenericCard
              title={item.nombre}
              subtitle={item.descripcion}
              image={item.link_img}
              imageAlt={item.nombre}
            >
              <div className="flex flex-row items-center w-1/4 gap-4">
                <Controller
                  name={`repuestos.${index}.cantidadProyectada`}
                  control={fr.control}
                  render={({ field }) => (
                    <Counter
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      className={`w-1/2 ${
                        fr.formState.errors.repuestos?.[index]
                          ?.cantidadProyectada
                          ? "border-red-500"
                          : ""
                      }`}
                      max={item.cantidadProyectada}
                      min={1}
                      disabled={!fr.watch(`repuestos.${index}.checked`)}
                    />
                  )}
                />
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
              </div>
            </GenericCard>
          </div>
        ))
      )}
    </div>
  );
}
