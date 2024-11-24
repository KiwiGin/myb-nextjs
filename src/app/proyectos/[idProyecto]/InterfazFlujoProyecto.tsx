"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { useEffect, useState } from "react";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { InterfazAsignacionRepuestos } from "./InterfazAsignacionRepuestos";
import { InterfazAsignacionTareas } from "./InterfazAsignacionTareas";
import { Proyecto } from "@/models/proyecto";
import { InterfazVerificacionReparacion } from "./InterfazVerificacionReparacion";
import { InterfazGenerarCC } from "./InterfazGenerarCC";
import { InterfazGenerarVentas } from "./InterfazGenerarVentas";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";

export function InterfazFlujoProyecto({ idProyecto }: { idProyecto: string }) {
  const [proyecto, setProyecto] = useState<Proyecto>();
  const [empleadoRol, setEmpleadoRol] = useState<"jefe" | "supervisor">("jefe");
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando proyecto...",
  });

  useEffect(() => {
    // fetch from GET /api/proyecto/por-id/:idProyecto
    const fetchProyecto = async () => {
      try {
        const response = await fetch(`/api/proyecto/por-id/${idProyecto}`);
        if (!response.ok) throw new Error("Error al cargar el proyecto");
        const data: Proyecto = await response.json();
        /* setProyecto(data); */
        setProyecto({ ...data });
        setNoice(null);
      } catch (error) {
        if (error instanceof MyBError)
          setNoice({ type: "error", message: error.message });
        else
          setNoice({ type: "error", message: "Error al cargar el proyecto" });
        console.error(error);
      }
    };

    fetchProyecto();
  }, [idProyecto]);

  if (!proyecto) return noice && <Noice noice={noice} />;

  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      {noice && <Noice noice={noice} />}
      <ProyectoHeader proyecto={proyecto} />
      <ProjectFlow etapa={Number(proyecto.idEtapaActual) - 1} />
      <div className="w-full">
        {empleadoRol == "jefe" ? (
          proyecto.idEtapaActual == 1 ? (
            <InterfazAsignacionRepuestos proyecto={proyecto} />
          ) : proyecto.idEtapaActual == 2 ? (
            <InterfazAsignacionTareas
              etapaLabel="Reparación"
              proyecto={proyecto}
            />
          ) : proyecto.idEtapaActual == 6 ? (
            <InterfazAsignacionTareas
              etapaLabel="Pintado y Embalado"
              proyecto={proyecto}
            />
          ) : proyecto.idEtapaActual == 8 ? (
            <InterfazGenerarVentas idProyecto={proyecto.idProyecto || -1} />
          ) : null
        ) : (
          empleadoRol === "supervisor" &&
          (proyecto.idEtapaActual == 4 ? (
            <InterfazVerificacionReparacion
              idProyecto={proyecto.idProyecto || -1}
            />
          ) : proyecto.idEtapaActual == 5 ? (
            <InterfazGenerarCC idProyecto={proyecto.idProyecto || -1} />
          ) : null)
        )}
      </div>
    </div>
  );
}
