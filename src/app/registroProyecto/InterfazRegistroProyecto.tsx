'use client';

import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { SelectorRepuestos } from "@/components/SelectorRespuestos";
// import { SelectorPruebas } from "@/components/SelectorPruebas";
import { Cliente } from "@/models/cliente";
import { Empleado } from "@/models/empleado";

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProyecto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Proyecto a enviar:", proyecto);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registro de Proyecto</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Campos de entrada */}
        
        {/* Select para Cliente */}
        <div className="mb-4">
          <Label htmlFor="idCliente">Cliente</Label>
          <select id="idCliente" name="idCliente" onChange={handleChange} value={proyecto.idCliente}>
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.idCliente} value={cliente.idCliente}>{cliente.nombre}</option>
            ))}
          </select>
        </div>

        {/* Select para Supervisor */}
        <div className="mb-4">
          <Label htmlFor="idSupervisor">Supervisor</Label>
          <select id="idSupervisor" name="idSupervisor" onChange={handleChange} value={proyecto.idSupervisor}>
            <option value="">Seleccione un supervisor</option>
            {supervisores.map((sup) => (
              <option key={sup.idEmpleado} value={sup.idEmpleado}>{sup.nombre}</option>
            ))}
          </select>
        </div>

        {/* Select para Jefe */}
        <div className="mb-4">
          <Label htmlFor="idJefe">Jefe</Label>
          <select id="idJefe" name="idJefe" onChange={handleChange} value={proyecto.idJefe}>
            <option value="">Seleccione un jefe</option>
            {jefes.map((jefe) => (
              <option key={jefe.idEmpleado} value={jefe.idEmpleado}>{jefe.nombre}</option>
            ))}
          </select>
        </div>

        {/* <SelectorRepuestos setProyecto={setProyecto} proyecto={proyecto} />
        <SelectorPruebas setProyecto={setProyecto} proyecto={proyecto} /> */}

        <Button type="submit" className="w-full mt-4">
          Registrar Proyecto
        </Button>
      </form>
    </div>
  );
}
