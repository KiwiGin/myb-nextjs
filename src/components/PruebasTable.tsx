interface EspecificacionTable {
  idParametro: number;
  nombre: string;
  unidad: string;
  resultado?: number | string;
  valorMaximo?: number;
  valorMinimo?: number;
  resultadoTecnico?: number | string;
}

interface TipoPruebaTable {
  idTipoPrueba: number;
  nombre: string;
  especificaciones?: EspecificacionTable[];
}

interface PruebasTableProps<T extends TipoPruebaTable> {
  pruebas: T[];
  className?: string;
  messageNothingAdded: string;
  columnas: React.ReactNode;
  filas: (
    prueba_index: number,
    espec_index: number,
    espec: EspecificacionTable
  ) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function PruebasTable<T extends TipoPruebaTable>({
  pruebas,
  columnas,
  filas,
  className,
  messageNothingAdded,
  error,
}: PruebasTableProps<T>) {
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
                        {columnas}
                      </tr>
                    </thead>
                    <tbody>
                      {item.especificaciones?.map((espec, index_espec) => (
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
                          {filas(prueba_index, index_espec, espec)}
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
