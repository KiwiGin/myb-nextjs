-- tabla: cliente -> tabla de clientes
create table cliente
(
    id_cliente                     serial primary key,
    nombre                         varchar(255) not null,
    ruc                            varchar(20)  not null,
    direccion                      varchar(255),
    telefono                       varchar(20),
    correo                         varchar(255),
    documento_de_identidad         varchar(50),
    tipo_de_documento_de_identidad varchar(50)
);

-- tabla: repuesto -> tabla de repuestos
create table repuesto
(
    id_repuesto      serial primary key,
    nombre           varchar(255)   not null,
    descripcion      text,
    precio           decimal(10, 2) not null,
    link_img         varchar(255),
    stock_disponible int default 0,
    stock_asignado   int default 0,
    stock_requerido  int default 0
);

-- tabla: tipo_prueba -> tabla de tipos de pruebas
create table tipo_prueba
(
    id_tipo_prueba serial primary key,
    nombre         varchar(255) not null
);

-- tabla: parametro -> tabla de parametros
create table parametro
(
    id_parametro   serial,
    id_tipo_prueba int,
    unidades       varchar(50),
    nombre         varchar(255) not null,
    primary key (id_parametro, id_tipo_prueba),
    foreign key (id_tipo_prueba) references tipo_prueba (id_tipo_prueba) on delete cascade
);

-- tabla: empleado -> tabla de empleados
create table empleado
(
    id_empleado         serial primary key,
    usuario             varchar(50) unique  not null,
    password            varchar(255)        not null,
    nombre              varchar(255)        not null,
    apellido            varchar(255)        not null,
    correo              varchar(255) unique not null,
    telefono            varchar(20),
    direccion           varchar(255),
    tipo_documento      varchar(20),
    documento_identidad varchar(50) unique,
    rol                 varchar(50)         not null
);

-- tabla: etapa -> tabla de etapas
create table etapa
(
    id_etapa serial primary key,
    nombre   varchar(255) not null
);

-- tabla: costos -> tabla de costos
create table costos
(
    id_costo        serial primary key,
    costo_mano_obra decimal(10, 2) not null,
    costo_repuestos decimal(10, 2) not null,
    costo_total     decimal(10, 2) not null
);

-- tabla: proyecto -> tabla de proyectos
create table proyecto
(
    id_proyecto     serial primary key,
    id_cliente      int          not null,
    id_supervisor   int          not null,
    id_jefe         int          not null,
    id_etapa_actual int          references etapa (id_etapa) on delete set null,
    id_costo        int          references costos (id_costo) on delete set null,
    titulo          varchar(255) not null,
    descripcion     text,
    fechainicio     date         not null,
    fechafin        date,
    foreign key (id_cliente) references cliente (id_cliente) on delete set null,
    foreign key (id_jefe) references empleado (id_empleado) on delete set null,
    foreign key (id_supervisor) references empleado (id_empleado) on delete set null
);

-- tabla: proyecto_especificaciones_pruebas
create table proyecto_especificaciones_pruebas
(
    id_proyecto    int,
    id_tipo_prueba int,
    id_parametro   int,
    valor_maximo   decimal(10, 2),
    valor_minimo   decimal(10, 2),
    primary key (id_proyecto, id_tipo_prueba, id_parametro),
    foreign key (id_proyecto) references proyecto (id_proyecto) on delete cascade,
    foreign key (id_tipo_prueba) references tipo_prueba (id_tipo_prueba) on delete cascade,
    foreign key (id_parametro, id_tipo_prueba) references parametro (id_parametro, id_tipo_prueba) on delete cascade
);

-- tabla: proyecto_repuestos_cantidad
create table proyecto_repuestos_cantidad
(
    id_proyecto int,
    id_repuesto int,
    cantidad    int not null,
    primary key (id_proyecto, id_repuesto),
    foreign key (id_proyecto) references proyecto (id_proyecto) on delete cascade,
    foreign key (id_repuesto) references repuesto (id_repuesto) on delete cascade
);

-- tabla: proyecto_etapa_empleado
create table proyecto_etapa_empleado
(
    id_proyecto int,
    id_etapa    int,
    id_tecnico  int,
    primary key (id_proyecto, id_etapa, id_tecnico),
    foreign key (id_proyecto) references proyecto (id_proyecto),
    foreign key (id_etapa) references etapa (id_etapa),
    foreign key (id_tecnico) references empleado (id_empleado)
);

-- tabla: proyecto_etapas_cambio
create table proyecto_etapas_cambio
(
    id_proyecto  int,
    id_etapa     int,
    fecha_inicio date,
    fecha_fin    date,
    primary key (id_proyecto, id_etapa),
    foreign key (id_proyecto) references proyecto (id_proyecto),
    foreign key (id_etapa) references etapa (id_etapa)
);

-- tabla: resultado_prueba
create table resultado_prueba
(
    id_resultado_prueba serial primary key,
    id_proyecto         int  not null,
    id_empleado         int  not null,
    fecha               date not null
);

create table prueba_parametro_resultado
(
    id_resultado_prueba int            not null,
    id_tipo_prueba      int            not null, 
    id_parametro        int            not null,
    valor               decimal(10, 2) not null,
    primary key (id_resultado_prueba, id_tipo_prueba, id_parametro),
    foreign key (id_resultado_prueba) references resultado_prueba (id_resultado_prueba) on delete cascade,
    foreign key (id_tipo_prueba) references tipo_prueba (id_tipo_prueba) on delete cascade,
    foreign key (id_parametro, id_tipo_prueba) references parametro (id_parametro, id_tipo_prueba) on delete cascade
);

create table feedback
(
    id_feedback                    serial primary key,
    id_resultado_prueba_tecnico    int     not null,
    id_resultado_prueba_supervisor int     not null,
    aprobado                       boolean not null,
    comentario                     text,
    foreign key (id_resultado_prueba_tecnico) references resultado_prueba (id_resultado_prueba) on delete cascade,
    foreign key (id_resultado_prueba_supervisor) references resultado_prueba (id_resultado_prueba) on delete cascade
);

-- tipo compuesto: info_parametro_proyecto
create type info_parametro_proyecto as
(
    ids_parametro  int[],
    nombres        varchar(255)[],
    unidades       varchar(50)[],
    valores_maximo decimal(10, 2)[],
    valores_minimo decimal(10, 2)[]
);

-- tipo compuesto: info_repuesto_proyecto
create type info_repuesto_proyecto as
(
    ids_repuesto  int[],
    nombres       varchar(255)[],
    descripciones text[],
    precios       decimal(10, 2)[],
    links_img     varchar(255)[],
    cantidades    int[]
);
