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
          <DialogTitle>Resultados Anteriores</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="max-h-96 overflow-y-auto">
          {resultadosFiltrados.length > 0 ? (
            resultadosFiltrados
              .toSorted((a, b) => b.idResultadoPrueba - a.idResultadoPrueba)
              .map((resultado, index) => {
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
                  <div key={index} className={`mb-4 p-2 border-2 rounded-md ${esRechazado ? "border-red-500 bg-red-100" : esAprobado ? "border-green-500 bg-green-100" : "border-black"}`}>
                    <p>Fecha: {new Date(resultado.fecha).toLocaleDateString()}</p>
                    <p>Empleado: {proyecto.empleadosActuales?.find((e) => e.idEmpleado === resultado.idEmpleado)?.nombre}</p>
                    {resultado.resultados.map((prueba, index) => (
                      <div key={index} className="mb-2">
                        <p>Prueba: {proyecto.especificaciones?.filter((e) => e.idTipoPrueba === prueba.idTipoPrueba)[0]?.nombre}</p>
                        <div className="ml-4">
                          {prueba.resultadosParametros.map((parametro, index) => (
                            <p key={index}>
                              {parametro.nombre}: {parametro.resultado} {parametro.unidad} -{" "}
                              {proyecto.especificaciones
                                ?.filter((e) => e.idTipoPrueba === prueba.idTipoPrueba)[0]
                                ?.parametros.filter((p) => p.idParametro === parametro.idParametro)[0]?.valorMinimo}{" "}
                              -{" "}
                              {proyecto.especificaciones
                                ?.filter((e) => e.idTipoPrueba === prueba.idTipoPrueba)[0]
                                ?.parametros.filter((p) => p.idParametro === parametro.idParametro)[0]?.valorMaximo}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Comentario del feedback */}
                    {feedbackRelacionado && (
                      <div className="mt-4">
                        <p>
                          <strong>Comentario:</strong> {feedbackRelacionado.comentario}
                        </p>
                        <p>
                          <strong>Aprobado:</strong> {feedbackRelacionado.aprobado ? "Sí" : "No"}
                        </p>
                      </div>
                    )}

                    {/* Resultado del supervisor como respuesta */}
                    {resultadoSupervisor && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-400 bg-gray-100">
                        <p>
                          <strong>Respuesta del Supervisor:</strong>
                        </p>
                        <p>Fecha: {new Date(resultadoSupervisor.fecha).toLocaleDateString()}</p>
                        <p>Empleado: {resultadoSupervisor.idEmpleado}</p>
                        {resultadoSupervisor.resultados.map((prueba, index) => (
                          <div key={index} className="mb-2">
                            <p>
                              Prueba:{" "}
                              {proyecto.especificaciones?.filter(
                                (e) => e.idTipoPrueba === prueba.idTipoPrueba
                              )[0]?.nombre}
                            </p>
                            <div className="ml-4">
                              {prueba.resultadosParametros.map((parametro, index) => (
                                <p key={index}>
                                  {parametro.nombre}: {parametro.resultado} {parametro.unidad}
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
            <p>No hay resultados anteriores disponibles.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
