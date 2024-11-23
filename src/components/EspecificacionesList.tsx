import { TipoPruebaEspecificacion } from "@/models/tipoprueba";
import React from "react";
import { PruebasTable } from "./PruebasTable";

interface EspecificacionesListProps<T extends TipoPruebaEspecificacion> {
  pruebas: T[];
  messageNothingAdded: string;
  className?: string;
  counterResult: (prueba_index: number, espec_index: number) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
  rol: "tecnico" | "supervisor";
}

export function EspecificacionesList<T extends TipoPruebaEspecificacion>({
  pruebas,
  messageNothingAdded,
  className,
  counterResult,
  error,
  rol,
}: EspecificacionesListProps<T>) {
  return (
    <PruebasTable<T>
      pruebas={pruebas}
      className={className}
      messageNothingAdded={messageNothingAdded}
      columnas={
        <>
          {rol === "supervisor" ? (
            <>
              <th scope="col" className="px-2 py-3">
                Supervisor
              </th>
              <th scope="col" className="px-2 py-3">
                Resultado Tecnico
              </th>
            </>
          ) : (
            <th scope="col" className="px-2 py-3">
              Resultado
            </th>
          )}
          <th scope="col" className="px-2 py-3">
            Valor Min.
          </th>
          <th scope="col" className="px-2 py-3">
            Valor Max.
          </th>
        </>
      }
      filas={(prueba_index, espec_index, espec) => (
        <>
          <td className="px-2 min-w-16 py-4">
            {counterResult(prueba_index, espec_index)}
          </td>
          {rol === "supervisor" && (
            <td className="px-2 py-4">{espec.resultadoTecnico}</td>
          )}
          <td className="px-2 py-4">{espec.valorMinimo}</td>
          <td className="px-2 py-4">{espec.valorMaximo}</td>
        </>
      )}
      error={error}
    />
  );
}
