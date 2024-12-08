import { EspecificacionPrueba, ParametroPrueba } from "@/models/especificacion";

type EspecificacionTable = {
  idParametro: number;
  resultado: number;
};

interface TipoPruebaTable {
  idTipoPrueba: number;
  especificaciones?: EspecificacionTable[];
}

interface PruebasTableProps {
  pruebas: TipoPruebaTable[];
  pruebasOriginales: EspecificacionPrueba[];
  className?: string;
  messageNothingAdded: string;
  columnas: React.ReactNode;
  filas: (
    prueba_index: number,
    espec_index: number,
    parametro: ParametroPrueba
  ) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function PruebasTable({
  pruebas,
  pruebasOriginales,
  columnas,
  filas,
  className,
  messageNothingAdded,
  error,
}: PruebasTableProps) {
  return (
    <div className="mx-3 overflow-y-auto" style={{ height: "40h" }}>
      {pruebas.length === 0 ? (
        <p className="w-full text-center">{messageNothingAdded}</p>
      ) : (
        <div className={`${className && className} mb-2`}>
          {pruebas.map((prueba, prueba_index) => {
            const especificacionOriginal = pruebasOriginales.find(
              (spec) => spec.idTipoPrueba === prueba.idTipoPrueba
            );

            return (
              <div key={prueba.idTipoPrueba} className="relative">
                <div className="flex flex-row justify-between">
                  <span
                    className={`text-2xl pb-6 text-left font-medium leading-none ${
                      error && error(prueba_index) && "text-red-500"
                    }`}
                  >
                    {especificacionOriginal?.nombre}
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
                        {prueba.especificaciones?.map(
                          (especificacion, index_espec) => {
                            const parametroOriginal =
                              especificacionOriginal?.parametros.find(
                                (param) =>
                                  param.idParametro ===
                                  especificacion?.idParametro
                              );

                            return (
                              <tr
                                key={especificacion?.idParametro}
                                className="bg-gray-100 text-black"
                              >
                                <th
                                  scope="row"
                                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                >
                                  {`${parametroOriginal?.nombre}( ${parametroOriginal?.unidades} )`}
                                </th>
                                {filas(
                                  prueba_index,
                                  index_espec,
                                  parametroOriginal!
                                )}
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {error && error(prueba_index)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
