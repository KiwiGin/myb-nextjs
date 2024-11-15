"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { useEffect, useState } from "react";
import { PROYECTOS } from "../InterfazListaProyectos";
import { ProyectoDataType } from "../InterfazListaProyectos";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { InterfazAsignacionRepuestos } from "./InterfazAsignacionRepuestos";

export function InterfazFlujoProyecto({ idProyecto }: { idProyecto: string }) {
  const [proyecto, setProyecto] = useState<ProyectoDataType>();

  useEffect(() => {
    /*
      Fetch para obtener información del proyecto con el id proporcionado
      y asignarla a la variable proyecto.
    */
    setProyecto(
      PROYECTOS.find((proyecto) => proyecto.idProyecto === idProyecto)
    );
  }, [idProyecto]);

  if (!proyecto) return <div>Proyecto no encontrado</div>;
  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <ProyectoHeader proyecto={proyecto} />
      <ProjectFlow etapa={proyecto.etapa} />
      {proyecto.etapa == 0 ? (
        <div className="w-full">
          <InterfazAsignacionRepuestos idProyecto={proyecto.idProyecto}/>
        </div>
      ) : proyecto.etapa == 1 ? (
        <div>
          <h1>Segunda etapa como Jefe</h1>
        </div>
      ) : proyecto.etapa == 3 ? (
        <>
          <h1>Cuarta etapa como Jefe</h1>
        </>
      ) : proyecto.etapa == 4 ? (
        <div>
          <h1>Quinta etapa como Jefe</h1>
        </div>
      ) : proyecto.etapa == 5 ? (
        <div>
          <h1>Sexta etapa como Jefe</h1>
        </div>
      ) : proyecto.etapa == 7 ? (
        <div>
          <h1>Octava etapa como Jefe</h1>
        </div>
      ) : null}
    </div>
  );
}
