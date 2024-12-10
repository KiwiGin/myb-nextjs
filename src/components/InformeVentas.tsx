"use client";
import { Proyecto, HistorialProyecto } from "@/models/proyecto";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "light",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    borderBottom: 1,
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
  tableContainer: {
    marginTop: 20,
    marginBottom: 20,
    breakAfter: "always", // Esto asegura que la tabla comience en una nueva página
  },
  table: {
    display: "flex",
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
    marginBottom: 20, // Espaciado inferior
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0", // Fondo claro para destacar encabezado
    borderBottom: "2px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    breakInside: "avoid", // Evita cortes de fila entre páginas
  },
  tableCell: {
    flex: 1,
    padding: 8,
    border: "1px solid #000",
    fontSize: 12,
    textAlign: "center", // Centrado para claridad
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    border: "1px solid #000",
    fontSize: 12,
    fontWeight: "bold", // Estilo destacado
    textAlign: "center",
  },
  employeeDetails: {
    marginBottom: 10,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export const InformeVentas = ({
  proyecto,
  historial,
}: {
  proyecto: Proyecto;
  historial: HistorialProyecto;
}) => {
  console.log(historial);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado del informe */}
        <View style={styles.header}>
          <Text style={styles.title}>Informe del Proyecto</Text>
          <Text style={styles.subtitle}>
            {proyecto.titulo.toUpperCase()}
          </Text>
        </View>

        {/* Sección de información general */}
        <View>
          <Text style={styles.sectionTitle}>Información General</Text>
          <Text style={styles.text}>Título: {proyecto.titulo}</Text>
          <Text style={styles.text}>Descripción: {proyecto.descripcion}</Text>
          <Text style={styles.text}>
            Fecha de inicio:{" "}
            {proyecto.fechaInicio?.toLocaleDateString("es-PE")}
          </Text>
          <Text style={styles.text}>
            Fecha de fin:{" "}
            {proyecto.fechaFin
              ? proyecto.fechaFin.toLocaleDateString("es-PE")
              : "No especificada"}
          </Text>
        </View>

        {/* Jefe del proyecto */}
        <View>
          <Text style={styles.sectionTitle}>Jefe del Proyecto</Text>
          <View style={styles.employeeDetails}>
            <Text style={styles.text}>Nombre: {proyecto.jefe?.nombre} {proyecto.jefe?.apellido}</Text>
            <Text style={styles.text}>Correo: {proyecto.jefe?.correo}</Text>
            <Text style={styles.text}>Teléfono: {proyecto.jefe?.telefono}</Text>
            <Text style={styles.text}>
              Dirección: {proyecto.jefe?.direccion}
            </Text>
          </View>
        </View>

        {/* Supervisor */}
        <View>
          <Text style={styles.sectionTitle}>Supervisor del Proyecto</Text>
          <View style={styles.employeeDetails}>
            <Text style={styles.text}>
              Nombre: {proyecto.supervisor?.nombre}{" "}
              {proyecto.supervisor?.apellido}
            </Text>
            <Text style={styles.text}>Correo: {proyecto.supervisor?.correo}</Text>
            <Text style={styles.text}>
              Teléfono: {proyecto.supervisor?.telefono}
            </Text>
            <Text style={styles.text}>
              Dirección: {proyecto.supervisor?.direccion}
            </Text>
          </View>
        </View>

        {/* Sección de costos */}
        <View>
          <Text style={styles.sectionTitle}>Costos</Text>
          <Text style={styles.text}>
            Costo de mano de obra: S/. {proyecto.costoManoObra ?? "0.00"}
          </Text>
          <Text style={styles.text}>
            Costo de repuestos: S/. {proyecto.costoRepuestos ?? "0.00"}
          </Text>
          <Text style={styles.text}>
            Costo total: S/. {proyecto.costoTotal ?? "0.00"}
          </Text>
        </View>

        {/* Sección de cliente */}
        <View>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text style={styles.text}>Nombre: {proyecto.cliente?.nombre}</Text>
          <Text style={styles.text}>RUC: {proyecto.cliente?.ruc}</Text>
          <Text style={styles.text}>
            Teléfono: {proyecto.cliente?.telefono}
          </Text>
          <Text style={styles.text}>Correo: {proyecto.cliente?.correo}</Text>
          <Text style={styles.text}>
            Dirección: {proyecto.cliente?.direccion}
          </Text>
        </View>

        {/* Sección de repuestos */}
        <View>
          <Text style={styles.sectionTitle}>Repuestos</Text>
          {proyecto.repuestos && proyecto.repuestos.length > 0 ? (
            proyecto.repuestos.map((repuesto, index) => (
              <View key={index}>
                <Text style={styles.text}>
                  {index + 1}. {repuesto.nombre}
                </Text>
                {repuesto.linkImg && (
                  <Image
                    src={repuesto.linkImg}
                    style={styles.image}
                  />
                )}
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
            ))
          ) : (
            <Text style={styles.text}>No se han asignado repuestos.</Text>
          )}
        </View>

        {/* Sección de especificaciones de pruebas */}
        <View>
          <Text style={styles.sectionTitle}>Especificaciones de Pruebas</Text>
          {proyecto.especificaciones && proyecto.especificaciones.length > 0 ? (
            proyecto.especificaciones.map((especificacion, index) => (
              <View key={index}>
                <Text style={styles.text}>
                  {index + 1}. {especificacion.nombre}
                </Text>
                {especificacion.parametros.map((parametro) => (
                  <Text key={parametro.idParametro} style={styles.text}>
                    - {parametro.nombre} ({parametro.unidades}):{" "}
                    {parametro.valorMinimo} a {parametro.valorMaximo}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.text}>
              No se han registrado especificaciones de pruebas.
            </Text>
          )}
        </View>

        {/* Sección de historial del proyecto */}
        <View>
          <Text style={styles.sectionTitle}>Historial del Proyecto</Text>
          {/* Etapas y empleados */}
          <View>
            <Text style={styles.subtitle}>Etapas y Empleados:</Text>
            {historial.etapasEmpleados.length > 0 ? (
              historial.etapasEmpleados.map((etapa, index) => (
                <View key={index}>
                  <Text style={styles.text}>
                    {index + 1}. {etapa.nombreEtapa}
                  </Text>
                  {etapa.empleados.map((empleado, empIndex) => (
                    <View key={empIndex} style={styles.employeeDetails}>
                      <Text style={styles.text}>
                        Nombre: {empleado.nombre} {empleado.apellido}
                      </Text>
                      <Text style={styles.text}>Correo: {empleado.correo}</Text>
                      <Text style={styles.text}>Teléfono: {empleado.telefono}</Text>
                      <Text style={styles.text}>Rol: {empleado.rol}</Text>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.text}>
                No hay empleados asignados a etapas.
              </Text>
            )}
          </View>

          {/* Cambios de etapas */}
          <View>
            <Text style={styles.subtitle}>Cambios de Etapas</Text>
            {historial.etapasCambios && historial.etapasCambios.length > 0 ? (
              <View style={styles.tableContainer}>
                <View style={styles.table}>
                  {/* Encabezado */}
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>#</Text>
                    <Text style={styles.tableHeaderCell}>Etapa</Text>
                    <Text style={styles.tableHeaderCell}>Inicio</Text>
                    <Text style={styles.tableHeaderCell}>Fin</Text>
                  </View>
                  {/* Filas */}
                  {historial.etapasCambios
                    .filter((cambio) => cambio.fechaFin)
                    .map((cambio, index) => (
                      <View key={cambio.idEtapaCambio} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{cambio.nombreEtapa}</Text>
                        <Text style={styles.tableCell}>
                          {new Date(cambio.fechaInicio).toLocaleDateString("es-PE")}
                        </Text>
                        <Text style={styles.tableCell}>
                          {new Date(cambio.fechaFin!).toLocaleDateString("es-PE")}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            ) : (
              <Text style={styles.text}>
                No se registraron cambios en las etapas.
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
