import { Client } from 'pg';
import { Cliente } from '@/models/types';

const connectionString = 'postgresql://jose_sernaque:k7axICU4LNHt0mpRbyrfHRRAADrUZLOb@dpg-csomughu0jms738mha50-a.virginia-postgres.render.com/myb_database';

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, 
  },
});

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