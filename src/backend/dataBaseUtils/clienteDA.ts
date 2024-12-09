import {pool} from '../clientConnection';
import { Cliente } from '@/models/cliente';

export async function obtenerClientes(): Promise<Cliente[]> {
  try {
    const result = await pool.query('SELECT * FROM paObtenerClientes()');
    // Cambiar los nombres de las columnas a camelCase
    const clientes = result.rows.map((cliente: {
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
      };
    });
    return clientes;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener clientes:', err.stack);
    } else {
      console.error('Error al obtener clientes:', err);
    }
    return [];
  }
}

export async function insertarCliente(cliente: Cliente) {
  try {
    await pool.query('CALL paCrearCliente($1, $2, $3, $4, $5)', [cliente.nombre, cliente.ruc, cliente.direccion, cliente.telefono, cliente.correo]);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al insertar cliente:', err.stack);
    } else {
      console.error('Error al insertar cliente:', err);
    }
  } 
}

//obtener clientes por ids
export async function obtenerClientesPorIds(ids: number[]): Promise<Cliente[]> {
  try {
    const result = await pool.query('SELECT * FROM paObtenerClientesPorIds($1)', [ids]);
    // Cambiar los nombres de las columnas a camelCase
    const clientes = result.rows.map((cliente: {
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
    return clientes;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener clientes:', err.stack);
    } else {
      console.error('Error al obtener clientes:', err);
    }
    return [];
  }
}
