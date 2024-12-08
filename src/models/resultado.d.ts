export type ResultadoPrueba = {
  idResultadoPrueba: number;
  idProyecto: number;
  idEmpleado: number;
  fecha: Date | string;
  resultados: Resultado[];
}

export type Resultado = {
  idTipoPrueba: number;
  resultadosParametros: ResultadoParametro[];
}

export type ResultadoParametro = {
  idParametro: number;
  nombre: string;
  unidades: string;
  resultado: number;
}