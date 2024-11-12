import { pool } from '../clientConnection';
import { TipoPrueba } from '@/models/tipoprueba';
import { Parametro } from '@/models/parametro';

export async function registrarTipoPrueba(tipoPrueba: TipoPrueba) {
    try {
        await pool.query('CALL paCrearTipoPrueba($1)', [tipoPrueba.nombre]);
        console.log('Tipo de prueba insertado exitosamente');
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

