'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function InterfazRegistroProyecto() {
  const [proyecto, setProyecto] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    idCliente: 0,
    idSupervisor: 0,
    idJefe: 0,
    costoManoObra: 0,
    idRepuestos: [],
    cantidadesRepuestos: [],
    idParametros: [],
    valoresMaximos: [],
    valoresMinimos: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProyecto((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const values = e.target.value.split(",").map((val) => parseInt(val.trim()));
    setProyecto((prev) => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos a la API
    console.log("Proyecto a enviar:", proyecto);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registro de Proyecto</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="titulo">Título</Label>
          <Input id="titulo" name="titulo" type="text" value={proyecto.titulo} onChange={handleChange} placeholder="Título del proyecto" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="descripcion">Descripción</Label>
          <Input id="descripcion" name="descripcion" type="text" value={proyecto.descripcion} onChange={handleChange} placeholder="Descripción del proyecto" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
          <Input id="fechaInicio" name="fechaInicio" type="date" value={proyecto.fechaInicio} onChange={handleChange} />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="fechaFin">Fecha de Fin</Label>
          <Input id="fechaFin" name="fechaFin" type="date" value={proyecto.fechaFin} onChange={handleChange} />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="idCliente">ID Cliente</Label>
          <Input id="idCliente" name="idCliente" type="number" value={proyecto.idCliente} onChange={handleChange} placeholder="ID del cliente" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="idSupervisor">ID Supervisor</Label>
          <Input id="idSupervisor" name="idSupervisor" type="number" value={proyecto.idSupervisor} onChange={handleChange} placeholder="ID del supervisor" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="idJefe">ID Jefe</Label>
          <Input id="idJefe" name="idJefe" type="number" value={proyecto.idJefe} onChange={handleChange} placeholder="ID del jefe" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="costoManoObra">Costo de Mano de Obra</Label>
          <Input id="costoManoObra" name="costoManoObra" type="number" value={proyecto.costoManoObra} onChange={handleChange} placeholder="Costo de mano de obra" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="idRepuestos">ID Repuestos (separados por comas)</Label>
          <Input id="idRepuestos" name="idRepuestos" type="text" onChange={(e) => handleArrayChange(e, "idRepuestos")} placeholder="Ejemplo: 1, 2, 3" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="cantidadesRepuestos">Cantidades de Repuestos (separadas por comas)</Label>
          <Input id="cantidadesRepuestos" name="cantidadesRepuestos" type="text" onChange={(e) => handleArrayChange(e, "cantidadesRepuestos")} placeholder="Ejemplo: 10, 5, 3" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="idParametros">ID Parámetros (separados por comas)</Label>
          <Input id="idParametros" name="idParametros" type="text" onChange={(e) => handleArrayChange(e, "idParametros")} placeholder="Ejemplo: 4, 5, 6" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="valoresMaximos">Valores Máximos (separados por comas)</Label>
          <Input id="valoresMaximos" name="valoresMaximos" type="text" onChange={(e) => handleArrayChange(e, "valoresMaximos")} placeholder="Ejemplo: 100.5, 200.3, 150.0" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="valoresMinimos">Valores Mínimos (separados por comas)</Label>
          <Input id="valoresMinimos" name="valoresMinimos" type="text" onChange={(e) => handleArrayChange(e, "valoresMinimos")} placeholder="Ejemplo: 50.0, 100.0, 75.0" />
        </div>
        
        <Button type="submit" className="w-full mt-4">
          Registrar Proyecto
        </Button>
      </form>
    </div>
  );
}
