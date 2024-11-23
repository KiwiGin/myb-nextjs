import { TipoPruebaEspecificacion } from "@/models/tipoprueba";
import React from "react";

interface EspecificacionesListProps<T extends TipoPruebaEspecificacion> {
  pruebas: T[];
  messageNothingAdded: string;
  className?: string;
  counterResult: (
    prueba_index: number,
    espec_index: number,
    item: T
  ) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function EspecificacionesList<T extends TipoPruebaEspecificacion>({
  pruebas,
  messageNothingAdded,
  className,
  counterResult,
  error,
}: EspecificacionesListProps<T>) {
  return (
    <div className="mx-3 overflow-y-auto" style={{ height: "40h" }}>
      {pruebas.length === 0 ? (
        <p className="w-full text-center">{messageNothingAdded}</p>
      ) : (
        <div className={`${className && className} mb-2`}>
          {pruebas.map((item, prueba_index) => (
            <div key={item.idTipoPrueba} className="relative">
              <div className="flex flex-row justify-between">
                <span
                  className={`text-2xl pb-6 text-left font-medium leading-none ${
                    error && error(prueba_index) && "text-red-500"
                  }`}
                >
                  {item.nombre}
                </span>
              </div>
              <div className="col-span-6 pt-2 flex">
                <div className="overflow-x-auto w-full">
                  <table className="w-full  text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-900">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Parametro
                        </th>
                        <th scope="col" className="px-2 py-3">
                          Resultado
                        </th>
                        <th scope="col" className="px-2 py-3">
                          Valor Min.
                        </th>
                        <th scope="col" className="px-2 py-3">
                          Valor Max.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.especificaciones?.map((espec, espec_index) => (
                        <tr
                          key={espec.idParametro}
                          className="bg-gray-100 text-black"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {`${espec.nombre}( ${espec.unidad} )`}
                          </th>
                          <td className="px-2 min-w-16 py-4">
                            {counterResult(prueba_index, espec_index, item)}
                          </td>
                          <td className="px-2 py-4">{espec.valorMinimo}</td>
                          <td className="px-2 py-4">{espec.valorMaximo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {error && error(prueba_index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
