import { pool } from '../clientConnection';
import { Proyecto } from '@/models/proyecto';
import { Especificacion } from '@/models/especificacion';
import { Repuesto } from '@/models/repuesto';

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

//obtener proyectos por jefe [FALTA CORREGIR PA - NO DEVUELVE TODO EL PROYECTO]
export async function obtenerProyectosPorJefe(idJefe: number): Promise<Proyecto[]> {

  try {
    const res = await pool.query('SELECT * FROM paObtenerProyectosPorJefe($1)', [idJefe]);
    return res.rows;
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


//obtener proyectos en asignacion
export async function obtenerProyectosAsignacion(): Promise<Proyecto[]> {

  try {
    const res = await pool.query('SELECT * FROM paObtenerProyectosAsignacion()');

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
      ids_empleados: number[]
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
        idsEmpleados: proyecto.ids_empleados
      } as Proyecto;
    });

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

