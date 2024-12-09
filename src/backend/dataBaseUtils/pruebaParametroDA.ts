import { pool } from '../clientConnection';
import { TipoPrueba } from '@/models/tipoprueba';
import { Parametro } from '@/models/parametro';

export async function registrarTipoPrueba(tipoPrueba: TipoPrueba): Promise<{ idTipoPrueba: number }> {
    try {
        // Llamar a la función y capturar el ID devuelto
        const result = await pool.query('SELECT paCrearTipoPrueba($1) AS idtipoprueba', [tipoPrueba.nombre]);
        return { idTipoPrueba: result.rows[0].idtipoprueba };
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
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error al insertar parametro:', err.stack);
        } else {
            console.error('Error al insertar parametro:', err);
        }
        throw err;
    }
}

export async function obtenerPruebaConParametros(): Promise<TipoPrueba[]> {
    const query = `
        SELECT id_tipo_prueba, nombre_prueba, id_parametro, nombre_parametro, unidades
        FROM paObtenerPruebaConParametros();
    `;
    
    try {
        const { rows } = await pool.query(query);
        
        // Transforming the data into the desired structure
        const pruebaMap: { [key: number]: TipoPrueba } = {};
        
        rows.forEach(row => {
            const { id_tipo_prueba, nombre_prueba, id_parametro, nombre_parametro, unidades } = row;

            if (!pruebaMap[id_tipo_prueba]) {
                pruebaMap[id_tipo_prueba] = {
                    idTipoPrueba: id_tipo_prueba,
                    nombre: nombre_prueba,
                    parametros: []
                };
            }

            pruebaMap[id_tipo_prueba].parametros!.push({
                idParametro: id_parametro,
                nombre: nombre_parametro,
                unidades: unidades
            });
        });

        // Convert the map to an array
        return Object.values(pruebaMap);

    } catch (error) {
        console.error("Error retrieving tests with parameters:", error);
        throw error;
    }
}