import { GeneratePDF } from "@/components/GeneratePDF";
import { InformeSection } from "@/components/InformeSection";
import { InformeVentas } from "@/components/InformeVentas";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { NoiceType } from "@/models/noice";
import { Proyecto } from "@/models/proyecto";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";

export function InterfazGenerarVentas({ proyecto }: { proyecto: Proyecto }) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const handleActualizarEtapa = async () => {
    setNoice({
      type: "loading",
      message: "Cerrando Proyecto",
      styleType: "modal",
    });

    try {
      const response = await fetch(`/api/proyecto/etapa`, {
        method: "PUT",
        body: JSON.stringify({
          idProyecto: proyecto.idProyecto,
          idEtapa: 9,
          fechaInicio: new Date(),
        }),
      });
      if (!response.ok) throw new MyBError("Error al cambiar de etapa");

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

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 5000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
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
      >
        <>
          <PDFViewer width="100%" height="100%" showToolbar>
            <InformeVentas proyecto={proyecto} />
          </PDFViewer>
          <GeneratePDF
            Documento={() => <InformeVentas proyecto={proyecto} />}
            pdfName={`Informe de Ventas - ${proyecto.titulo}.pdf`}
          />
        </>
      </InformeSection>
    </div>
  );
}
