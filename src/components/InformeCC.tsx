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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  highlight: {
    fontWeight: "bold",
    fontSize: 12,
  },
  sectionContent: {
    marginBottom: 16,
    paddingLeft: 12,
    borderLeft: "2px solid #d1d5db",
  },
  feedback: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
});

export const InformeCC = ({ proyecto }: { proyecto: Proyecto }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Informe de Control de Calidad
        </Text>
        <Text style={styles.subtitle}>Proyecto: {proyecto.titulo}</Text>
        <ContentCC proyecto={proyecto} />
      </Page>
    </Document>
  );
};

export const ContentCC = ({ proyecto }: { proyecto: Proyecto }) => {
  const [resultadosAnteriores] = useState<ResultadoPrueba[]>(
    proyecto?.resultados || []
  );

  const resultadosFiltrados = resultadosAnteriores.filter(
    (resultado) =>
      !proyecto.feedbacks?.some(
        (feedback) =>
          feedback.idResultadoPruebaSupervisor === resultado.idResultadoPrueba
      )
  );

  return (
    <View style={styles.section}>
      {resultadosFiltrados.length > 0 ? (
        resultadosFiltrados
          .toSorted((a, b) => b.idResultadoPrueba - a.idResultadoPrueba)
          .map((resultado, index) => {
            const feedbackRelacionado = proyecto.feedbacks?.find(
              (fb) =>
                fb.idResultadoPruebaTecnico === resultado.idResultadoPrueba
            );

            const esRechazado =
              feedbackRelacionado && !feedbackRelacionado.aprobado;
            const esAprobado =
              feedbackRelacionado && feedbackRelacionado.aprobado;

            const resultadoSupervisor = feedbackRelacionado
              ? resultadosAnteriores.find(
                  (res) =>
                    res.idResultadoPrueba ===
                    feedbackRelacionado.idResultadoPruebaSupervisor
                )
              : null;

            return (
              <View key={index} style={styles.sectionContent} wrap={false}>
                <Text style={styles.text}>
                  <Text style={styles.highlight}>Fecha:</Text> {new Date(resultado.fecha).toLocaleDateString()}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.highlight}>Empleado:</Text> {proyecto.empleadosActuales?.find(
                    (e) => e.idEmpleado === resultado.idEmpleado
                  )?.nombre || "Desconocido"}
                </Text>

                {resultado.resultados.map((prueba, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <Text style={styles.text}>
                      <Text style={styles.highlight}>Prueba:</Text> {proyecto.especificaciones?.find(
                        (e) => e.idTipoPrueba === prueba.idTipoPrueba
                      )?.nombre || "Desconocido"}
                    </Text>
                    <View style={{ marginLeft: 16 }}>
                      {prueba.resultadosParametros.map((parametro, index) => (
                        <Text style={styles.text} key={index}>
                          <Text style={styles.highlight}>{parametro.nombre}:</Text> {parametro.resultado} {parametro.unidades} 
                          (Min: {proyecto.especificaciones?.find(
                            (e) => e.idTipoPrueba === prueba.idTipoPrueba
                          )?.parametros.find(
                            (p) => p.idParametro === parametro.idParametro
                          )?.valorMinimo} - Max: {proyecto.especificaciones?.find(
                            (e) => e.idTipoPrueba === prueba.idTipoPrueba
                          )?.parametros.find(
                            (p) => p.idParametro === parametro.idParametro
                          )?.valorMaximo})
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}

                {feedbackRelacionado && (
                  <View style={styles.feedback}>
                    <Text style={styles.text}>
                      <Text style={styles.highlight}>Comentario:</Text> {feedbackRelacionado.comentario}
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.highlight}>Aprobado:</Text> {feedbackRelacionado.aprobado ? "Sí" : "No"}
                    </Text>
                  </View>
                )}

                {resultadoSupervisor && (
                  <View style={styles.feedback}>
                    <Text style={styles.text}>
                      <Text style={styles.highlight}>Respuesta del Supervisor:</Text>
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.highlight}>Fecha:</Text> {new Date(resultadoSupervisor.fecha).toLocaleDateString()}
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.highlight}>Empleado:</Text> {resultadoSupervisor.idEmpleado}
                    </Text>
                    {resultadoSupervisor.resultados.map((prueba, index) => (
                      <View key={index} style={{ marginBottom: 12 }}>
                        <Text style={styles.text}>
                          <Text style={styles.highlight}>Prueba:</Text> {proyecto.especificaciones?.find(
                            (e) => e.idTipoPrueba === prueba.idTipoPrueba
                          )?.nombre || "Desconocido"}
                        </Text>
                        <View style={{ marginLeft: 16 }}>
                          {prueba.resultadosParametros.map((parametro, index) => (
                            <Text style={styles.text} key={index}>
                              <Text style={styles.highlight}>{parametro.nombre}:</Text> {parametro.resultado} {parametro.unidades}
                            </Text>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
      ) : (
        <Text style={styles.text}>No hay resultados anteriores disponibles.</Text>
      )}
    </View>
  );
};