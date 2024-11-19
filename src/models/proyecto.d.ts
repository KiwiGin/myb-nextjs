import { Cliente } from "./cliente";
import { Especificacion } from "./especificacion";
import { Repuesto } from "./repuesto";

export interface Proyecto {
    idProyecto?: number,
    titulo: string,
    descripcion: string,
    fechaInicio: Date,
    fechaFin: Date,
    costoManoObra?: number,
    costoRepuestos?: number,
    costoTotal?: number,

    idCliente: number,
    idSupervisor: number,
    idJefe: number,
    idEtapaActual: number,

    cliente?: Cliente,
    supervisor?: Empleado,
    jefe?: Empleado,
    etapaActual?: string,

    idRepuestos?: number[],
    cantidadesRepuestos?: number[],

    repuestos?: Repuesto[],

    idParametros?: number[],
    valoresMaximos?: number[],
    valoresMinimos?: number[],

    especificaciones?: Especificacion[],

    idEmpleados?: number[],
    empleados?: Empleado[],
}