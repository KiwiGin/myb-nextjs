INSERT INTO etapa (nombre)
VALUES ('Asignando Repuestos'),
       ('Asignando Reparacion'),
       ('Reparando'),
       ('Control de Calidad'),
       ('Subiendo informe de Control de Calidad'),
       ('Asignando pintado y embalaje'),
       ('Pintando y embalando'),
       ('Subiendo informe de ventas'),
       ('Terminado');

INSERT INTO empleado (usuario, password, nombre, apellido, correo, telefono, direccion, tipo_documento,
                      documento_identidad, rol)
VALUES ('jdoe', 'password123', 'John', 'Doe', 'jdoe@example.com', '555-1234', 'Calle Falsa 123', 'DNI', '12345678A',
        'administrador'),
       ('msmith', 'password456', 'Mary', 'Smith', 'msmith@example.com', '555-5678', 'Avenida Siempre Viva 456', 'DNI',
        '87654321B', 'empleado'),
       ('pjones', 'password789', 'Peter', 'Jones', 'pjones@example.com', '555-9876', 'Calle de la Luna 789', 'DNI',
        '23456789C', 'empleado'),
       ('lmartin', 'password101', 'Laura', 'Martin', 'lmartin@example.com', '555-6543', 'Plaza Mayor 101', 'DNI',
        '34567890D', 'administrador'),
       ('cmiller', 'password112', 'Charles', 'Miller', 'cmiller@example.com', '555-3210', 'Avenida Libertad 202', 'DNI',
        '45678901E', 'empleado');

insert into parametro (id_parametro, id_tipo_prueba, unidades, nombre)
values (1, 1, '°C', 'Temperatura'),
       (2, 1, 'L/min', 'Caudal'),
       (9, 2, 'grados celsius', 'temperatura');

insert into tipo_prueba (id_tipo_prueba, nombre)
values (1, 'Prueba Hidraulica'),
       (2, 'Prueba de Presión');