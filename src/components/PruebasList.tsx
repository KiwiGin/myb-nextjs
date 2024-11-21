import { TipoPruebaForms } from "@/models/tipoprueba";
import React from "react";

interface PruebasListProps<T extends TipoPruebaForms> {
  pruebas: T[];
  messageNothingAdded: string;
  className?: string;
  counterMin?: (
    prueba_index: number,
    param_index: number,
    item: T
  ) => React.ReactNode;
  counterMax?: (index: number, param_index: number, item: T) => React.ReactNode;
  remover?: (index: number, item: T) => React.ReactNode;
  selector?: (index: number, item: T) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function PruebasList<T extends TipoPruebaForms>({
  pruebas,
  messageNothingAdded,
  className,
  counterMin,
  counterMax,
  remover,
  selector,
  error,
}: PruebasListProps<T>) {
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
                {selector && selector(prueba_index, item)}
              </div>
              <div className="col-span-6 pt-2 flex">
                <div className="overflow-x-auto w-full">
                  <table className="w-full  text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-900">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Parametro
                        </th>
                        {counterMin && counterMax ? (
                          <>
                            <th scope="col" className="px-2 py-3">
                              Valor Min.
                            </th>
                            <th scope="col" className="px-2 py-3">
                              Valor Max.
                            </th>
                          </>
                        ) : (
                          <th scope="col" className="px-6 py-3">
                            Unidad
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {item.parametros.map((param, param_index) => (
                        <tr
                          key={param.idParametro}
                          className="bg-gray-100 text-black"
                        >
                          {counterMin && counterMax ? (
                            <>
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                              >
                                {`${param.nombre}( ${param.unidades} )`}
                              </th>
                              <td className="px-2 min-w-16 py-4">
                                {counterMin(prueba_index, param_index, item)}
                              </td>
                              <td className="px-2 py-4">
                                {counterMax(prueba_index, param_index, item)}
                              </td>
                            </>
                          ) : (
                            <>
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                              >
                                {param.nombre}
                              </th>
                              <td className="px-6 py-4">{param.unidades}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {remover && remover(prueba_index, item)}
              {error && error(prueba_index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
