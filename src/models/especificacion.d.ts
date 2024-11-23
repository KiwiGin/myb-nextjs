export interface Especificacion {
  idParametro: number;
  nombre: string;
  unidad: string;
  valorMaximo: number;
  valorMinimo: number;
}

export interface EspecificacionForm extends Especificacion {
  resultado?: number | string;
  valorMaximo?: number;
  valorMinimo?: number;
}

export interface EspecificacionResultado extends EspecificacionForm {
  resultadoTecnico: number | string;
}
