export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 lg:flex-row justify-center p-6 bg-white shadow-lg rounded-lg">
        <a
          href="/registroCliente"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Cliente
        </a>
        <a
          href="/registroProyecto"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Proyecto
        </a>
        <a
          href="/registroPrueba"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Prueba
        </a>
        <a
          href="/registroRepuesto"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Repuesto
        </a>
        <a
          href="/proyectos"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Seguimiento de proyectos
        </a>
        <a
          href="/proyeccionRepuestos"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Proyección de repuestos
        </a>
        <a
          href="/visualizacionRepuestos"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Visualización de repuestos requeridos
        </a>
      </div>
    </div>
  );
}
