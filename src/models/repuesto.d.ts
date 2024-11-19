export interface Repuesto {
  idRepuesto?: number;
  nombre: string;
  precio: number;
  descripcion: string;
  link_img?: string | null;
  img_base64?: string;
  stock_actual?: number;
  stock_solicitado?: number;
  cantidad?: number;
}

export interface RepuestoType {
  idRepuesto?: number;
  nombre: string;
  precio: number;
  descripcion: string;
  linkImg?: string | null;
  imgBase64?: string;
  stockActual?: number;
  stockSolicitado?: number;
  cantidad?: number;
}

//Control de inputs
export interface RepuestoForm extends RepuestoType {
  idRepuesto: number;
  checked: boolean;
  quantity?: number | string | undefined;
  stockActual: number;
  stockSolicitado?: number;
}
