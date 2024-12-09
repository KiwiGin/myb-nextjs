import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Proyecto } from "@/models/proyecto";
import { ResultadoPrueba } from "@/models/resultado";
import { useState } from "react";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: 700,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
  base: {
    marginBottom: 4,
    padding: 2,
    borderWidth: 2,
    borderRadius: 4,
    width: "100%",
  },
  rejected: {
    borderColor: "red",
    backgroundColor: "lightpink",
  },
  approved: {
    borderColor: "green",
    backgroundColor: "lightgreen",
  },
  default: {
    borderColor: "black",
  },
  resultadoSupervisor: {
    marginTop: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
  },
  baseText: {
    fontSize: 12,
    color: "#000",
  },
});

export const InformeCC = ({ proyecto }: { proyecto: Proyecto }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Informe de Control de Calidad para el Proyecto: {proyecto.titulo}
        </Text>
        <ContentCC proyecto={proyecto} />
      </Page>
    </Document>
  );
};

export const ContentCC = ({ proyecto }: { proyecto: Proyecto }) => {
  const [resultadosAnteriores] = useState<ResultadoPrueba[]>(
    proyecto?.resultados || []
  );

  // Filtrar resultados técnicos (no respuestas del supervisor)
  const resultadosFiltrados = resultadosAnteriores.filter(
    (resultado) =>
      !proyecto.feedbacks?.some(
        (feedback) =>
          feedback.idResultadoPruebaSupervisor === resultado.idResultadoPrueba
      )
  );

  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      {resultadosFiltrados.length > 0 ? (
        resultadosFiltrados
          .toSorted((a, b) => b.idResultadoPrueba - a.idResultadoPrueba)
          .map((resultado, index) => {
            // Verificar si este resultado técnico tiene feedback
            const feedbackRelacionado = proyecto.feedbacks?.find(
              (fb) =>
                fb.idResultadoPruebaTecnico === resultado.idResultadoPrueba
            );

            const esRechazado =
              feedbackRelacionado && !feedbackRelacionado.aprobado;
            const esAprobado =
              feedbackRelacionado && feedbackRelacionado.aprobado;

            // Buscar resultado del supervisor relacionado
            const resultadoSupervisor = feedbackRelacionado
              ? resultadosAnteriores.find(
                  (res) =>
                    res.idResultadoPrueba ===
                    feedbackRelacionado.idResultadoPruebaSupervisor
                )
              : null;

            let containerStyle = styles.base; // Estilo base por defecto

            if (esRechazado) {
              containerStyle = { ...styles.base, ...styles.rejected };
            } else if (esAprobado) {
              containerStyle = { ...styles.base, ...styles.approved };
            } else {
              containerStyle = { ...styles.base, ...styles.default };
            }

            return (
              <View key={index} style={containerStyle} wrap={false}>
                <Text style={styles.baseText}>
                  Fecha: {new Date(resultado.fecha).toLocaleDateString()}
                </Text>
                <Text style={styles.baseText}>
                  Empleado:{" "}
                  {proyecto.empleadosActuales?.find(
                    (e) => e.idEmpleado === resultado.idEmpleado
                  )?.nombre || "Desconocido"}
                </Text>
                {resultado.resultados.map((prueba, index) => (
                  <View key={index} style={{ marginBottom: 8 }}>
                    <Text style={styles.baseText}>
                      Prueba:{" "}
                      {
                        proyecto.especificaciones?.filter(
                          (e) => e.idTipoPrueba === prueba.idTipoPrueba
                        )[0]?.nombre
                      }
                    </Text>
                    <View style={{ marginLeft: 16 }}>
                      {prueba.resultadosParametros.map((parametro, index) => (
                        <Text style={styles.baseText} key={index}>
                          {parametro.nombre}: {parametro.resultado}{" "}
                          {parametro.unidades} -{" "}
                          {
                            proyecto.especificaciones
                              ?.filter(
                                (e) => e.idTipoPrueba === prueba.idTipoPrueba
                              )[0]
                              ?.parametros.filter(
                                (p) => p.idParametro === parametro.idParametro
                              )[0]?.valorMinimo
                          }{" "}
                          -{" "}
                          {
                            proyecto.especificaciones
                              ?.filter(
                                (e) => e.idTipoPrueba === prueba.idTipoPrueba
                              )[0]
                              ?.parametros.filter(
                                (p) => p.idParametro === parametro.idParametro
                              )[0]?.valorMaximo
                          }
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}

                {/* Comentario del feedback */}
                {feedbackRelacionado && (
                  <View style={{ marginTop: 16 }}>
                    <Text style={styles.baseText}>
                      Comentario: {feedbackRelacionado.comentario}
                    </Text>
                    <Text style={styles.baseText}>
                      Aprobado: {feedbackRelacionado.aprobado ? "Sí" : "No"}
                    </Text>
                  </View>
                )}

                {/* Resultado del supervisor como respuesta */}
                {resultadoSupervisor && (
                  <View style={styles.resultadoSupervisor}>
                    <Text style={styles.baseText}>
                      <Text style={styles.baseText}>
                        Respuesta del Supervisor:
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Fecha:{" "}
                      {new Date(resultadoSupervisor.fecha).toLocaleDateString()}
                    </Text>
                    <Text style={styles.baseText}>
                      Empleado: {resultadoSupervisor.idEmpleado}
                    </Text>
                    {resultadoSupervisor.resultados.map((prueba, index) => (
                      <View key={index} style={{ marginBottom: 8 }}>
                        <Text style={styles.baseText}>
                          Prueba:{" "}
                          {
                            proyecto.especificaciones?.filter(
                              (e) => e.idTipoPrueba === prueba.idTipoPrueba
                            )[0]?.nombre
                          }
                        </Text>
                        <View style={{ marginLeft: 16 }}>
                          {prueba.resultadosParametros.map(
                            (parametro, index) => (
                              <Text style={styles.baseText} key={index}>
                                {parametro.nombre}: {parametro.resultado}{" "}
                                {parametro.unidades}
                              </Text>
                            )
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
      ) : (
        <Text>No hay resultados anteriores disponibles.</Text>
      )}
    </View>
  );
};
