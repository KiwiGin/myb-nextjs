import { pool } from '../clientConnection';
import { Proyecto, HistorialProyecto } from '@/models/proyecto';
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

    const repuestos: Repuesto[] = [];
    proyectos.forEach(proyecto => {
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
    await pool.query('SELECT paCambiarEtapaProyecto($1, $2, $3)', [idProyecto, idEtapa, fechaInicio]);
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
      password: string,
      nombre: string,
      apellido: string,
      correo: string,
      telefono: string,
      direccion: string,
      tipo_documento: string,
      documento_identidad: string,
      rol: string,
      link_img: string
    }) => {
      return {
        idEmpleado: empleado.id_empleado,
        password: empleado.password,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        correo: empleado.correo,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        tipoDocumento: empleado.tipo_documento,
        documentoIdentidad: empleado.documento_identidad,
        rol: empleado.rol,
        linkImg: empleado.link_img
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
    }) => {
      return {
        idCliente: cliente.id_cliente,
        nombre: cliente.nombre,
        ruc: cliente.ruc,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        correo: cliente.correo,
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
    return res.rows[0].nombre_etapa;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener etapa por id:', err.stack);
    } else {
      console.error('Error al obtener etapa por id:', err);
    }
    throw err;
  }
}

export async function obtenerProyectosPorJefe(idJefe: number): Promise<Proyecto[]> {
  try {
    const res = await pool.query('SELECT * FROM paxobtenerproyectoporjefe($1)', [idJefe]);

    if (!res || !res.rows || res.rows.length === 0) {
        throw new Error(`No se encontró un proyecto con el ID: ${idJefe}`);
    }

    return res.rows[0].paxobtenerproyectoporjefe as Proyecto[];
  } catch (error) {
      console.error('Error al obtener el proyecto por ID:', error);
      throw error;
  }
}

export async function obtenerProyectosPorSupervisor(idSupervisor: number): Promise<Proyecto[]> {
  try {
    const res = await pool.query('SELECT * FROM paxobtenerproyectoporsupervisor($1)', [idSupervisor]);

    if (!res || !res.rows || res.rows.length === 0) {
        throw new Error(`No se encontró un proyecto con el ID: ${idSupervisor}`);
    }

    return res.rows[0].paxobtenerproyectoporsupervisor as Proyecto[];
  } catch (error) {
      console.error('Error al obtener el proyecto por ID:', error);
      throw error;
  }
}

export async function obtenerProyectoPorTecnico(idTecnico: number): Promise<Proyecto> {
  try {
    const res = await pool.query('SELECT * FROM paobtenerproyectoportecnico($1)', [idTecnico]);

    if (!res || !res.rows || res.rows.length === 0) {
        throw new Error(`No se encontró un asignado al tecnico: ${idTecnico}`);
    }

    return res.rows[0].paobtenerproyectoportecnico as Proyecto;
  } catch (error) {
      console.error('Error al obtener un proyecto por tecnico:', error);
      throw error;
  }
}

export async function obtenerProyectoPorId(idProyecto: number): Promise<Proyecto> {
  try {
      const res = await pool.query('SELECT * FROM paObtenerProyectosPorId($1)', [idProyecto]);

      if (!res || !res.rows || res.rows.length === 0) {
          throw new Error(`No se encontró un proyecto con el ID: ${idProyecto}`);
      }

      return res.rows[0].paobtenerproyectosporid as Proyecto;
  } catch (error) {
      console.error('Error al obtener el proyecto por ID:', error);
      throw error;
  }
}
// Función para asignar empleados a un proyecto
export async function asignarEmpleadosAProyecto(data: {
  idProyecto: number;
  idEmpleados: number[];
  fechaAsignacion: Date;
}): Promise<void> {
  try {
      const { idProyecto, idEmpleados, fechaAsignacion } = data;

      // Verifica que el array de empleados no esté vacío
      if (!idEmpleados || idEmpleados.length === 0) {
          throw new Error('La lista de empleados no puede estar vacía.');
      }

      // Ejecuta la función almacenada usando SELECT
      await pool.query(
          'SELECT paAsignarEmpleadosAProyecto($1, $2, $3)',
          [idProyecto, idEmpleados, fechaAsignacion]
      );
  } catch (err) {
      if (err instanceof Error) {
          console.error('Error al asignar empleados al proyecto:', err.message);
          throw new Error(`Error al asignar empleados: ${err.message}`);
      } else {
          console.error('Error desconocido al asignar empleados:', err);
          throw new Error('Error desconocido al asignar empleados.');
      }
  }
}


export async function registrarResultados(jsonData : {
  idProyecto: number;
  idEmpleado: number;
  fecha: Date;
  resultados: {
    idTipoPrueba: number;
    especificaciones: {
      idParametro: number;
      resultado: number;
    }[];
  }[];
}) {
  try {

      // Ejecutar el procedimiento almacenado con el JSON
      const res = await pool.query(
          `SELECT paregistrarresultados($1::json) AS id_resultado_prueba`,
          [JSON.stringify(jsonData)]
      );

      // Devolver el ID del resultado de la prueba
      return res.rows[0].id_resultado_prueba;
  } catch (err) {
      if (err instanceof Error) {
          console.error('Error al registrar resultados:', err.message);
          throw new Error(`Error al registrar resultados: ${err.message}`);
      } else {
          console.error('Error desconocido al registrar resultados:', err);
          throw new Error('Error desconocido al registrar resultados.');
      }
  }
}

export async function registrarFeedback(jsonData: {
  idProyecto: number;
  idEmpleado: number;
  fecha: Date;
  idResultadoPruebaTecnico: number;
  aprobado: boolean;
  comentario: string;
  resultados: {
      idTipoPrueba: number,
      especificaciones: {
          idParametro: number,
          resultado: number,
        }[]
    }[]
}) {
  try {
      // Ejecutar el procedimiento almacenado con el JSON
      const res = await pool.query(
          `SELECT paregistrarfeedback($1::json) AS id_feedback`,
          [JSON.stringify(jsonData)]
      );

      // Devolver el ID del feedback
      return res.rows[0].id_feedback;
  } catch (err) {
      if (err instanceof Error) {
          console.error('Error al registrar feedback:', err.message);
          throw new Error(`Error al registrar feedback: ${err.message}`);
      } else {
          console.error('Error desconocido al registrar feedback:', err);
          throw new Error('Error desconocido al registrar feedback.');
      }
  }
}

export async function obtenerHistorialProyecto(idProyecto: number): Promise<HistorialProyecto> {
  try {
    // Llama al procedimiento almacenado con el ID del proyecto
    const res = await pool.query('SELECT paObtenerHistorialProyecto($1) AS historial', [idProyecto]);

    // El resultado estará en la primera fila, en la columna "historial"
    const historial: HistorialProyecto = res.rows[0].historial;

    return historial;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  }
}