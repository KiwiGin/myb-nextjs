export interface Repuesto {
    idRepuesto?: number,
    nombre: string,
    precio: number,
    descripcion: string,
    link_img?: string | null,
    img_base64?: string
    stock_actual?: number,
    stock_solicitado?: number,
    cantidad?: number
}