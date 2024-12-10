(F): FrontEnd
(B): BackEnd

# Principal

## /registroProyecto

- [X] (A)(F) Validar que no se pueda ingresar una fecha de inicio posterior a la fecha de fin
- [X] (F) FIX: Al deseleccionar y volver a seleccionar un repuesto este se agrega 2 veces

## /proyectos

- [ ] (B) Fetchear los proyectos del jefe o del supervisor según el rol (agregar pa)
	- [ ] (B) Optimizar el da para que use un solo pa (agregar pa)
- [X] (F) En la proyecto Card para mostrar las imagenes de los empleados
- [X] (F) En la proyecto Card para mostrar la etapa del proyecto
- [X] (F) Uniformizar los proyecto Card
- [X] (F) (Opcional) Agregar filtros para la lista de proyecto

## /seguimientoTareas (Reparando)

- [ ] (A)(F) Validar que los resultados del técnico estén dentro de los parámetros establecidos

## /proyectos/proyectoId/ (Generando informe de ventas)

- [ ] (F)(B) Fetchear y agregar la información de los cambios de etapa y los empleados que hubo en estas. (Agregar pa)

## /proyectos/proyectoId/ (Terminado)

- [ ] (F) Agregar el botón para generar el informe de control de calidad
- [ ] (F) Agregar el botón para generar el informe de ventas

## /proyectos/proyectoId/ (Ver Detalles)

- [ ] (F) (rol == jefe | supervisor) (etapa >= 5) Agregar el botón para generar el informe de control de calidad
- [ ] (F) (rol == jefe) (etapa >= 8) Agregar el botón para generar el informe de ventas

## /registroEmpleado

- [X] (A)(F)(B) Agregar subida de imagen del empleados. Guiarse de registro repuesto

## /registroCliente

- [ ] (F)(B) Uniformizar en la db para que siga la estructura de empleado

## /registroPrueba

- [ ] (F)(B) Agregar descripción de prueba

## /proyectos/proyectoId/ (AsignandoRepuestos)

- [X] (F) Ocultar boton "Pedir Respuestos" cuando estos estén disponibles

## /proyectos/proyectoId/ [AsignandoTécnicos] (Asignando Reparacion/Asignando pintado y embalaje)

- [X] (F) Mostrar las imagenes de los empleados

## /proyectos/proyectoId/ (Reparando)

- [X] (F) Mostrar un texto de "Reparando".

## /proyectos/proyectoId/ (Pintando y embalando)

- [X] (F) Mostrar un texto de "Pintando y embalando".

## General

- [ ] Agreglar el manejo de las fechas
- [ ] Add sesion handlers in Interfaces

---

# Secundarios

## /registroProyecto

- [X] (A)(F) (Opcional) Auto ajustar width de selectores (Cliente)
- [X] (F) (Opcional) Mostrar nombre completo de Supervisor
- [ ] (A)(F) (Opcional) Ocultar scrollbar en selección de repuestos
- [ ] (A)(F) (Opcional) Redirigir a home después de registrar el proyecto

## /registroRepuesto y /registroEmpleado

- [X] (A)(F) (Opcional) Mejorar la apariencia del botón para subir la imagen del repuesto

## /proyeccionRepuestos

- [ ] (F)(B) (Opcional) Mostrar 2 secciones: repuestos disponibles, repuestos requeridos (solo se puede pedir en esta última)
