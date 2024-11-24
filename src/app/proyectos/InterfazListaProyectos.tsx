"use client";
import { useEffect, useState } from "react";
import { Proyecto } from "@/models/proyecto";
import { ProyectosList } from "@/components/ProyectosList";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";

export function InterfazListaProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando proyectos...",
  });

  const jefeId = 1;

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch(`/api/proyecto/por-jefe/${jefeId}`);
        if (!response.ok) throw new Error("Error al cargar proyectos");
        const data: Proyecto[] = await response.json();
        setProyectos(data);
        setNoice(null);
      } catch {
        setNoice({ type: "error", message: "Error al cargar sus proyectos" });
      }
    };

    fetchProyectos();
  }, []);

  return (
    <div className="p-4">
      {noice && <Noice noice={noice} />}
      <ProyectosList proyectos={proyectos} />
    </div>
  );
}
