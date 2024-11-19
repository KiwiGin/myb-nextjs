"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { useEffect, useState } from "react";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { InterfazAsignacionRepuestos } from "./InterfazAsignacionRepuestos";
import { Proyecto } from "@/models/proyecto";

export function InterfazFlujoProyecto({ idProyecto }: { idProyecto: string }) {
  const [proyecto, setProyecto] = useState<Proyecto>();

  useEffect(() => {
    // fetch from GET /api/proyecto/por-id/:idProyecto
    const fetchProyecto = async () => {
      const response = await fetch(`/api/proyecto/por-id/${idProyecto}`);
      if (!response.ok) throw new Error("Error al cargar proyectos");
      const data: Proyecto = await response.json();
      setProyecto(data);
    };

    fetchProyecto();
  }, [idProyecto]);

  if (!proyecto) return <div>Proyecto no encontrado</div>;
  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <ProyectoHeader proyecto={proyecto} />
      <ProjectFlow etapa={proyecto.idEtapaActual} />
      {proyecto.idEtapaActual == 1 ? (
        <div className="w-full">
          <InterfazAsignacionRepuestos proyecto={proyecto}/>
        </div>
      ) : proyecto.idEtapaActual == 2 ? (
        <div>
          <h1>Segunda etapa como Jefe</h1>
        </div>
      ) : proyecto.idEtapaActual == 4 ? (
        <>
          <h1>Cuarta etapa como Jefe</h1>
        </>
      ) : proyecto.idEtapaActual == 5 ? (
        <div>
          <h1>Quinta etapa como Jefe</h1>
        </div>
      ) : proyecto.idEtapaActual == 6 ? (
        <div>
          <h1>Sexta etapa como Jefe</h1>
        </div>
      ) : proyecto.idEtapaActual == 8 ? (
        <div>
          <h1>Octava etapa como Jefe</h1>
        </div>
      ) : null}
    </div>
  );
}
