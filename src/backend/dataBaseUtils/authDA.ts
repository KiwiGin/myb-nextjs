import { pool } from '../clientConnection';
import { Empleado } from '@/models/empleado';

interface LoginResponse {
  response: 'success' | 'invalid_credentials' | 'db_error';
  empleado: Empleado | null;
}

export async function paValidarLogin(correo: string, password: string): Promise<LoginResponse> {
  try {
    const res = await pool.query('SELECT paValidarCorreo($1) AS empleado', [correo]);

    if (res.rows.length === 0 || !res.rows[0].empleado) {
      return { response: 'invalid_credentials', empleado: null };
    }

    const empleadoData = res.rows[0].empleado;

    return {
      response: 'success',
      empleado: {
        ...empleadoData,
        password: empleadoData.password,
      },
    };
  } catch (err) {
    console.error('Error al validar el login:', err);
    return { response: 'db_error', empleado: null };
  }
}
