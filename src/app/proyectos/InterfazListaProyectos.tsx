"use client";
import { useEffect, useState } from "react";
import { Proyecto } from "@/models/proyecto";
import { ProyectosList } from "@/components/ProyectosList";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { useSession } from "next-auth/react";

export function InterfazListaProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [filteredProyectos, setFilteredProyectos] = useState<Proyecto[]>([]);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando proyectos...",
  });

  const [etapasSeleccionadas, setEtapasSeleccionadas] = useState<number[]>([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState<string[]>([]);
  const [showEtapas, setShowEtapas] = useState(false);
  const [showClientes, setShowClientes] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    const APIEndPoint = session!.user.rol === "jefe" ? `/api/proyecto/por-jefe/${session!.user.id}` : session!.user.rol === "supervisor" ? `/api/proyecto/por-supervisor/${session!.user.id}` : ""
    const fetchProyectos = async () => {
      try {
        const response = await fetch(APIEndPoint);
        if (!response.ok) throw new Error("Error al cargar proyectos");
        const data: Proyecto[] = await response.json();
        setProyectos(data ? data : []);
        setFilteredProyectos(data ? data : []);
        setNoice(null);
      } catch {
        setNoice({ type: "error", message: "Error al cargar sus proyectos" });
      }
    };

    fetchProyectos();
  }, [status, session]);

  useEffect(() => {
    const filtrarProyectos = () => {
      let filtrados = proyectos;

      if (etapasSeleccionadas.length > 0) {
        filtrados = filtrados.filter((p) => etapasSeleccionadas.includes(p.idEtapaActual!));
      }

      if (clientesSeleccionados.length > 0) {
        filtrados = filtrados.filter((p) => clientesSeleccionados.includes(p.cliente!.nombre));
      }

      setFilteredProyectos(filtrados);
    };

    filtrarProyectos();
  }, [etapasSeleccionadas, clientesSeleccionados, proyectos]);

  const manejarCambioEtapa = (idEtapa: number) => {
    setEtapasSeleccionadas((prev) =>
      prev.includes(idEtapa) ? prev.filter((id) => id !== idEtapa) : [...prev, idEtapa]
    );
  };

  const manejarCambioCliente = (cliente: string) => {
    setClientesSeleccionados((prev) =>
      prev.includes(cliente) ? prev.filter((c) => c !== cliente) : [...prev, cliente]
    );
  };

  const etapasDisponibles = Array.from(
    new Map(
      proyectos.map((p) => [p.idEtapaActual!, { id: p.idEtapaActual!, nombre: p.etapaActual }])
    ).values()
  ).sort((a, b) => a.id - b.id);

  const clientesDisponibles = Array.from(new Set(proyectos.map((p) => p.cliente!.nombre)));

  return (
    <div className="p-4 h-dvh">
      {noice && <Noice noice={noice} />}
      <div className="flex flex-col gap-2 h-[8%]">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowEtapas((prev) => !prev)}
              className="px-4 py-2 bg-black text-white rounded-md shadow hover:bg-gray-700"
            >
              Etapas
            </button>
            {showEtapas && (
              <div className="absolute top-[7%] left-[1%] bg-white border rounded-md shadow-lg p-4 z-50">
                <h3 className="text-md font-semibold mb-2">Etapas</h3>
                <div className="flex flex-col gap-2">
                  {etapasDisponibles.map(({ id, nombre }) => (
                    <label key={id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={id}
                        checked={etapasSeleccionadas.includes(id)}
                        onChange={() => manejarCambioEtapa(id)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      {nombre}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setShowClientes((prev) => !prev)}
              className="px-4 py-2 bg-black text-white rounded-md shadow hover:bg-gray-700"
            >
              Clientes
            </button>
            {showClientes && (
              <div className="absolute top-[7%] left-[5%] bg-white border rounded-md shadow-lg p-4 z-50">
                <h3 className="text-md font-semibold mb-2">Clientes</h3>
                <div className="flex flex-col gap-2">
                  {clientesDisponibles.map((cliente) => (
                    <label key={cliente} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={cliente}
                        checked={clientesSeleccionados.includes(cliente)}
                        onChange={() => manejarCambioCliente(cliente)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      {cliente}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>  
          <div className="flex flex-wrap gap-2">
            {etapasSeleccionadas.map((id) => {
              const etapa = etapasDisponibles.find((e) => e.id === id);
              return (
                <span
                  key={id}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full cursor-pointer"
                  onClick={() => manejarCambioEtapa(id)}
                >
                  {etapa?.nombre} ✕
                </span>
              );
            })}
            {clientesSeleccionados.map((cliente) => (
              <span
                key={cliente}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full cursor-pointer"
                onClick={() => manejarCambioCliente(cliente)}
              >
                {cliente} ✕
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-2 h-[92%] overflow-y-scroll">
        <ProyectosList proyectos={filteredProyectos} />
      </div>
    </div>
  );
}
