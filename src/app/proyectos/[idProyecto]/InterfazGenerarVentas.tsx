import { InformeSection } from "@/components/InformeSection";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { useState } from "react";

export function InterfazGenerarVentas({ idProyecto }: { idProyecto: number }) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const handleActualizarEtapa = async () => {
    setNoice({
      type: "loading",
      message: "Actualizando Etapa",
      styleType: "modal",
    });

    try {
      /* const response = await fetch(`/api/proyecto/etapa`, {
        method: "PUT",
        body: JSON.stringify({
          idProyecto: idProyecto,
          idEtapa: 6,
          fechaInicio: new Date(),
        }),
      });
      if (!response.ok) throw new Error("Error al cambiar de etapa"); */

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });

      setNoice({
        type: "success",
        message: "Etapa actualizada exitosamente",
        styleType: "modal",
      });
    } catch {
      setNoice({
        type: "error",
        message: "Error al actualizar la etapa",
      });
    }
  };

  return (
    <div className="w-full flex flex-row justify-center">
      {noice && <Noice noice={noice} />}
      <InformeSection
        informeLabel="Informe de Ventas"
        actualizarEtapa={handleActualizarEtapa}
      />
    </div>
  );
}
