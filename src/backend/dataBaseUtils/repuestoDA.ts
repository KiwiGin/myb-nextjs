import {client} from '../clientConnection';
import { Repuesto } from '@/models/repuesto';

export async function obtenerRepuestos() {
  await client.connect();

  try {
    const res = await client.query('SELECT * FROM paObtenerRepuestos()');
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