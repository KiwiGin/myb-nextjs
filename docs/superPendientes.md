(F): FrontEnd
(B): BackEnd

# Principal

## /registroProyecto

- [X] (A)(F) Validar que no se pueda ingresar una fecha de inicio posterior a la fecha de fin
- [X] (A)(F) FIX: Al deseleccionar y volver a seleccionar un repuesto este se agrega 2 veces

## /proyectos

- [X] (B) Fetchear los proyectos del jefe o del supervisor según el rol (agregar pa)
	- [X] (B) Optimizar el da para que use un solo pa (agregar pa)
- [X] (F) En la proyecto Card para mostrar las imagenes de los empleados
- [X] (F) En la proyecto Card para mostrar la etapa del proyecto
- [X] (F) Uniformizar los proyecto Card
- [X] (F) (Opcional) Agregar filtros para la lista de proyecto

## /seguimientoTareas (Reparando)

- [X] (A)(F) Validar que los resultados del técnico estén dentro de los parámetros establecidos

## /proyectos/proyectoId/ (Generando informe de ventas)

- [X] (F)(B) Fetchear y agregar la información de los cambios de etapa y los empleados que hubo en estas. (Agregar pa)

## /proyectos/proyectoId/ (Terminado)

- [X] (F) Agregar el botón para generar el informe de control de calidad
- [X] (F) Agregar el botón para generar el informe de ventas

## /registroEmpleado

- [X] (A)(F)(B) Agregar subida de imagen del empleados. Guiarse de registro repuesto

## /registroCliente

- [X] (F)(B) Uniformizar en la db para que siga la estructura de empleado

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
- [X] Add sesion handlers in Interfaces

---

# Secundarios

## /registroProyecto

- [X] (A)(F) (Opcional) Auto ajustar width de selectores (Cliente)
- [X] (F) (Opcional) Mostrar nombre completo de Supervisor
- [X] (A)(F) (Opcional) Redirigir a home después de registrar el proyecto

## /registroRepuesto y /registroEmpleado

- [X] (A)(F) (Opcional) Mejorar la apariencia del botón para subir la imagen del repuesto
- [X] (A)(F) (Opcional) Mejorar la apariencia del botón para subir la imagen del repuesto