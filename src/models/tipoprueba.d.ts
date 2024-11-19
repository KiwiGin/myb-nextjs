import { Parametro, ParametroForm } from "./parametro";

export interface TipoPrueba {
  idTipoPrueba?: number;
  nombre: string;
  parametros?: Parametro[];
}

export interface TipoPruebaForms extends TipoPrueba {
  idTipoPrueba: number;
  checked: boolean;
  parametros: ParametroForm[];
}
