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

INSERT INTO cliente (nombre, ruc, direccion, telefono, correo, documento_de_identidad, tipo_de_documento_de_identidad)
VALUES
    ('TechCorp S.A.', '20567890123', 'Av. Principal 123, Lima', '987654321', 'contacto@techcorp.com', '12345678', 'DNI'),
    ('Innovatech S.R.L.', '20678901234', 'Calle Secundaria 456, Arequipa', '912345678', 'info@innovatech.com', '87654321', 'RUC'),
    ('Soluciones Empresariales SAC', '20789012345', 'Jr. Comercial 789, Cusco', '956789012', 'ventas@solucionesemp.com', '11223344', 'RUC'),
    ('Digital Experts Ltda.', '20890123456', 'Av. Tecnológica 321, Trujillo', '934567890', 'contacto@digitalexperts.com', '55667788', 'Pasaporte'),
    ('Grupo Empresarial Andino', '20901234567', 'Jr. Empresarial 987, Chiclayo', '921345678', 'grupoandino@gmail.com', '33445566', 'RUC'),
    ('Servicios Integrales SAC', '21012345678', 'Calle del Sol 159, Piura', '965432109', 'serviciosint@gmail.com', '44556677', 'DNI'),
    ('Comercializadora del Norte', '21123456789', 'Av. Norte 456, Iquitos', '987321654', 'comercialnorte@hotmail.com', '77889900', 'RUC'),
    ('Logística Global', '21234567890', 'Jr. Global 852, Puno', '900876543', 'logistica@globalmail.com', '99008877', 'RUC'),
    ('Transporte Seguro S.A.', '21345678901', 'Calle Transporte 741, Tacna', '988776655', 'info@transporteseguro.com', '22334455', 'Pasaporte'),
    ('Proyectos del Sur S.A.C.', '21456789012', 'Av. Sur 963, Huancayo', '977665544', 'contacto@proyectosdelsur.com', '55667788', 'DNI');


insert into parametro (id_parametro, id_tipo_prueba, unidades, nombre)
values (1, 1, '°C', 'Temperatura'),
       (2, 1, 'L/min', 'Caudal'),
       (9, 2, 'grados celsius', 'temperatura');

insert into tipo_prueba (id_tipo_prueba, nombre)
values (1, 'Prueba Hidraulica'),
       (2, 'Prueba de Presión');
