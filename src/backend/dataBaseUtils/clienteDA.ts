import {pool} from '../clientConnection';
import { Cliente } from '@/models/cliente';

export async function obtenerClientes() {

  try {
    const res = await pool.query('SELECT * FROM paObtenerClientes()');
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

export async function insertarCliente(cliente: Cliente) {
  try {
    await pool.query('CALL paInsertarCliente($1, $2, $3, $4, $5, $6, $7)', [cliente.nombre, cliente.ruc, cliente.direccion, cliente.telefono, cliente.correo, cliente.documentoDeIdentidad, cliente.tipoDeDocumento]);
    console.log('Cliente insertado exitosamente');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al insertar cliente:', err.stack);
    } else {
      console.error('Error al insertar cliente:', err);
    }
  } 
}