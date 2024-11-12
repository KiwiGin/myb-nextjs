import {pool} from '../clientConnection';
import { Repuesto } from '@/models/repuesto';

export async function obtenerRepuestos() {

  try {
    const res = await pool.query('SELECT * FROM paObtenerRepuestos()');
    // CAmbiar el nombre de las columnas para que coincidan con el modelo
    const repuestos: Repuesto[] = res.rows.map((repuesto: {
      id_repuesto: number,
      nombre: string,
      precio: number,
      descripcion: string,
      link_img: string,
      stock_actual: number,
      stock_solicitado: number
    }) => {
      return {
        idRepuesto: repuesto.id_repuesto,
        nombre: repuesto.nombre,
        precio: repuesto.precio,
        descripcion: repuesto.descripcion,
        link_img: repuesto.link_img,
        stock_actual: repuesto.stock_actual,
        stock_solicitado: repuesto.stock_solicitado
      };
    });
    return repuestos;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener repuestos:', err.stack);
    } else {
      console.error('Error al obtener repuestos:', err);
    }
    throw err;
  }
}

//insertar repuesto
export async function registrarRepuesto(repuesto: Repuesto) {
  try {
    await pool.query(
      'CALL paRegistrarRepuesto($1, $2, $3, $4, $5)', 
      [repuesto.nombre, repuesto.precio, repuesto.descripcion, repuesto.link_img || null, repuesto.stock_actual || 0]
    );
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

