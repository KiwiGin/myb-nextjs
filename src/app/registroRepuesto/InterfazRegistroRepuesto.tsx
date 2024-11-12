'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ImageComponents/ImageLoader";
import { Repuesto } from "@/models/repuesto";
import { z } from "zod";

// Esquema de validación con Zod
const repuestoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  precio: z.number().min(0.01, { message: "El precio debe ser mayor que cero" }),
  descripcion: z.string().min(1, { message: "La descripción es obligatoria" }),
  img_base64: z.string().optional(),
  stock_actual: z.number().min(0, { message: "El stock debe ser positivo" }).optional(),
});

export function InterfazRegistroRepuesto() {
  const [repuesto, setRepuesto] = useState<Partial<Repuesto>>({
    nombre: "",
    precio: 0,
    descripcion: "",
    img_base64: "",
    stock_actual: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRepuesto({ ...repuesto, [name]: name === "precio" || name === "stock_actual" ? parseFloat(value) : value });
  };

  const handleImageUpload = (base64: string | null) => {
    if (!base64) return;
    setRepuesto({ ...repuesto, img_base64: base64 ? base64 : "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = repuestoSchema.safeParse(repuesto);
    
    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {} as { [key: string]: string });
      
      setErrors(newErrors);
      return;
    }

    setErrors(null);
    
    await fetch("/api/repuesto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto),
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registro de Repuesto</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre del repuesto"
            value={repuesto.nombre}
            onChange={handleChange}
          />
          {errors?.nombre && <p className="text-red-500">{errors.nombre}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="precio">Precio</Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            placeholder="Precio del repuesto"
            value={repuesto.precio}
            onChange={handleChange}
          />
          {errors?.precio && <p className="text-red-500">{errors.precio}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            placeholder="Descripción del repuesto"
            value={repuesto.descripcion}
            onChange={handleChange}
          />
          {errors?.descripcion && <p className="text-red-500">{errors.descripcion}</p>}
        </div>

        <div className="mb-4">
          <Label>Imagen del Repuesto</Label>
          <ImageLoader setBase64={(base64: string | null) => handleImageUpload(base64)} />
        </div>

        <div className="mb-4">
          <Label htmlFor="stock_actual">Stock Actual</Label>
          <Input
            id="stock_actual"
            name="stock_actual"
            type="number"
            placeholder="Cantidad en stock"
            value={repuesto.stock_actual}
            onChange={handleChange}
          />
          {errors?.stock_actual && <p className="text-red-500">{errors.stock_actual}</p>}
        </div>

        <Button type="submit" className="w-full mt-4">
          Registrar Repuesto
        </Button>
      </form>
    </div>
  );
}
