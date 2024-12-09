import { Noice } from "@/components/Noice";
import { Button } from "@/components/ui/button";
import MyBError from "@/lib/mybError";
import { NoiceType } from "@/models/noice";
import { Proyecto } from "@/models/proyecto";
import { useState } from "react";

export function InterfazSeguimientoTareasPintado({
  proyecto,
  idEmpleado,
}: {
  proyecto: Proyecto;
  idEmpleado: string;
}) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNoice({
      type: "loading",
      message: "Registrando completado de tarea de pintado y embalado....",
      styleType: "modal",
    });

    try {
      const response = await fetch(`/api/proyecto/etapa`, {
        method: "PUT",
        body: JSON.stringify({
          idProyecto: proyecto.idProyecto,
          idEtapa: 8,
          fechaInicio: new Date(),
        }),
      });
  
      if (!response.ok) throw new Error("Error al cambiar de etapa");

      setNoice({
        type: "success",
        message: "Tarea de pintado y embalado completada con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({
          type: "error",
          message: "Error en el registro de la tarea de pintado y embalado",
        });
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex flex-row justify-center py-7"
    >
      {noice && <Noice noice={noice} />}
      <Button type="submit" className="sm:w-1/2 lg:w-1/4">
        Completar Tarea de pintado y embalado
      </Button>
    </form>
  );
}
