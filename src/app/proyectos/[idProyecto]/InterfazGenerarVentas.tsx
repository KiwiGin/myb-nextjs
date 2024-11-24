import { InformeSection } from "@/components/InformeSection";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { useState } from "react";

export function InterfazGenerarVentas({ idProyecto }: { idProyecto: number }) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  //LLAMADA AL BACKEND
  const generarInformeVentas = async () => {
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

  const handleGenerarVentas = async () => {
    setNoice({
      type: "loading",
      message: "Generando informe de ventas",
      styleType: "modal",
    });

    try {
      await generarInformeVentas();

      setNoice({
        type: "success",
        message: "Informe de ventas generado",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
        }, 3000);
      });
    } catch {
      setNoice({
        type: "error",
        message: "Error al generar el informe de ventas",
      });
    }
  };

  return (
    <div className="w-full flex flex-row justify-center">
      {noice && <Noice noice={noice} />}
      <InformeSection
        informeLabel="Informe de Ventas"
        handleGenerar={handleGenerarVentas}
      />
    </div>
  );
}
