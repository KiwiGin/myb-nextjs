"use client";
import { Proyecto, HistorialProyecto } from "@/models/proyecto";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  ViewProps,
} from "@react-pdf/renderer";
import { ContentCC } from "@/components/InformeCC";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    padding: 15,
    margin: 2,
    borderRadius: 10, // Bordes redondeados
    borderWidth: 1,
    borderColor: "#c0c0c0", // Borde gris claro
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
});

export const InformeVentas = ({ proyecto, historial }: { proyecto: Proyecto, historial: HistorialProyecto }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>
            Informe de Ventas para el proyecto: {proyecto.titulo}
          </Text>
          <CardPDF title="Datos del proyecto">
            <Text style={styles.text}>Titulo: {proyecto.titulo}</Text>

            <Text style={styles.text}>Descripción: {proyecto.descripcion}</Text>

            <Text style={styles.text}>
              Fecha de inicio:{" "}
              {proyecto.fechaInicio?.toLocaleDateString("es-PE", {
                timeZone: "America/Lima",
              })}
            </Text>

            <Text style={styles.text}>
              Fecha de fin:{" "}
              {proyecto.fechaFin?.toLocaleDateString("es-PE", {
                timeZone: "America/Lima",
              })}
            </Text>

            <Text style={styles.text}>
              Jefe a cargo: {proyecto.jefe?.nombre} {proyecto.jefe?.apellido}
            </Text>

            <Text style={styles.text}>
              Supervisor a cargo: {proyecto.supervisor?.nombre}{" "}
              {proyecto.supervisor?.apellido}
            </Text>
          </CardPDF>

          <CardPDF title="Costos">
            <Text style={styles.text}>
              Costo de Repuestos: S/. {proyecto.costoRepuestos}
            </Text>
            <Text style={styles.text}>
              Costo total: S/. {proyecto.costoTotal}
            </Text>
            <Text style={styles.text}>
              Costo de mano de obra: S/. {proyecto.costoManoObra}
            </Text>
          </CardPDF>

          <CardPDF title="Cliente">
            <Text style={styles.text}>Nombre: {proyecto.cliente?.nombre}</Text>
            <Text style={styles.text}>DNI: {proyecto.cliente?.ruc}</Text>
            <Text style={styles.text}>
              Teléfono: {proyecto.cliente?.telefono}
            </Text>
            <Text style={styles.text}>Correo: {proyecto.cliente?.correo}</Text>
            <Text style={styles.text}>
              Dirección: {proyecto.cliente?.direccion}
            </Text>
          </CardPDF>

          <CardPDF title="Repuestos">
            {proyecto.repuestos ? (
              proyecto.repuestos.map((repuesto, index) => (
                <CardPDF
                  key={index}
                  title={`${index + 1}. ${repuesto.nombre}`}
                  wrap={false}
                >
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {repuesto.linkImg && (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <Image
                        src={repuesto.linkImg}
                        style={{ width: 100, height: 100 }}
                      />
                    )}

                    <View style={{ flex: 1 }}>
                      <Text style={styles.text}>
                        Precio: S/. {repuesto.precio}
                      </Text>
                      <Text style={styles.text}>
                        Cantidad: {repuesto.cantidad}
                      </Text>
                      <Text style={styles.text}>
                        Descripción: {repuesto.descripcion}
                      </Text>
                    </View>
                  </View>
                </CardPDF>
              ))
            ) : (
              <Text style={styles.text}>No se han asignado repuestos</Text>
            )}
          </CardPDF>

          <CardPDF title="Especificaciones de Pruebas">
            {proyecto.especificaciones ? (
              proyecto.especificaciones.map((especificacion, index) => (
                <CardPDF
                  key={index}
                  title={`${index + 1}. ${especificacion.nombre}`}
                >
                  {especificacion.parametros.map((parametro) => (
                    <View key={parametro.idParametro}>
                      <Text style={styles.text}>
                        Parámetro: {parametro.nombre}
                      </Text>
                      <Text style={styles.text}>
                        Unidad: {parametro.unidades}
                      </Text>
                      <Text style={styles.text}>
                        Rango: {parametro.valorMinimo} - {parametro.valorMaximo}
                      </Text>
                    </View>
                  ))}
                </CardPDF>
              ))
            ) : (
              <Text style={styles.text}>No se han asignado pruebas</Text>
            )}
          </CardPDF>

          <CardPDF title="Historial del Proyecto">
            {/* Etapas con empleados asignados */}
            <CardPDF title="Etapas y Empleados">
              {historial.etapasEmpleados && historial.etapasEmpleados.length > 0 ? (
                historial.etapasEmpleados.map((etapa, index) => (
                  <CardPDF key={etapa.idEtapa} title={`${index + 1}. ${etapa.nombreEtapa}`}>
                    {etapa.empleados.length > 0 ? (
                      etapa.empleados.map((empleado, empIndex) => (
                        <Text key={empIndex} style={styles.text}>
                          - {empleado.nombre} {empleado.apellido}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.text}>No hay empleados asignados</Text>
                    )}
                  </CardPDF>
                ))
              ) : (
                <Text style={styles.text}>No hay etapas con empleados asignados</Text>
              )}
            </CardPDF>

            {/* Cambios en las etapas */}
            {historial.etapasCambios && historial.etapasCambios.length > 0 ? (
              historial.etapasCambios.map((cambio, index) => (
                <CardPDF key={cambio.idEtapaCambio} title={`${index + 1}. ${cambio.nombreEtapa}`}>
                  <Text style={styles.text}>
                    Fecha de inicio: {new Date(cambio.fechaInicio).toLocaleDateString("es-PE")}
                  </Text>
                  <Text style={styles.text}>
                    Fecha de fin:{" "}
                    {cambio.fechaFin
                      ? new Date(cambio.fechaFin).toLocaleDateString("es-PE")
                      : "En curso"}
                  </Text>
                </CardPDF>
              ))
            ) : (
              <Text style={styles.text}>No hay cambios de etapas registrados</Text>
            )}
          </CardPDF>

          {/* <CardPDF title="Historial de Pruebas">
            <ContentCC proyecto={proyecto} />
          </CardPDF> */}
        </View>
      </Page>
    </Document>
  );
};

const cardStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
  },
});

const CardPDF = ({
  title,
  children,
  ...props
}: {
  title: string;
  children: React.ReactNode;
} & ViewProps) => {
  return (
    <View style={styles.section} {...props}>
      <Text style={cardStyles.title}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};
