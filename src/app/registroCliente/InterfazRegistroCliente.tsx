"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { useRouter } from "next/navigation";

// Definir el esquema de validación con zod
const clienteSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  ruc: z
    .string()
    .min(10, { message: "El RUC debe tener al menos 10 caracteres" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  telefono: z.string().min(7, { message: "El teléfono es requerido" }),
  correo: z.string().email({ message: "Correo electrónico inválido" }),
});

// Tipos derivados del esquema
type ClienteFormData = z.infer<typeof clienteSchema>;

export function InterfazRegistroCliente() {
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const router = useRouter();

  // Configuración de react-hook-form con zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: ClienteFormData) => {
    setNoice({
      type: "loading",
      message: "Registrando cliente...",
      styleType: "modal",
    });

    try {
      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new MyBError("Error al registrar el cliente");
      reset();

      setNoice({
        type: "success",
        message: "Cliente registrado con exito",
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
        setNoice({ type: "error", message: error.message });
      else setNoice({ type: "error", message: "Error al solicitar repuestos" });
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {noice && <Noice noice={noice} />}
      <h2 className="text-lg font-semibold mb-4">Registro de Cliente</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Nombre completo"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="ruc">RUC</Label>
          <Input
            id="ruc"
            type="text"
            placeholder="Número de RUC"
            {...register("ruc")}
          />
          {errors.ruc && <p className="text-red-500">{errors.ruc.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            type="text"
            placeholder="Dirección"
            {...register("direccion")}
          />
          {errors.direccion && (
            <p className="text-red-500">{errors.direccion.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="Número de teléfono"
            {...register("telefono")}
          />
          {errors.telefono && (
            <p className="text-red-500">{errors.telefono.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="correo">Correo</Label>
          <Input
            id="correo"
            type="email"
            placeholder="Correo electrónico"
            {...register("correo")}
          />
          {errors.correo && (
            <p className="text-red-500">{errors.correo.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-4">
          Registrar Cliente
        </Button>
      </form>
    </div>
  );
}
