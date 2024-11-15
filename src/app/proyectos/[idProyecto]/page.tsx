import { InterfazFlujoProyecto } from "./InterfazFlujoProyecto";
export default function Page({ params }: { params: { idProyecto: string } }) {
  return <InterfazFlujoProyecto idProyecto={params.idProyecto} />;
}
