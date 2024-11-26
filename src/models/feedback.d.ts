export interface Feedback {
  idFeedback: number;
  idResultadoPruebaTecnico: number;
  idResultadoPruebaSupervisor: number;
  aprobado: boolean;
  comentario: string;
}

export interface FeedbackResultados
  extends Pick<Feedback, "idFeedback" | "aprobado" | "comentario"> {
  resultados: {
    idParametro: number;
    resultadoTecnico: number;
    resultadoSupervisor: number;
  }[];
}
