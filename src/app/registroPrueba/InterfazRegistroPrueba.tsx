"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoiceType } from "@/models/noice";
import { useState } from "react";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { useRouter } from "next/navigation";

// Definir el esquema de validación con zod
const tipoPruebaSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre del tipo de prueba es requerido" }),
  parametros: z
    .array(
      z.object({
        nombre: z
          .string()
          .min(1, { message: "El nombre del parámetro es requerido" }),
        unidades: z
          .string()
          .min(1, { message: "Las unidades del parámetro son requeridas" }),
      })
    )
    .min(1, { message: "Se requiere al menos un parámetro" }),
});

// Tipos derivados del esquema
type TipoPruebaForm = z.infer<typeof tipoPruebaSchema>;

export function InterfazRegistroPrueba() {
  // Configuración de react-hook-form con zod
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TipoPruebaForm>({
    resolver: zodResolver(tipoPruebaSchema),
    defaultValues: { nombre: "", parametros: [] },
  });
  const router = useRouter();
  const [noice, setNoice] = useState<NoiceType | null>(null);

  // useFieldArray para manejar dinámicamente los parámetros
  const {
    fields: parametros,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "parametros",
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: TipoPruebaForm) => {
    setNoice({
      type: "loading",
      message: "Registrando tipo de prueba...",
      styleType: "modal",
    });

    try {
      const response = await fetch("/api/pruebaconparametro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreTipoPrueba: data.nombre,
          parametros: data.parametros,
        }),
      });

      if (!response.ok)
        throw new MyBError("Error al registrar el tipo de prueba y parámetros");
      reset();
      setNoice({
        type: "success",
        message: "Tipo de prueba registrado con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          router.replace("/");
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({
          type: "error",
          message: error.message,
        });
      else
        setNoice({
          type: "error",
          message: "Error desconocido",
        });
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {noice && <Noice noice={noice} />}
      <h2 className="text-lg font-semibold mb-4">Registro de Tipo de Prueba</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="tipoNombre">Nombre del Tipo de Prueba</Label>
          <Input
            id="tipoNombre"
            type="text"
            placeholder="Nombre del tipo de prueba"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <h3 className="text-md font-semibold mt-6 mb-4">Agregar Parámetros</h3>

        {parametros.map((param, index) => (
          <div key={param.id} className="mb-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor={`parametros[${index}].nombre`}>
                  Nombre del Parámetro
                </Label>
                <Input
                  id={`parametros[${index}].nombre`}
                  type="text"
                  placeholder="Nombre del parámetro"
                  {...register(`parametros.${index}.nombre` as const)}
                />
                {errors.parametros?.[index]?.nombre && (
                  <p className="text-red-500">
                    {errors.parametros[index]?.nombre?.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Label htmlFor={`parametros[${index}].unidades`}>
                  Unidades
                </Label>
                <Input
                  id={`parametros[${index}].unidades`}
                  type="text"
                  placeholder="Unidades de medida"
                  {...register(`parametros.${index}.unidades` as const)}
                />
                {errors.parametros?.[index]?.unidades && (
                  <p className="text-red-500">
                    {errors.parametros[index]?.unidades?.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                onClick={() => remove(index)}
                className="mt-6"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          className="w-full mt-2"
          onClick={() => append({ nombre: "", unidades: "" })}
        >
          Agregar Parámetro
        </Button>

        {errors.parametros && (
          <p className="text-red-500">{errors.parametros.message}</p>
        )}

        <Button type="submit" className="w-full mt-4">
          Registrar Tipo de Prueba con Parámetros
        </Button>
      </form>
    </div>
  );
}
