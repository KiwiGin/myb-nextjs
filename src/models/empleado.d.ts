export interface Empleado {
  idEmpleado?: number;
  password?: string;
  nombre: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  tipoDocumento?: string;
  documentoIdentidad?: string;
  rol?: string;
  imgBase64?: string;
  linkImg?: string;
}

export interface EmpleadoForm extends Omit<Empleado, "password"> {
  checked: boolean;
}
