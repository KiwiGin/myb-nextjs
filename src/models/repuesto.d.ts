export interface Repuesto {
    idRepuesto?: number,
    nombre: string,
    precio: number,
    descripcion: string,
    linkImg?: string | null,
    imgBase64?: string
    stockActual?: number,
    stockAsignado?: number,
    stockDisponible?: number,
    stockRequerido?: number,
    cantidad?: number
}