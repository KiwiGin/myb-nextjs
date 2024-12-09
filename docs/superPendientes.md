(F): FrontEnd
(B): BackEnd

# /registroProyecto

- [ ] (F) Validar que no se pueda ingresar una fecha de inicio posterior a la fecha de fin
- [ ] (F) (Opcional) Auto ajustar width de selectores (Cliente)
- [ ] (F) (Opcional) Mostrar nombre completo de Supervisor y Jefe
- [ ] (F) (Opcional) Ocultar scrollbar en selección de repuestos
- [ ] (F) FIX: Al deseleccionar y volver a seleccionar un repuesto este se agrega 2 veces 
- [ ] (F) (Opcional) Redirigir a home después de registrar el proyecto

# /proyectos

- [ ] (B) Fetchear los proyectos del jefe o del supervisor según el rol (agregar pa)
	- [ ] (B) Optimizar el da para que use un solo pa (agregar pa)
- [ ] (F) En la proyecto Card para mostrar las imagenes de los empleados 
	- [ ] (B) Ajustar el fetcheo de proyectos segun jefe id / supervisor id
- [ ] (F) En la proyecto Card para mostrar la etapa del proyecto
- [ ] (B)(F) Hacer funcionar el botón Ver Detalles de la proyecto Card por medio de un fetch
- [ ] (F) FIX: Al presionar el botón Ver Detalles de la proyecto Card se toma que se presionó la proyecto Card
- [ ] (F) Uniformizar los proyecto Card
- [ ] (F) Agregar una sección al final para los proyectos cerrados 
- [ ] (F) (Opcional) Agregar sorters y filtros para la lista de proyecto

# /proyectos/proyectoId/ (AsignandoRepuestos)

- [X] (F) Ocultar boton "Pedir Respuestos" cuando estos estén disponibles

# /proyectos/proyectoId/ [AsignandoTécnicos] (Asignando Reparacion/Asignando pintado y embalaje)

- [X] (F) Mostrar las imagenes de los empleados

# /proyectos/proyectoId/ (Reparando)

- [ ] (F)(B) Mostrar un texto de "Reparando", qué empleados están encargados y el botón de historial de resultados.

# /seguimientoTareas (Reparando)

- [ ] (F) Validar que los resultados del técnico estén dentro de los parámetros establecidos

# /proyectos/proyectoId/ (Pintando y embalando)

- [ ] (F)(B) Mostrar un texto de "Pintando y embalando" y que empleados están encargados.

# /proyectos/proyectoId/ (Generando informe de ventas)

- [ ] (F)(B) Fetchear y agregar la información de los cambios de etapa y los empleados que hubo en estas. (Agregar pa)

# /proyectos/proyectoId/ (Terminado)

- [ ] (F) Agregar el botón para generar el informe de control de calidad
- [ ] (F) Agregar el botón para generar el informe de ventas

# /proyectos/proyectoId/ (Ver Detalles)

- [ ] (F) (etapa >= 5) Agregar el botón para generar el informe de control de calidad
- [ ] (F) (etapa >= 8) Agregar el botón para generar el informe de ventas

# /registroEmpleado

- [ ] (F)(B) Agregar subida de imagen del empleados

# /registroCliente

- [ ] (F)(B) Uniformizar en la db para que siga la estructura de empleado

# /registroPrueba

- [ ] (F)(B) Agregar descripción de prueba

# /registroRepuesto

- [ ] (F) (Opcional) Mejorar la apariencia del botón para subir la imagen del repuesto

# /proyeccionRepuestos

- [ ] (F)(B) (Opcional) Mostrar 2 secciones: repuestos disponibles, repuestos requeridos (solo se puede pedir en esta última)

