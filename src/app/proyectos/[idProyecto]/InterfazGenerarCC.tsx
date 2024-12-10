import { InformeSection } from "@/components/InformeSection";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { Proyecto } from "@/models/proyecto";
import { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { InformeCC } from "@/components/InformeCC";
import { GeneratePDF } from "@/components/GeneratePDF";
import MyBError from "@/lib/mybError";

export function InterfazGenerarCC({ proyecto }: { proyecto: Proyecto }) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const handleActualizarEtapa = async () => {
    setNoice({
      type: "loading",
      message: "Actualizando Etapa",
      styleType: "modal",
    });

    try {
      const response = await fetch(`/api/proyecto/etapa`, {
        method: "PUT",
        body: JSON.stringify({
          idProyecto: proyecto.idProyecto,
          idEtapa: 6,
          fechaInicio: new Date(),
        }),
      });

      if (!response.ok) throw new MyBError("Error al cambiar de etapa");

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
        }, 2000);
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
        informeLabel="Control de Calidad"
        actualizarEtapa={handleActualizarEtapa}
        canUpdateStage={true}
      >
        <>
          <PDFViewer width="100%" height="100%" showToolbar>
            <InformeCC proyecto={proyecto} />
          </PDFViewer>
          <GeneratePDF
            Documento={() => <InformeCC proyecto={proyecto} />}
            pdfName={`Informe de Control de Calidad - ${proyecto.titulo}.pdf`}
          />
        </>
      </InformeSection>
    </div>
  );
}
