export interface Parametro {
  idParametro?: number;
  nombre: string;
  unidades: string;
  idTipoPrueba?: number;
}

export interface ParametroForm extends Parametro {
  idParametro: number;
  valorMaximo?: number | string;
  valorMinimo?: number | string;
}