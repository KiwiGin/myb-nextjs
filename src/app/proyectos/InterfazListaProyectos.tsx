"use client";
import { useEffect, useState } from "react";
import { Proyecto } from "@/models/proyecto";
import { ProyectosList } from "@/components/ProyectosList";

export function InterfazListaProyectos() {

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jefeId = 1;

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch(`/api/proyecto/por-jefe/${jefeId}`);
        if (!response.ok) throw new Error("Error al cargar proyectos");
        const data: Proyecto[] = await response.json();
        setProyectos(data);
      } catch {
        setError("Error al cargar proyectos");
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  if (loading) return <div>Cargando proyectos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <ProyectosList proyectos={proyectos} />
    </div>
  );
}
