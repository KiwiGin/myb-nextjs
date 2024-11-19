import { pool } from '../clientConnection';
import { Proyecto } from '@/models/proyecto';
import { Especificacion } from '@/models/especificacion';
import { Repuesto } from '@/models/repuesto';
import { Cliente } from '@/models/cliente';
import { Empleado } from '@/models/empleado';

export async function obtenerProyectos(): Promise<Proyecto[]> {

  try {
    const res = await pool.query('SELECT * FROM paObtenerProyectos()');

    const proyectos = res.rows.map((proyecto: {
      id_proyecto: number,
      id_cliente: number,
      id_supervisor: number,
      id_jefe: number,
      id_etapa_actual: number,
      costo_total: number,
      costo_mano_obra: number,
      costo_repuestos: number,
      titulo: string,
      descripcion: string,
      fecha_inicio: Date,
      fecha_fin: Date,
      info_parametros: {
        ids_parametro: number[],
        nombres: string[],
        unidades: string[],
        valores_maximo: number[],
        valores_minimo: number[]
      },
      info_repuestos: {
        ids_repuesto: number[],
        nombres: string[],
        descripciones: string[],
        precios: number[],
        links_img: string[],
        cantidades: number[]
      }
    }) => {
      return {
        idProyecto: proyecto.id_proyecto,
        idCliente: proyecto.id_cliente,
        idSupervisor: proyecto.id_supervisor,
        idJefe: proyecto.id_jefe,
        idEtapaActual: proyecto.id_etapa_actual,
        costoTotal: proyecto.costo_total,
        costoManoObra: proyecto.costo_mano_obra,
        costoRepuestos: proyecto.costo_repuestos,
        titulo: proyecto.titulo,
        descripcion: proyecto.descripcion,
        fechaInicio: proyecto.fecha_inicio,
        fechaFin: proyecto.fecha_fin,
        infoParametros: proyecto.info_parametros,
        infoRepuestos: proyecto.info_repuestos
      };
    });

    const especificaciones: Especificacion[] = [];
    const repuestos: Repuesto[] = [];
    proyectos.forEach(proyecto => {
      proyecto.infoParametros.ids_parametro.forEach((idParametro, index) => {
        especificaciones.push({
          idParametro: idParametro,
          nombre: proyecto.infoParametros.nombres[index],
          unidad: proyecto.infoParametros.unidades[index],
          valorMaximo: proyecto.infoParametros.valores_maximo[index],
          valorMinimo: proyecto.infoParametros.valores_minimo[index]
        });
      });
      proyecto.infoRepuestos.ids_repuesto.forEach((idRepuesto, index) => {
        repuestos.push({
          idRepuesto: idRepuesto,
          nombre: proyecto.infoRepuestos.nombres[index],
          descripcion: proyecto.infoRepuestos.descripciones[index],
          precio: proyecto.infoRepuestos.precios[index],
          linkImg: proyecto.infoRepuestos.links_img[index],
          cantidad: proyecto.infoRepuestos.cantidades[index]
        });
      });
    });

    return proyectos.map(proyecto => {
      return {
        idProyecto: proyecto.idProyecto,
        idCliente: proyecto.idCliente,
        idSupervisor: proyecto.idSupervisor,
        idJefe: proyecto.idJefe,
        idEtapaActual: proyecto.idEtapaActual,
        costoTotal: proyecto.costoTotal,
        costoManoObra: proyecto.costoManoObra,
        costoRepuestos: proyecto.costoRepuestos,
        titulo: proyecto.titulo,
        descripcion: proyecto.descripcion,
        fechaInicio: proyecto.fechaInicio,
        fechaFin: proyecto.fechaFin,
        especificaciones: especificaciones.filter(especificacion => proyecto.infoParametros.ids_parametro.includes(especificacion.idParametro)),
        repuestos: repuestos.filter(repuesto => repuesto.idRepuesto !== undefined && proyecto.infoRepuestos.ids_repuesto.includes(repuesto.idRepuesto))
      } as Proyecto;
    });
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  }
}

export async function insertarProyecto(proyecto: Proyecto) {
  try {
    // Iniciar la transacción
    await pool.query('BEGIN');

    // Llamar al procedimiento almacenado
    const query = `
            CALL paInsertarProyecto(
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )
        `;

    // Pasar los parámetros directamente, incluyendo los arreglos
    await pool.query(query, [
      proyecto.titulo,
      proyecto.descripcion,
      proyecto.fechaInicio,
      proyecto.fechaFin,
      proyecto.idCliente,
      proyecto.idSupervisor,
      proyecto.idJefe,
      proyecto.costoManoObra,
      proyecto.idRepuestos,           // Array of INT
      proyecto.cantidadesRepuestos,    // Array of INT
      proyecto.idParametros,           // Array of INT
      proyecto.valoresMaximos,         // Array of DECIMAL
      proyecto.valoresMinimos          // Array of DECIMAL
    ]);

    // Confirmar la transacción
    await pool.query('COMMIT');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al insertar cliente:', err.stack);
    } else {
      console.error('Error al insertar cliente:', err);
    }
    // Revertir en caso de error
    await pool.query('ROLLBACK');
  }
}

//obtener respuestos por proyecto
export async function obtenerRepuestosPorProyecto(idProyecto: number): Promise<Repuesto[]> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerRepuestosPorProyecto($1)', [idProyecto]);

    const repuestos: Repuesto[] = res.rows.map((repuesto: {
      id_repuesto: number,
      nombre: string,
      descripcion: string,
      precio: number,
      link_img: string,
      stock_disponible: number,
      stock_asignado: number,
      stock_requerido: number,
      cantidad: number
    }) => {
      return {
        idRepuesto: repuesto.id_repuesto,
        nombre: repuesto.nombre,
        descripcion: repuesto.descripcion,
        precio: repuesto.precio,
        linkImg: repuesto.link_img,
        stockDisponible: repuesto.stock_disponible,
        stockAsignado: repuesto.stock_asignado,
        stockRequerido: repuesto.stock_requerido,
        cantidad: repuesto.cantidad
      } as Repuesto;
    });

    return repuestos;
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  }
}

// Cambiar la etapa de un proyecto
export async function cambiarEtapaProyecto(idProyecto: number, idEtapa: number, fechaInicio: Date) {
  try {
    await pool.query('CALL paCambiarEtapaProyecto($1, $2, $3)', [idProyecto, idEtapa, fechaInicio]);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al cambiar etapa de proyecto:', err.stack);
    } else {
      console.error('Error al cambiar etapa de proyecto:', err);
    }
    throw err;
  }
}

export async function asignarRepuestosAProyecto(proyectoId: number) {
  try {
    await pool.query('CALL paAsignarRepuestosAProyecto($1)', [proyectoId]);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al asignar repuestos a proyecto:', err.stack);
    } else {
      console.error('Error al asignar repuestos a proyecto:', err);
    }
    throw err;
  }
}

export async function obtenerEmpleadosPorIds(idsEmpleados: number[]): Promise<Empleado[]> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerEmpleadosPorIds($1)', [idsEmpleados]);

    return res.rows.map((empleado: {
      id_empleado: number,
      usuario: string,
      password: string,
      nombre: string,
      apellido: string,
      correo: string,
      telefono: string,
      direccion: string,
      tipo_documento: string,
      documento_identidad: string,
      rol: string
    }) => {
      return {
        idEmpleado: empleado.id_empleado,
        usuario: empleado.usuario,
        password: empleado.password,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        correo: empleado.correo,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        tipoDocumento: empleado.tipo_documento,
        documentoIdentidad: empleado.documento_identidad,
        rol: empleado.rol
      } as Empleado;
    });
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  }
}

export async function obtenerClientesPorIds(idsClientes: number[]): Promise<Cliente[]> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerClientesPorIds($1)', [idsClientes]);

    return res.rows.map((cliente: {
      id_cliente: number,
      nombre: string,
      ruc: string,
      direccion: string,
      telefono: string,
      correo: string,
      documento_de_identidad: string,
      tipo_de_documento_de_identidad: string
    }) => {
      return {
        idCliente: cliente.id_cliente,
        nombre: cliente.nombre,
        ruc: cliente.ruc,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        correo: cliente.correo,
        documentoDeIdentidad: cliente.documento_de_identidad,
        tipoDeDocumento: cliente.tipo_de_documento_de_identidad
      } as Cliente;
    });
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  }
}

export async function obtenerEtapaPorId(idEtapa: number): Promise<string> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerEtapaPorId($1)', [idEtapa]);
    return res.rows[0].nombre;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener etapa por id:', err.stack);
    } else {
      console.error('Error al obtener etapa por id:', err);
    }
    throw err;
  }
}

export async function obtenerDatosProyectoPorId(idProyecto: number): Promise<Proyecto> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerDatosProyectoPorId($1)', [idProyecto]);

    const proyecto = res.rows[0];
    console.log(proyecto);

    const especificaciones: Especificacion[] = [];
    const repuestos: Repuesto[] = [];

    const parametrosString = proyecto.info_parametros;

    const parametros = parametrosString
      .slice(1, -1)
      .split('","')

      .map((param: string) =>
        param.replace(/[{}"]/g, "").split(",")
      );

    const idParametros = parametros[0].map(Number);
    const nombresParametros = parametros[1];
    const unidades = parametros[2];
    const valoresMaximos = parametros[3].map(Number);
    const valoresMinimos = parametros[4].map(Number);

    for (let i = 0; i < idParametros.length; i++) {
      especificaciones.push({
        idParametro: idParametros[i],
        nombre: nombresParametros[i],
        unidad: unidades[i],
        valorMaximo: valoresMaximos[i],
        valorMinimo: valoresMinimos[i],
      });
    }

    const res_1 = await pool.query('SELECT * FROM paObtenerRepuestosPorProyecto($1)', [idProyecto]);
    res_1.rows.forEach((repuesto: {
      id_repuesto: number,
      nombre: string,
      descripcion: string,
      precio: number,
      link_img: string,
      stock_disponible: number,
      stock_asignado: number,
      stock_requerido: number,
      cantidad: number
    }) => {
      repuestos.push({
        idRepuesto: repuesto.id_repuesto,
        nombre: repuesto.nombre,
        descripcion: repuesto.descripcion,
        precio: repuesto.precio,
        linkImg: repuesto.link_img,
        stockDisponible: repuesto.stock_disponible,
        stockAsignado: repuesto.stock_asignado,
        stockRequerido: repuesto.stock_requerido,
        cantidad: repuesto.cantidad
      });
    });

    const cliente = await obtenerClientesPorIds([proyecto.id_cliente]);
    const supervisor = await obtenerEmpleadosPorIds([proyecto.id_supervisor]);
    const jefe = await obtenerEmpleadosPorIds([proyecto.id_jefe]);
    const empleadosActuales = await obtenerEmpleadosPorIds(proyecto.ids_empleados_actuales);
    const etapaActual = await obtenerEtapaPorId(proyecto.id_etapa_actual);

    return {
      idProyecto: proyecto.id_proyecto,
      titulo: proyecto.titulo,
      descripcion: proyecto.descripcion,
      fechaInicio: proyecto.fecha_inicio,
      fechaFin: proyecto.fecha_fin,
      costoManoObra: proyecto.costo_mano_obra,
      costoRepuestos: proyecto.costo_repuestos,
      costoTotal: proyecto.costo_total,

      idCliente: proyecto.id_cliente,
      idSupervisor: proyecto.id_supervisor,
      idJefe: proyecto.id_jefe,
      idEtapaActual: proyecto.id_etapa_actual,

      cliente: cliente[0] as Cliente,
      supervisor: supervisor[0] as Empleado,
      jefe: jefe[0] as Empleado,
      etapaActual: etapaActual,

      repuestos: repuestos as Repuesto[],
      especificaciones: especificaciones as Especificacion[],

      empleadosActuales: empleadosActuales as Empleado[]
    } as Proyecto;
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  }
}

export async function obtenerProyectosPorJefe(idJefe: number): Promise<Proyecto[]> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerProyectoPorJefe($1)', [idJefe]);

    const proyectos = await Promise.all(res.rows.map(async (proyecto: {
      id_proyecto: number,
      titulo: string,
      descripcion: string,
      fecha_inicio: Date,
      fecha_fin: Date,
      id_cliente: number,
      id_supervisor: number,
      id_jefe: number,
      id_etapa_actual: number,
      ids_empleados_actuales: number[],
      info_parametros: string
    }) => {
      // Obtener cliente, supervisor, jefe, empleados actuales y etapa actual
      const [cliente, supervisor, jefe, empleadosActuales, etapaActual] = await Promise.all([
        obtenerClientesPorIds([proyecto.id_cliente]),
        obtenerEmpleadosPorIds([proyecto.id_supervisor]),
        obtenerEmpleadosPorIds([proyecto.id_jefe]),
        obtenerEmpleadosPorIds(proyecto.ids_empleados_actuales),
        obtenerEtapaPorId(proyecto.id_etapa_actual)
      ]);

      return {
        idProyecto: proyecto.id_proyecto,
        titulo: proyecto.titulo,
        descripcion: proyecto.descripcion,
        fechaInicio: proyecto.fecha_inicio,
        fechaFin: proyecto.fecha_fin,

        idCliente: proyecto.id_cliente,
        idSupervisor: proyecto.id_supervisor,
        idJefe: proyecto.id_jefe,
        idEtapaActual: proyecto.id_etapa_actual,

        cliente: cliente[0] as Cliente,
        supervisor: supervisor[0] as Empleado,
        jefe: jefe[0] as Empleado,
        etapaActual: etapaActual,

        idEmpleadosActuales: proyecto.ids_empleados_actuales,
        empleadosActuales: empleadosActuales as Empleado[]
      } as Proyecto;
    }));

    return proyectos;
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  }
}
