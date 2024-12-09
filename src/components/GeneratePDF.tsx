import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "./ui/button";

interface GeneratePDFProps {
  Documento: () => React.ReactNode;
  pdfName: string;
}

export const GeneratePDF = ({ Documento, pdfName }: GeneratePDFProps) => (
  <PDFDownloadLink
    document={<Documento />}
    fileName={pdfName}
    style={{
      width: "100%",
      padding: "8px",
      textAlign: "center",
      alignItems: "center",
    }}
  >
    <Button variant={"outline"} className="w-2/5">
      Descargar PDF
    </Button>
  </PDFDownloadLink>
);
