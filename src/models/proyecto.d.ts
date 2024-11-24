import { Cliente } from "./cliente";
import { Especificacion } from "./especificacion";
import { FeedbackResultados } from "./feedback";
import { Repuesto } from "./repuesto";
import {
  TipoPruebaEspecificacion,
  TipoPruebaEspecificacionResultado,
} from "./tipoprueba";

export interface Proyecto {
  idProyecto?: number;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  costoManoObra?: number;
  costoRepuestos?: number;
  costoTotal?: number;

  idCliente: number;
  idSupervisor: number;
  idJefe: number;
  idEtapaActual: number;

  cliente?: Cliente;
  supervisor?: Empleado;
  jefe?: Empleado;
  etapaActual?: string;

  idRepuestos?: number[];
  cantidadesRepuestos?: number[];

  repuestos?: Repuesto[];

  idParametros?: number[];
  valoresMaximos?: number[];
  valoresMinimos?: number[];

  especificaciones?: Especificacion[];

  idEmpleados?: number[];
  empleados?: Empleado[];
}

export interface ProyectoTecnico
  extends Pick<
    Proyecto,
    | "idProyecto"
    | "titulo"
    | "descripcion"
    | "idEtapaActual"
    | "etapaActual"
    | "cliente"
  > {
  pruebas?: TipoPruebaEspecificacion[];
  cliente: Pick<Cliente, "idCliente" | "nombre">;
  feedback?: FeedbackResultados;
}

export interface ProyectoSupervisor extends Pick<Proyecto, "idProyecto"> {
  pruebas: TipoPruebaEspecificacionResultado[];
  feedback?: FeedbackResultados;
}
