import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Proyecto } from "@/models/proyecto";
import { ResultadoPrueba } from "@/models/resultado";
import { useState } from "react";

export function ResultadosModal({ open, onClose, proyecto }: { open: boolean, onClose: (open: boolean) => void, proyecto: Proyecto }) {
  const [resultadosAnteriores] = useState<ResultadoPrueba[]>(proyecto?.resultados || []);

  // Filtrar resultados técnicos (no respuestas del supervisor)
  const resultadosFiltrados = resultadosAnteriores.filter(
    (resultado) =>
      !proyecto.feedbacks?.some((feedback) => feedback.idResultadoPruebaSupervisor === resultado.idResultadoPrueba)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">Resultados Anteriores</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-4 text-gray-600">
          Estos son los resultados técnicos registrados y sus comentarios asociados.
        </DialogDescription>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {resultadosFiltrados.length > 0 ? (
            resultadosFiltrados
              .toSorted((a, b) => b.idResultadoPrueba - a.idResultadoPrueba)
              .map((resultado) => {
                // Verificar si este resultado técnico tiene feedback
                const feedbackRelacionado = proyecto.feedbacks?.find(
                  (fb) => fb.idResultadoPruebaTecnico === resultado.idResultadoPrueba
                );

                const esRechazado = feedbackRelacionado && !feedbackRelacionado.aprobado;
                const esAprobado = feedbackRelacionado && feedbackRelacionado.aprobado;

                // Buscar resultado del supervisor relacionado
                const resultadoSupervisor = feedbackRelacionado
                  ? resultadosAnteriores.find(
                      (res) => res.idResultadoPrueba === feedbackRelacionado.idResultadoPruebaSupervisor
                    )
                  : null;

                return (
                  <div
                    key={resultado.idResultadoPrueba}
                    className={`p-4 border-2 rounded-md ${
                      esRechazado
                        ? "border-red-500 bg-red-100"
                        : esAprobado
                        ? "border-green-500 bg-green-100"
                        : "border-gray-300"
                    }`}
                  >
                    <p className="text-sm text-gray-700">Fecha: {new Date(resultado.fecha).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-700">
                      Empleado: {proyecto.empleadosActuales?.find((e) => e.idEmpleado === resultado.idEmpleado)?.nombre}
                    </p>
                    <div className="mt-2 space-y-2">
                      {resultado.resultados.map((prueba) => (
                        <div key={prueba.idTipoPrueba} className="border-t pt-2">
                          <p className="font-medium text-gray-800">
                            Prueba: {proyecto.especificaciones?.find((e) => e.idTipoPrueba === prueba.idTipoPrueba)?.nombre}
                          </p>
                          <div className="ml-4 space-y-1">
                            {prueba.resultadosParametros.map((parametro) => {
                              const especificacionParametro = proyecto.especificaciones
                                ?.find((e) => e.idTipoPrueba === prueba.idTipoPrueba)
                                ?.parametros.find((p) => p.idParametro === parametro.idParametro);
                              return (
                                <p key={parametro.idParametro} className="text-sm text-gray-600">
                                  {parametro.nombre}: {parametro.resultado} {parametro.unidades} (
                                  Rango: {especificacionParametro?.valorMinimo} a {especificacionParametro?.valorMaximo})
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comentario del feedback */}
                    {feedbackRelacionado && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-800">Comentario del Supervisor:</p>
                        <p className="text-sm text-gray-700">{feedbackRelacionado.comentario}</p>
                        <p className="text-sm text-gray-700">
                          Aprobado: <span className="font-bold">{feedbackRelacionado.aprobado ? "Sí" : "No"}</span>
                        </p>
                      </div>
                    )}

                    {/* Resultado del supervisor como respuesta */}
                    {resultadoSupervisor && (
                      <div className="mt-4 p-3 border-l-2 border-gray-400 bg-gray-100">
                        <p className="font-medium text-gray-800">Respuesta del Supervisor:</p>
                        <p className="text-sm text-gray-700">
                          Fecha: {new Date(resultadoSupervisor.fecha).toLocaleDateString()}
                        </p>
                        {resultadoSupervisor.resultados.map((prueba) => (
                          <div key={prueba.idTipoPrueba} className="mt-2">
                            <p className="font-medium text-gray-800">
                              Prueba: {proyecto.especificaciones?.find((e) => e.idTipoPrueba === prueba.idTipoPrueba)?.nombre}
                            </p>
                            <div className="ml-4 space-y-1">
                              {prueba.resultadosParametros.map((parametro) => (
                                <p key={parametro.idParametro} className="text-sm text-gray-600">
                                  {parametro.nombre}: {parametro.resultado} {parametro.unidades}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
          ) : (
            <p className="text-gray-600">No hay resultados anteriores disponibles.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
