import { InformeSection } from "@/components/InformeSection";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { Proyecto } from "@/models/proyecto";
import { useEffect, useState } from "react";
import { Document, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { InformeCC } from "@/components/InformeCC";

export function InterfazGenerarCC({ proyecto }: { proyecto: Proyecto }) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  useEffect(() => {
    console.log(proyecto);
  }, [proyecto]);

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

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
        }, 2000);
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
        informeLabel="Control de Calidad"
        actualizarEtapa={handleActualizarEtapa}
      >
        <>
          <PDFViewer width="100%" height="100%" showToolbar>
            <Document>
              <InformeCC proyecto={proyecto} />
            </Document>
          </PDFViewer>
          <GeneratePDF proyecto={proyecto} />
        </>
      </InformeSection>
    </div>
  );
}

const GeneratePDF = ({ proyecto }: { proyecto: Proyecto }) => (
  <PDFDownloadLink
    document={<InformeCC proyecto={proyecto} />}
    fileName="informeCC.pdf"
    style={{
      width: "100%",
      padding: "8px",
      textAlign: "center",
      alignItems: "center",
    }}
  >
    <Button className="w-2/5">Descargar PDF</Button>
  </PDFDownloadLink>
);
