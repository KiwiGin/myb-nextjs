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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InterfazReparando } from "./InterfazReparando";
import { InterfazPintadoYEmbalado } from "./InterfazPintadoYEmbalado";

export function InterfazFlujoProyecto({ idProyecto }: { idProyecto: string }) {
  const [proyecto, setProyecto] = useState<Proyecto>();
  const [empleadoRol, setEmpleadoRol] = useState<"jefe" | "supervisor">("jefe");
  const router = useRouter();
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando proyecto...",
  });

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const response = await fetch(`/api/proyecto/por-id/${idProyecto}`);
        if (!response.ok) throw new Error("Error al cargar el proyecto");

        const gettedProyecto = await response.json();

        const data: Proyecto = {
          ...gettedProyecto,
          fechaInicio: new Date(`${gettedProyecto.fechaInicio}T00:00:00`),
          fechaFin: new Date(`${gettedProyecto.fechaFin}T00:00:00`),
        };
        /* setProyecto(data); */
        setProyecto({
          ...data,
        });
        setNoice(null);
        console.log("proy: ", data);
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
      {/* Switch beetween Jefe y Supervisor */}
      <Button
        onClick={() =>
          setEmpleadoRol(empleadoRol === "jefe" ? "supervisor" : "jefe")
        }
        className="fixed top-5 right-5 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        {empleadoRol === "jefe" ? "Jefe" : "Supervisor"}
      </Button>

      {noice && <Noice noice={noice} />}
      <div className="w-full">
        <Button
          onClick={() => {
            router.back();
          }}
          variant={"outline"}
        >
          Otros Proyectos
        </Button>
      </div>

      <ProyectoHeader proyecto={proyecto} showSeeDetailsBtn={true} />
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
            <InterfazGenerarVentas proyecto={proyecto} />
          ) : null
        ) : (
          empleadoRol === "supervisor" &&
          (proyecto.idEtapaActual == 4 ? (
            <InterfazVerificacionReparacion
              proyecto={proyecto}
              idEmpleado={1}
            />
          ) : proyecto.idEtapaActual == 5 ? (
            <InterfazGenerarCC proyecto={proyecto} />
          ) : null)
        )}
        {proyecto.idEtapaActual == 3 ? (
          <InterfazReparando proyecto={proyecto}/>
        ) : proyecto.idEtapaActual == 7 ? (
          <InterfazPintadoYEmbalado proyecto={proyecto}/>
        ) : null}
      </div>
    </div>
  );
}
