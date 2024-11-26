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

  costoManoObra?: number;
  costoRepuestos?: number;
  costoTotal?: number;

  idEtapaActual?: number;
  etapaActual?: string;

  cliente?: Cliente;
  supervisor?: Empleado;
  jefe?: Empleado;

  repuestos?: Repuesto[];
  especificaciones?: EspecificacionPrueba[];

  resultados?: ResultadoPrueba[];
  feedbacks?: Feedback[];
  empleadosActuales?: Empleado[];
  
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
