'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Definir el esquema de validación con zod
const clienteSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  ruc: z.string().min(10, { message: "El RUC debe tener al menos 10 caracteres" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  telefono: z.string().min(7, { message: "El teléfono es requerido" }),
  correo: z.string().email({ message: "Correo electrónico inválido" }),
  documentoDeIdentidad: z.string().min(1, { message: "El documento de identidad es requerido" }),
  tipoDeDocumento: z.string().min(1, { message: "El tipo de documento es requerido" }),
});

// Tipos derivados del esquema
type ClienteFormData = z.infer<typeof clienteSchema>;

export function InterfazRegistroCliente() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Configuración de react-hook-form con zod
  const { register, handleSubmit, formState: { errors } } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: ClienteFormData) => {
    try {
      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatusMessage("Cliente registrado exitosamente");
      } else {
        setStatusMessage("Error al registrar el cliente");
      }
    } catch {
      setStatusMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registro de Cliente</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" type="text" placeholder="Nombre completo" {...register("nombre")} />
          {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="ruc">RUC</Label>
          <Input id="ruc" type="text" placeholder="Número de RUC" {...register("ruc")} />
          {errors.ruc && <p className="text-red-500">{errors.ruc.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" type="text" placeholder="Dirección" {...register("direccion")} />
          {errors.direccion && <p className="text-red-500">{errors.direccion.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" type="tel" placeholder="Número de teléfono" {...register("telefono")} />
          {errors.telefono && <p className="text-red-500">{errors.telefono.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="correo">Correo</Label>
          <Input id="correo" type="email" placeholder="Correo electrónico" {...register("correo")} />
          {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="documentoDeIdentidad">Documento de Identidad</Label>
          <Input id="documentoDeIdentidad" type="text" placeholder="Documento de identidad" {...register("documentoDeIdentidad")} />
          {errors.documentoDeIdentidad && <p className="text-red-500">{errors.documentoDeIdentidad.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="tipoDeDocumento">Tipo de Documento</Label>
          <Input id="tipoDeDocumento" type="text" placeholder="Tipo de documento" {...register("tipoDeDocumento")} />
          {errors.tipoDeDocumento && <p className="text-red-500">{errors.tipoDeDocumento.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-4">
          Registrar Cliente
        </Button>
      </form>

      {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
    </div>
  );
}
