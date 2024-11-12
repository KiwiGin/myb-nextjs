export interface Repuesto {
    idRepuesto?: number,
    nombre: string,
    precio: number,
    descripcion: string,
    link_img?: string
    imgBase64?: string
    stock_actual?: number,
    stock_solicitado?: number,
    cantidad?: number
}