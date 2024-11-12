'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Repuesto } from "@/models/repuesto";

export function InterfazRegistroRepuesto() {
  const [repuesto, setRepuesto] = useState<Partial<Repuesto>>({
    nombre: "",
    precio: 0,
    descripcion: "",
    link_img: "",
    stock_actual: 0,
    stock_solicitado: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRepuesto({ ...repuesto, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar los datos del repuesto al backend
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
        </div>

        <div className="mb-4">
          <Label htmlFor="link_img">URL de Imagen</Label>
          <Input
            id="link_img"
            name="link_img"
            type="url"
            placeholder="Enlace a la imagen del repuesto"
            value={repuesto.link_img}
            onChange={handleChange}
          />
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
        </div>

        <Button type="submit" className="w-full mt-4">
          Registrar Repuesto
        </Button>
      </form>
    </div>
  );
}
