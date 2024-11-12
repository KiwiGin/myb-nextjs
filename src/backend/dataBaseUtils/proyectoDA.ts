import { client } from '../clientConnection';
import { Proyecto } from '@/models/proyecto';

export async function insertarProyecto(proyecto: Proyecto) {
    await client.connect();
    try {
        // Iniciar la transacción
        await client.query('BEGIN');

        // Llamar al procedimiento almacenado
        const query = `
            CALL paInsertarProyecto(
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )
        `;

        // Pasar los parámetros directamente, incluyendo los arreglos
        await client.query(query, [
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
        await client.query('COMMIT');
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error al insertar cliente:', err.stack);
        } else {
            console.error('Error al insertar cliente:', err);
        }
        // Revertir en caso de error
        await client.query('ROLLBACK');
    } finally {
        await client.end();
    }
}
