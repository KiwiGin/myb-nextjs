import { Arrow } from "../icons/Arrow";
import { FlowStage } from "@components/ProjectFlow/FlowStage";

export function ProjectFlow({ etapa = 0 }: { etapa?: number }) {
  const stageLabels = [
    "Asignando Repuestos",
    "Asignando Reparacion",
    "Reparando",
    "Control de Calidad",
    "Generando informe de Control de Calidad",
    "Asignando pintado y embalaje",
    "Pintando y embalando",
    "Generando informe de ventas",
    "Terminado",
  ];

  return (
    <div className="flex justify-evenly w-10/12 items-center">
      {stageLabels.map((label, index) => (
        <div key={label} className="flex">
          <FlowStage
            etapa={index < etapa ? 2 : index === etapa ? 1 : 0}
            label={label}
            labelPosition={index % 2 !== 0 ? "bottom" : "top"}
          />
          <>{index < stageLabels.length - 1 && <Arrow />}</>
        </div>
      ))}
    </div>
  );
}
