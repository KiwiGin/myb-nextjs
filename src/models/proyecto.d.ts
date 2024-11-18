import { Especificacion } from "./especificacion";
import { Repuesto } from "./repuesto";

export interface Proyecto {
    idProyecto?: number,
    titulo: string,
    descripcion: string,
    fechaInicio: Date,
    fechaFin: Date,
    idCliente: number,
    idSupervisor: number,
    idJefe: number,
    idEtapaActual: number,
    costoManoObra?: number,
    costoRepuestos?: number,
    costoTotal?: number,
    idRepuestos?: number[],
    cantidadesRepuestos?: number[],
    idParametros?: number[],
    valoresMaximos?: number[],
    valoresMinimos?: number[],
    especificaciones?: Especificacion[],
    repuestos?: Repuesto[],
    idEmpleados?: number[],
}