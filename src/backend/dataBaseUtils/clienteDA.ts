import {client} from '../clientConnection';
import { Cliente } from '@/models/cliente';

export async function obtenerClientes() {
  await client.connect();

  try {
    const res = await client.query('SELECT * FROM paObtenerClientes()');
    return res.rows;
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Error executing query', err);
    }
    throw err;
  } finally {
    await client.end();
  }
}

export async function insertarCliente(cliente: Cliente) {
  await client.connect();
  try {
    await client.query('CALL paInsertarCliente($1, $2, $3, $4, $5, $6, $7)', [cliente.nombre, cliente.ruc, cliente.direccion, cliente.telefono, cliente.correo, cliente.documentoDeIdentidad, cliente.tipoDeDocumento]);
    console.log('Cliente insertado exitosamente');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al insertar cliente:', err.stack);
    } else {
      console.error('Error al insertar cliente:', err);
    }
  } finally {
    await client.end();
  }
}