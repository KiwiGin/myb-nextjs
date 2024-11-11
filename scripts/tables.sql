-- table: cliente -> tabla de clientes
CREATE TABLE cliente
(
    id_cliente                     serial
        primary key,
    nombre                         varchar(255) not null,
    ruc                            varchar(20)  not null,
    direccion                      varchar(255),
    telefono                       varchar(20),
    correo                         varchar(255),
    documento_de_identidad         varchar(50),
    tipo_de_documento_de_identidad varchar(50)
);

-- table: repuesto -> tabla de repuestos
CREATE TABLE repuesto (
    id_repuesto SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    link_img VARCHAR(255),
    stock_actual INT DEFAULT 0,
    stock_solicitado INT DEFAULT 0
);

-- table: tipo_prueba -> tabla de tipos de pruebas
CREATE TABLE tipo_prueba (
    id_tipo_prueba SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- table: parametro -> tabla de parametros
CREATE TABLE parametro (
    id_parametro SERIAL,
    id_tipo_prueba INT,
    unidades VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_parametro, id_tipo_prueba),
    FOREIGN KEY (id_tipo_prueba) REFERENCES tipo_prueba(id_tipo_prueba) ON DELETE CASCADE
);

-- table: prueba -> tabla de pruebas
CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    tipo_documento VARCHAR(20),
    documento_identidad VARCHAR(50) UNIQUE,
    rol VARCHAR(50) NOT NULL
);

-- table: etapa -> tabla de etapas
CREATE TABLE etapa (
    id_etapa SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE costos (
    id_costo SERIAL PRIMARY KEY,
    costo_mano_obra DECIMAL(10, 2) NOT NULL,
    costo_repuestos DECIMAL(10, 2) NOT NULL,
    costo_total DECIMAL(10, 2) NOT NULL
);

CREATE TABLE proyecto (
    id_proyecto SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_supervisor INT NOT NULL,
    id_jefe INT NOT NULL,
    id_etapa_actual INT REFERENCES Etapa(id_etapa) ON DELETE SET NULL,
    id_costo INT REFERENCES Costos(id_costo) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fechaInicio DATE NOT NULL,
    fechaFin DATE,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE SET NULL,
    FOREIGN KEY (id_jefe) REFERENCES Empleado(id_empleado) ON DELETE SET NULL,
    FOREIGN KEY (id_supervisor) REFERENCES Empleado(id_empleado) ON DELETE SET NULL
);

CREATE TABLE proyecto_especificaciones_pruebas (
    id_proyecto INT,
    id_tipo_prueba INT,
    id_parametro INT,
    valor_maximo DECIMAL(10, 2),
    valor_minimo DECIMAL(10, 2),
    PRIMARY KEY (id_proyecto, id_tipo_prueba, id_parametro),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_prueba) REFERENCES tipo_prueba(id_tipo_prueba) ON DELETE CASCADE,
    FOREIGN KEY (id_parametro, id_tipo_prueba) REFERENCES parametro(id_parametro, id_tipo_prueba) ON DELETE CASCADE
);

CREATE TABLE proyecto_repuestos_cantidad (
    id_proyecto INT,
    id_repuesto INT,
    cantidad INT NOT NULL,
    PRIMARY KEY (id_proyecto, id_repuesto),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_repuesto) REFERENCES repuesto(id_repuesto) ON DELETE CASCADE
);

CREATE TABLE proyecto_etapa_empleado (
    id_proyecto INT,
    id_etapa INT,
    id_tecnico INT,
    PRIMARY KEY (id_proyecto, id_etapa, id_tecnico),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto),
    FOREIGN KEY (id_etapa) REFERENCES etapa(id_etapa),
    FOREIGN KEY (id_tecnico) REFERENCES empleado(id_empleado)
);

CREATE TABLE proyecto_etapas_cambio (
    id_proyecto INT,
    id_etapa INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    PRIMARY KEY (id_proyecto, id_etapa),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto),
    FOREIGN KEY (id_etapa) REFERENCES etapa(id_etapa)
);
