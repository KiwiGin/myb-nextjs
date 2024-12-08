export interface EspecificacionPrueba {
  idTipoPrueba: number;
  nombre: string;
  parametros: ParametroPrueba[];
}

export interface ParametroPrueba {
  idParametro: number;
  nombre: string;
  unidades: string;
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
