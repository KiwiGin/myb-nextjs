'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function InterfazRegistroPrueba() {
  const [tipoPrueba, setTipoPrueba] = useState({ nombre: "" });
  const [parametros, setParametros] = useState<{ nombre: string; unidades: string }[]>([]);
  const [nuevoParametro, setNuevoParametro] = useState({ nombre: "", unidades: "" });

  const handleTipoPruebaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar datos de tipoPrueba y parámetros al backend
    // await fetch('/api/tipoPrueba', { method: 'POST', body: JSON.stringify({ tipoPrueba, parametros }) });
    console.log("Tipo de Prueba y Parámetros registrados:", { tipoPrueba, parametros });
  };

  const handleAddParametro = () => {
    if (nuevoParametro.nombre && nuevoParametro.unidades) {
      setParametros([...parametros, nuevoParametro]);
      setNuevoParametro({ nombre: "", unidades: "" });
    } else {
      alert("Por favor, complete ambos campos del parámetro.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registro de Tipo de Prueba</h2>

      <form onSubmit={handleTipoPruebaSubmit}>
        <div className="mb-4">
          <Label htmlFor="tipoNombre">Nombre del Tipo de Prueba</Label>
          <Input
            id="tipoNombre"
            type="text"
            placeholder="Nombre del tipo de prueba"
            value={tipoPrueba.nombre}
            onChange={(e) => setTipoPrueba({ ...tipoPrueba, nombre: e.target.value })}
          />
        </div>

        <h3 className="text-md font-semibold mt-6 mb-4">Agregar Parámetros</h3>
        <div className="mb-4">
          <Label htmlFor="parametroNombre">Nombre del Parámetro</Label>
          <Input
            id="parametroNombre"
            type="text"
            placeholder="Nombre del parámetro"
            value={nuevoParametro.nombre}
            onChange={(e) => setNuevoParametro({ ...nuevoParametro, nombre: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="unidades">Unidades</Label>
          <Input
            id="unidades"
            type="text"
            placeholder="Unidades de medida"
            value={nuevoParametro.unidades}
            onChange={(e) => setNuevoParametro({ ...nuevoParametro, unidades: e.target.value })}
          />
        </div>

        <Button type="button" className="w-full mt-2" onClick={handleAddParametro}>
          Agregar Parámetro
        </Button>

        <div className="mt-4">
          <h4 className="text-md font-semibold">Parámetros Agregados:</h4>
          <ul>
            {parametros.map((param, index) => (
              <li key={index}>
                {param.nombre} - {param.unidades}
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" className="w-full mt-4">
          Registrar Tipo de Prueba con Parámetros
        </Button>
      </form>
    </div>
  );
}
