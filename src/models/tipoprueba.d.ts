import { EspecificacionForm, EspecificacionResultado } from "./especificacion";
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

export interface TipoPruebaEspecificacion
  extends Pick<TipoPruebaForms, "idTipoPrueba" | "nombre"> {
  especificaciones?: EspecificacionForm[];
}

export interface TipoPruebaEspecificacionResultado
  extends TipoPruebaEspecificacion {
  especificaciones: EspecificacionResultado[];
}
