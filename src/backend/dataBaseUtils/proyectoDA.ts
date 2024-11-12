import { pool } from '../clientConnection';
import { Proyecto } from '@/models/proyecto';

export async function obtenerProyectos() {

    try {
      const res = await pool.query('SELECT * FROM paObtenerProyectos()');
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

