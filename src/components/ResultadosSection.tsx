import { FeedbackResultados } from "@/models/feedback";
import { TipoPruebaEspecificacion } from "@/models/tipoprueba";

interface ResultadosSectionProps {
  feedback?: FeedbackResultados;
  pruebas: TipoPruebaEspecificacion[];
  className?: string;
  messageNothingAdded: string;
}

export default function ResultadosSection({
  feedback,
  pruebas,
  className,
  messageNothingAdded,
}: ResultadosSectionProps) {
  return (
    <div className="mx-3 overflow-y-auto" style={{ height: "40h" }}>
      {pruebas.length === 0 ? (
        <p className="w-full text-center">{messageNothingAdded}</p>
      ) : (
        <div className={`${className && className} mb-2`}>
          {pruebas.map((item) => (
            <div key={item.idTipoPrueba} className="relative">
              <div className="flex flex-row justify-between">
                <span
                  className={`text-2xl pb-6 text-left font-medium leading-none`}
                >
                  {item.nombre}
                </span>
              </div>
              <div className="col-span-6 pt-2 flex">
                <div className="overflow-x-auto w-full">
                  <table className="w-full  text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-900">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Parametro
                        </th>
                        {feedback ? (
                          <>
                            <th scope="col" className="px-2 py-3">
                              Resultado Tecnico
                            </th>
                            <th scope="col" className="px-2 py-3">
                              Resultado Supervisor
                            </th>
                          </>
                        ) : (
                          <>
                            <th scope="col" className="px-2 py-3">
                              Resultado
                            </th>
                            <th scope="col" className="px-2 py-3">
                              Valor Min.
                            </th>
                            <th scope="col" className="px-2 py-3">
                              Valor Max.
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {item.especificaciones?.map((espec) => (
                        <tr
                          key={espec.idParametro}
                          className="bg-gray-100 text-black"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {`${espec.nombre}( ${espec.unidad} )`}
                          </th>
                          {(() => {
                            if (feedback) {
                              const resultado = feedback.resultados?.find(
                                (res) => res.idParametro === espec.idParametro
                              );
                              return (
                                <>
                                  <td
                                    className={`px-2 min-w-16 py-4 bg-opacity-50 ${
                                      Number(espec.valorMaximo) <
                                        Number(resultado?.resultadoTecnico) ||
                                      Number(espec.valorMinimo) >
                                        Number(resultado?.resultadoTecnico)
                                        ? "bg-red-500"
                                        : "bg-emerald-400"
                                    }`}
                                  >
                                    {resultado?.resultadoTecnico}
                                  </td>
                                  <td
                                    className={`px-2 py-4 bg-opacity-50 ${
                                      Number(espec.valorMaximo) <
                                        Number(
                                          resultado?.resultadoSupervisor
                                        ) ||
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
                            } else
                              return (
                                <>
                                  <td className="px-2 min-w-16 py-4">
                                    {espec.resultado}
                                  </td>
                                  <td className="px-2 py-4">
                                    {espec.valorMinimo}
                                  </td>
                                  <td className="px-2 py-4">
                                    {espec.valorMaximo}
                                  </td>
                                </>
                              );
                          })()}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
