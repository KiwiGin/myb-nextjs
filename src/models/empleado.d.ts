export interface Empleado {
  idEmpleado: number;
  usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  documentoIdentidad: string;
  tipoDocumento: string;
  rol: string;
}

export interface EmpleadoForm extends Omit<Empleado, "password"> {
  checked: boolean;
}
