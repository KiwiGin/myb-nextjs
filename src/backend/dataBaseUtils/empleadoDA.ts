import {pool} from '../clientConnection';
import { Empleado } from '@/models/empleado';

export async function paObtenerEmpleadosPorRol(p_rol: string): Promise<Empleado[]> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerEmpleadosPorRol($1)', [p_rol]);

    const empleados = res.rows.map((empleado: {
      id_empleado: number,
      usuario: string,
      password: string,
      nombre: string,
      apellido: string,
      correo: string,
      telefono: string,
      direccion: string,
      tipo_documento: string,
      documento_identidad: string,
      rol: string
    }) => {
      return {
        idEmpleado: empleado.id_empleado,
        usuario: empleado.usuario,
        password: empleado.password,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        correo: empleado.correo,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        documentoIdentidad: empleado.documento_identidad,
        tipoDocumento: empleado.tipo_documento,
        rol: empleado.rol
      };
    });
    return empleados;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener empleados por rol:', err.stack);
    } else {
      console.error('Error al obtener empleados por rol:', err);
    }
    return [];
  }
}

export async function paObtenerEmpleados(): Promise<Empleado[]> {
  try {
    const res = await pool.query('SELECT * FROM empleado');
    console.log('Empleados:', res.rows);

    const empleados = res.rows.map((empleado: {
      id_empleado: number,
      usuario: string,
      password: string,
      nombre: string,
      apellido: string,
      correo: string,
      telefono: string,
      direccion: string,
      tipo_documento: string,
      documento_identidad: string,
      rol: string
    }) => {
      return {
        idEmpleado: empleado.id_empleado,
        usuario: empleado.usuario,
        password: empleado.password,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        correo: empleado.correo,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        documentoIdentidad: empleado.documento_identidad,
        tipoDocumento: empleado.tipo_documento,
        rol: empleado.rol
      };
    });
    return empleados;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener empleados:', err.stack);
    } else {
      console.error('Error al obtener empleados:', err);
    }
    return [];
  }
}

//obtener empleados por ids
export async function obtenerEmpleadosPorIds(ids: number[]): Promise<Empleado[]> {
  try {
    const res = await pool.query('SELECT * FROM paObtenerEmpleadosPorIds($1)', [ids]);

    const empleados = res.rows.map((empleado: {
      id_empleado: number,
      usuario: string,
      password: string,
      nombre: string,
      apellido: string,
      correo: string,
      telefono: string,
      direccion: string,
      tipo_documento: string,
      documento_identidad: string,
      rol: string
    }) => {
      return {
        idEmpleado: empleado.id_empleado,
        usuario: empleado.usuario,
        password: empleado.password,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        correo: empleado.correo,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        documentoIdentidad: empleado.documento_identidad,
        tipoDocumento: empleado.tipo_documento,
        rol: empleado.rol
      } as Empleado;
    });
    return empleados;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al obtener empleados por ids:', err.stack);
    } else {
      console.error('Error al obtener empleados por ids:', err);
    }
    return [];
  }
}