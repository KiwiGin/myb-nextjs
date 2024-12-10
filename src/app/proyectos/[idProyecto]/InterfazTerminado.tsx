import { GeneratePDF } from "@/components/GeneratePDF";
import { InformeCC } from "@/components/InformeCC";
import { InformeSection } from "@/components/InformeSection";
import { InformeVentas } from "@/components/InformeVentas";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { NoiceType } from "@/models/noice";
import { Proyecto, HistorialProyecto } from "@/models/proyecto";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

export function InterfazTerminado({ proyecto }: { proyecto: Proyecto }) {
  const [ noice, setNoice ] = useState<NoiceType | null>(null);
  const [ historial, setHistorial ] = useState<HistorialProyecto | null>(null);

  useEffect(() => {
    const fetchProjectHistory = async () => {
      try {
        const response = await fetch(`/api/proyecto/historial/${proyecto.idProyecto}`);
        if (!response.ok) throw new MyBError("Error al obtener historial del proyecto");
  
        const historial = await response.json();
        setHistorial(historial);
        setNoice(null);
      } catch (error) {
        if (error instanceof MyBError)
          setNoice({ type: "error", message: error.message });
        else
          setNoice({
            type: "error",
            message: "Error al obtener historial del proyecto",
          });
      }
    }

    fetchProjectHistory();
  }, [proyecto]);

  if (!historial) return null;

  return (
    <div className="w-full flex flex-col gap-2 content-center">
      {noice && <Noice noice={noice} />}
      <InformeSection
        informeLabel="Informe de Control de Calidad"
        actualizarEtapa={async () => {}}
        canUpdateStage={false}
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
      <InformeSection
        informeLabel="Informe de Ventas"
        actualizarEtapa={async () => {}}
        canUpdateStage={false}
      >
        <>
          <PDFViewer width="100%" height="100%" showToolbar>
            <InformeVentas proyecto={proyecto} historial={historial!} />
          </PDFViewer>
          <GeneratePDF
            Documento={() => <InformeVentas proyecto={proyecto} historial={historial!} />}
            pdfName={`Informe de Ventas - ${proyecto.titulo}.pdf`}
          />
        </>
      </InformeSection>
    </div>
  );
}
