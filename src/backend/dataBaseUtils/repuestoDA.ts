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
      } as Repuesto;
    });
    return repuestos as Repuesto[];
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
export async function actualizarStockRepuesto(cantidadObtenida: number, idRepuesto: number) {
  try {
    await pool.query('CALL paActualizarStock($1, $2)', [idRepuesto, cantidadObtenida]);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al actualizar repuesto:', err.stack);
    } else {
      console.error('Error al actualizar repuesto:', err);
    }
    throw err;
  } 
}

//actualizar stock de respuestos
export async function actualizarStockRepuestos(repuestos: { idRepuesto: number, cantidadObtenida: number }[]) {
  try {
    //llama a paActualizarStock por cada repuesto
    for (const repuesto of repuestos) {
      await pool.query('CALL paActualizarStock($1, $2)', [repuesto.idRepuesto, repuesto.cantidadObtenida]);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al actualizar repuestos:', err.stack);
    } else {
      console.error('Error al actualizar repuestos:', err);
    }
    throw err;
  }
}

//obtener respuestos requeridos
export async function obtenerRepuestosRequeridos() {
  try {
    const res = await pool.query('SELECT * FROM paobtenerrepuestosrequeridos()');
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
      } as Repuesto;
    });
    return repuestos as Repuesto[];
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener repuestos requeridos:', err.stack);
    } else {
      console.error('Error al obtener repuestos requeridos:', err);
    }
    throw err;
  }
}

//agregar repuestos solicitados
export async function agregarRepuestosSolicitados(repuestos: { idRepuesto: number, cantidadSolicitada: number }[]) {
  try {
    const idsRepuestos = repuestos.map(repuesto => repuesto.idRepuesto);
    const cantidades = repuestos.map(repuesto => repuesto.cantidadSolicitada);
    await pool.query('CALL paAgregarRepuestosSolicitados($1, $2)', [idsRepuestos, cantidades]);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al agregar repuestos solicitados:', err.stack);
    } else {
      console.error('Error al agregar repuestos solicitados:', err);
    }
    throw err;
  }
}

export async function obtenerRepuestosPorIds(idsRepuestos: number[]) : Promise<Repuesto[]> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerRepuestosPorIds($1)', [idsRepuestos]);
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
        stockDisponible: repuesto.stock_disponible,
        stockAsignado: repuesto.stock_asignado,
        stockRequerido: repuesto.stock_requerido
      } as Repuesto;
    });
    return repuestos as Repuesto[];
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener repuestos por ids:', err.stack);
    } else {
      console.error('Error al obtener repuestos por ids:', err);
    }
    throw err;
  }
}

export async function obtenerRepuestosFaltantesPorJefe(jefeId: number) {
  try {
    const res = await pool.query('SELECT * FROM paObtenerRepuestosFaltantes($1)', [jefeId]);
    
    const repuestosFaltantes = res.rows.map((repuesto: {
      ids_repuestos: number[],
      cantidades: number[]
    }) => {
      return repuesto.ids_repuestos.map((idRepuesto, index) => {
        return {
          idRepuesto: idRepuesto,
          cantidad: repuesto.cantidades[index]
        };
      });
    })[0];
    
    const repuestos = await obtenerRepuestosPorIds(repuestosFaltantes.map(repuesto => repuesto.idRepuesto));

    return repuestos.map((repuesto, index) => {
      return {
        repuesto: repuesto,
        cantidadFaltante: repuestosFaltantes[index].cantidad
      };
    }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener repuestos faltantes por jefe:', err.stack);
    } else {
      console.error('Error al obtener repuestos faltantes por jefe:', err);
    }
    throw err;
  }
}