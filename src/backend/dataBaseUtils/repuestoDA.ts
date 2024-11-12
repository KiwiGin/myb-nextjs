import {pool} from '../clientConnection';
import { Repuesto } from '@/models/repuesto';

export async function obtenerRepuestos() {

  try {
    const res = await pool.query('SELECT * FROM paObtenerRepuestos()');
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

//insertar repuesto

export async function registrarRepuesto(repuesto: Repuesto) {
  try {
    await pool.query('CALL paRegistrarRepuesto($1, $2, $3)', [repuesto.nombre, repuesto.precio, repuesto.descripcion]);
    console.log('Repuesto insertado exitosamente');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al insertar repuesto:', err.stack);
    } else {
      console.error('Error al insertar repuesto:', err);
    }
    throw err;
  } 
}

//actualizar stock de un repuesto

export async function actualizarStockRepuesto(repuesto: Repuesto) {
  try {
    await pool.query('CALL paActualizarStockRepuesto($1, $2)', [repuesto.idRepuesto, repuesto.cantidad]);
    console.log('Repuesto actualizado exitosamente');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al actualizar repuesto:', err.stack);
    } else {
      console.error('Error al actualizar repuesto:', err);
    }
    throw err;
  } 
}

