export default function Home() {
  return (
    <div>
      <div className="flex justify-center space-x-4">
        <a href="/registroCliente" className="p-4 bg-gray-200 rounded-lg">
          Registro de Cliente
        </a>
        <a href="/registroProyecto" className="p-4 bg-gray-200 rounded-lg">
          Registro de Proyecto
        </a>
        <a href="/registroPrueba" className="p-4 bg-gray-200 rounded-lg">
          Registro de Prueba
        </a>
        <a href="/registroRepuesto" className="p-4 bg-gray-200 rounded-lg">
          Registro de Repuesto
        </a>
      </div>
    </div>
  );
}
