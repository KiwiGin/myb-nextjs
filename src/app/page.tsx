export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 p-6 bg-white shadow-lg rounded-lg">
        <a href="/registroCliente" className="p-4 bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out">
          Registro de Cliente
        </a>
        <a href="/registroProyecto" className="p-4 bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out">
          Registro de Proyecto
        </a>
        <a href="/registroPrueba" className="p-4 bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out">
          Registro de Prueba
        </a>
        <a href="/registroRepuesto" className="p-4 bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out">
          Registro de Repuesto
        </a>
      </div>
    </div>
  );
}
