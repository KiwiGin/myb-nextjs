'use client';

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SelectorRepuestos } from "@/components/SelectorRepuestos";
import { Cliente } from "@/models/cliente";
import { Empleado } from "@/models/empleado";
import { Proyecto } from "@/models/proyecto";
import { SelectorPruebas } from "@/components/SelectorPruebas";

export function InterfazRegistroProyecto() {
  const [proyecto, setProyecto] = useState<Proyecto>({
    titulo: "",
    descripcion: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    idCliente: 0,
    idSupervisor: 0,
    idJefe: 0,
    idEtapaActual: 1,
    costoManoObra: 0,
    idRepuestos: [],
    cantidadesRepuestos: [],
    idParametros: [],
    valoresMaximos: [],
    valoresMinimos: []
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [supervisores, setSupervisores] = useState<Empleado[]>([]);
  const [jefes, setJefes] = useState<Empleado[]>([]);

  const fetchClientes = async () => {
    const res = await fetch("/api/cliente");
    const data = await res.json();
    setClientes(data);
  };

  const fetchSupervisores = async () => {
    const res = await fetch("/api/empleado/por-rol/supervisor");
    const data = await res.json();
    setSupervisores(data);
  };

  const fetchJefes = async () => {
    const res = await fetch("/api/empleado/por-rol/jefe");
    const data = await res.json();
    setJefes(data);
  };

  useEffect(() => {
    fetchClientes();
    fetchSupervisores();
    fetchJefes();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProyecto((prev) => ({
      ...prev,
      [name]: value ? new Date(value) : new Date() // Aseguramos que siempre se setee como Date
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setProyecto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/proyecto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proyecto),
      });
  
      if (!res.ok) {
        throw new Error("Error al registrar el proyecto");
      }
  
      const data = await res.json();
      console.log("Proyecto registrado:", data);
  
      // Limpiar el formulario o realizar alguna acción adicional si es necesario
      setProyecto({
        titulo: "",
        descripcion: "",
        fechaInicio: new Date(),
        fechaFin: new Date(),
        idCliente: 0,
        idSupervisor: 0,
        idJefe: 0,
        idEtapaActual: 1,
        costoManoObra: 0,
        idRepuestos: [],
        cantidadesRepuestos: [],
        idParametros: [],
        valoresMaximos: [],
        valoresMinimos: []
      });
  
      alert("Proyecto registrado con éxito");
    } catch (error) {
      console.error("Error en el registro del proyecto:", error);
      alert("Hubo un error al registrar el proyecto. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registro de Proyecto</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Campos de entrada */}
        <div className="mb-4">
          <Label htmlFor="titulo">Título</Label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={proyecto.titulo}
            onChange={handleChange}
            className="border rounded p-1 w-full"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="descripcion">Descripción</Label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={proyecto.descripcion}
            onChange={handleChange}
            className="border rounded p-1 w-full"
          />
        </div>

        <div className="flex flex-row justify-between">
          <div className="mb-4">
            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={proyecto.fechaInicio instanceof Date ? proyecto.fechaInicio.toISOString().split('T')[0] : ""}
              onChange={handleDateChange}
              className="border rounded p-1 w-full"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="fechaFin">Fecha de Fin</Label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={proyecto.fechaFin instanceof Date ? proyecto.fechaFin.toISOString().split('T')[0] : ""}
              onChange={handleDateChange}
              className="border rounded p-1 w-full"
            />
          </div>
        </div>


        {/* Select para Cliente */}
        <div className="mb-6">
          <Label htmlFor="idCliente" className="text-gray-700 font-semibold">Cliente</Label>
          <select 
            id="idCliente" 
            name="idCliente" 
            onChange={handleChange} 
            value={proyecto.idCliente} 
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.idCliente} value={cliente.idCliente}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Select para Supervisor */}
        <div className="mb-6">
          <Label htmlFor="idSupervisor" className="text-gray-700 font-semibold">Supervisor</Label>
          <select 
            id="idSupervisor" 
            name="idSupervisor" 
            onChange={handleChange} 
            value={proyecto.idSupervisor} 
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccione un supervisor</option>
            {supervisores.map((sup) => (
              <option key={sup.idEmpleado} value={sup.idEmpleado}>
                {sup.nombre + " " + sup.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Select para Jefe */}
        <div className="mb-6">
          <Label htmlFor="idJefe" className="text-gray-700 font-semibold">Jefe</Label>
          <select 
            id="idJefe" 
            name="idJefe" 
            onChange={handleChange} 
            value={proyecto.idJefe} 
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccione un jefe</option>
            {jefes.map((jefe) => (
              <option key={jefe.idEmpleado} value={jefe.idEmpleado}>
                {jefe.nombre + " " + jefe.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Costo de Mano de Obra */}
        <div className="mb-4">
          <Label htmlFor="costoManoObra" className="text-gray-700 font-semibold">Costo de Mano de Obra (S/.)</Label>
          <div className="flex items-center mt-2">
            <span className="px-3 py-2 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">S/.</span>
            <input
              type="number"
              id="costoManoObra"
              name="costoManoObra"
              value={proyecto.costoManoObra}
              onChange={handleChange}
              className="border border-gray-300 rounded-r-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        <SelectorRepuestos setProyecto={setProyecto} proyecto={proyecto} />
        <SelectorPruebas setProyecto={setProyecto} proyecto={proyecto} />

        <Button type="submit" className="w-full mt-4">
          Registrar Proyecto
        </Button>
      </form>
    </div>
  );
}
