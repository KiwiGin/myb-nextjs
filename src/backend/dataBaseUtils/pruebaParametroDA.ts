import { pool } from '../clientConnection';
import { TipoPrueba } from '@/models/tipoprueba';
import { Parametro } from '@/models/parametro';

export async function registrarTipoPrueba(tipoPrueba: TipoPrueba): Promise<{ idTipoPrueba: number }> {
    try {
        // Llamar a la función y capturar el ID devuelto
        const result = await pool.query('SELECT paCrearTipoPrueba($1) AS idTipoPrueba', [tipoPrueba.nombre]);
        console.log('Tipo de prueba insertado exitosamente');
        return { idTipoPrueba: result.rows[0].idTipoPrueba };
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error al insertar tipo de prueba:', err.stack);
        } else {
            console.error('Error al insertar tipo de prueba:', err);
        }
        throw err;
    }
}


export async function registrarParametro(parametro: Parametro) {
    try {
        await pool.query('CALL paCrearParametro($1, $2, $3)', [parametro.nombre, parametro.unidades, parametro.idTipoPrueba]);
        console.log('Parametro insertado exitosamente');
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error al insertar parametro:', err.stack);
        } else {
            console.error('Error al insertar parametro:', err);
        }
        throw err;
    }
}

export async function obtenerPruebaConParametros() {
    try {
        const res = await pool.query('SELECT * FROM paObtenerPruebaConParametros()');
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

