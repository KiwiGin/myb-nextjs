export interface EspecificacionPrueba {
  idParametro: number;
  nombre: string;
  unidad: string;
  valorMaximo: number;
  valorMinimo: number;
}

export interface EspecificacionForm extends EspecificacionPrueba {
  resultado?: number | string;
  valorMaximo?: number;
  valorMinimo?: number;
}

export interface EspecificacionResultado extends EspecificacionForm {
  resultadoTecnico: number | string;
}
