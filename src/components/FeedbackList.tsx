import { FeedbackResultados } from "@/models/feedback";
import { TipoPruebaEspecificacion } from "@/models/tipoprueba";
import { PruebasTable } from "@/components/PruebasTable";

interface FeedbackListProps {
  feedback?: Pick<FeedbackResultados, "resultados">;
  pruebas: TipoPruebaEspecificacion[];
  className?: string;
  messageNothingAdded: string;
}

export function FeedbackList({
  feedback,
  pruebas,
  className,
  messageNothingAdded,
}: FeedbackListProps) {
  return (
    <PruebasTable<TipoPruebaEspecificacion>
      pruebas={pruebas}
      className={className}
      messageNothingAdded={messageNothingAdded}
      columnas={
        <>
          <th scope="col" className="px-2 py-3">
            Resultado Tecnico
          </th>
          <th scope="col" className="px-2 py-3">
            Resultado Supervisor
          </th>
        </>
      }
      filas={(prueba_index, espec_index, espec) => {
        const resultado = feedback?.resultados?.find(
          (res) => res.idParametro === espec.idParametro
        );
        return (
          <>
            <td
              className={`px-2 min-w-16 py-4 bg-opacity-50 ${
                Number(espec.valorMaximo) <
                  Number(resultado?.resultadoTecnico) ||
                Number(espec.valorMinimo) > Number(resultado?.resultadoTecnico)
                  ? "bg-red-500"
                  : "bg-emerald-400"
              }`}
            >
              {resultado?.resultadoTecnico}
            </td>
            <td
              className={`px-2 py-4 bg-opacity-50 ${
                Number(espec.valorMaximo) <
                  Number(resultado?.resultadoSupervisor) ||
                Number(espec.valorMinimo) >
                  Number(resultado?.resultadoSupervisor)
                  ? "bg-red-500"
                  : "bg-emerald-400"
              }`}
            >
              {resultado?.resultadoSupervisor}
            </td>
          </>
        );
      }}
    />
  );
}
