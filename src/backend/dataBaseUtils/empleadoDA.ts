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

// Cambio a JSON
export async function obtenerTecnicosDisponibles(): Promise<Empleado[]> {
  try {
      // Realiza la consulta a la base de datos
      const res = await pool.query('SELECT * FROM paObtenerTecnicosDisponibles()');

      // Asegúrate de que el resultado tiene datos
      if (!res || !res.rows || res.rows.length === 0) {
          console.warn('No se encontraron técnicos disponibles.');
          return [];
      }

      // La función almacenada devuelve un JSON con camelCase
      const empleados = res.rows[0].paobtenertecnicosdisponibles as Empleado[];
      return empleados || [];
  } catch (err) {
      if (err instanceof Error) {
          console.error('Error al obtener técnicos disponibles:', err.stack);
      } else {
          console.error('Error desconocido al obtener técnicos disponibles:', err);
      }
      return [];
  }
}

export async function registrarEmpleado(empleado: Empleado): Promise<number> {

  const jsonData = {
    usuario: empleado.usuario,
    password: empleado.password,
    nombre: empleado.nombre,
    apellido: empleado.apellido,
    correo: empleado.correo,
    telefono: empleado.telefono,
    direccion: empleado.direccion,
    tipo_documento: empleado.tipoDocumento,
    documento_identidad: empleado.documentoIdentidad,
    rol: empleado.rol
  }

  try {
    console.log("Registrando empleado en la base de datos:", JSON.stringify(jsonData));

    // Ejecutar el procedimiento almacenado con el JSON
    const res = await pool.query(
      `SELECT paxregistrarempleado($1::json) AS id_empleado`,
      [JSON.stringify(jsonData)]
    );

    // Devolver el ID del empleado creado
    return res.rows[0].id_empleado;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error al registrar empleado:", err.message);
      throw new Error(`Error al registrar empleado: ${err.message}`);
    } else {
      console.error("Error desconocido al registrar empleado:", err);
      throw new Error("Error desconocido al registrar empleado.");
    }
  }
}