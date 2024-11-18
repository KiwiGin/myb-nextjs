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
      stock_requerido: number
    }) => {
      return {
        idRepuesto: repuesto.id_repuesto,
        nombre: repuesto.nombre,
        precio: repuesto.precio,
        descripcion: repuesto.descripcion,
        linkImg: repuesto.link_img,
        stockActual: repuesto.stock_actual,
        stockRequerido: repuesto.stock_requerido
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
      [repuesto.nombre, repuesto.precio, repuesto.descripcion, repuesto.linkImg || null, repuesto.stockActual || 0]
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

//obtener respuestos requeridos
export async function obtenerRepuestosRequeridos() {
  try {
    const res = await pool.query('SELECT * FROM paObtenerRepuestosRequeridos()');
    // CAmbiar el nombre de las columnas para que coincidan con el modelo
    const repuestos: Repuesto[] = res.rows.map((repuesto: {
      id_repuesto: number,
      nombre: string,
      precio: number,
      descripcion: string,
      link_img: string,
      stock_disponible: number,
      stock_asignado: number,
      stock_requerido: number
    }) => {
      return {
        idRepuesto: repuesto.id_repuesto,
        nombre: repuesto.nombre,
        precio: repuesto.precio,
        descripcion: repuesto.descripcion,
        linkImg: repuesto.link_img,
        stockAsignado: repuesto.stock_asignado,
        stockDisponible: repuesto.stock_disponible,
        stockRequerido: repuesto.stock_requerido
      };
    });
    return repuestos;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener repuestos requeridos:', err.stack);
    } else {
      console.error('Error al obtener repuestos requeridos:', err);
    }
    throw err;
  }
}

