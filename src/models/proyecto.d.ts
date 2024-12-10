import { Cliente } from "./cliente";
import { Empleado } from "./empleado";
import { EspecificacionPrueba } from "./especificacion";
import { ResultadoPrueba } from "./resultado";
import { Feedback, FeedbackResultados } from "./feedback";
import { Repuesto } from "./repuesto";
import {
  TipoPruebaEspecificacion,
  TipoPruebaEspecificacionResultado,
} from "./tipoprueba";

export interface Proyecto {
  idProyecto?: number;
  titulo: string;
  descripcion: string;

  fechaInicio?: Date;
  fechaFin?: Date;

  costoManoObra?: number;
  costoRepuestos?: number;
  costoTotal?: number;

  idEtapaActual?: number;
  etapaActual?: string;

  cliente?: Cliente;
  supervisor?: Empleado;
  jefe?: Empleado;

  repuestos?: Repuesto[] | null;
  especificaciones?: EspecificacionPrueba[] | null;

  resultados?: ResultadoPrueba[] | null;
  feedbacks?: Feedback[] | null;
  empleadosActuales?: Empleado[] | null;
  
  idCliente?: number;
  idSupervisor?: number;
  idJefe?: number;
  idEmpleadosActuales?: number[];
  idRepuestos?: number[];
  cantidadesRepuestos?: number[];

  idParametros?: number[];
  valoresMaximos?: number[];
  valoresMinimos?: number[];
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

export type HistorialProyecto = {
  idProyecto: number;
  etapasEmpleados: {
    idEtapa: number;
    nombreEtapa: string;
    empleados: Empleado[];
  }[];
  etapasCambios: {
    idEtapaCambio: number;
    idEtapa: number;
    nombreEtapa: string;
    fechaInicio: string;
    fechaFin: string | null;
  }[];
}