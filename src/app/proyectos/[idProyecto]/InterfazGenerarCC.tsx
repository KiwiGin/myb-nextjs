import { InformeSection } from "@/components/InformeSection";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { useState } from "react";

export function InterfazGenerarCC({ idProyecto }: { idProyecto: number }) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const generarInformeCC = async () => {
    /* const response = await fetch(`/api/proyecto/${idProyecto}/generar-cc`, {
        method: "POST",
      }); 
      */

    // Simulación de llamada al backend
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  };

  const handleGenerarCC = async () => {
    setNoice({
      type: "loading",
      message: "Generando informe de control de calidad",
      styleType: "modal",
    });

    try {
      await generarInformeCC();

      setNoice({
        type: "success",
        message: "CC generado exitosamente",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
        }, 2000);
      });
    } catch {
      setNoice({ type: "error", message: "Error al generar CC" });
    }
  };

  return (
    <div className="w-full flex flex-row justify-center">
      {noice && <Noice noice={noice} />}
      <InformeSection
        informeLabel="Control de Calidad"
        handleGenerar={handleGenerarCC}
      />
    </div>
  );
}
