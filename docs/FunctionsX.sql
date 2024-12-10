---------------------- DROPS ---------------------

drop function if exists paxRegistrarCliente(json);
drop function if exists paxRegistrarEmpleado(json);
drop function if exists paxObtenerClientes();
drop function if exists paxObtenerPruebasConParametros();
drop function if exists paxInsertarProyecto(json);
drop function if exists paxRegistrarRepuesto(json);
drop function if exists paxObtenerRepuestos();
drop function if exists paxObtenerProyectos();
drop function if exists paObtenerProyectosPorId(int);
drop function if exists paCrearTipoPrueba(varchar);
drop function if exists paxCrearParametro(json);
drop function if exists paxCrearPruebaParametros(json);
drop function if exists paxObtenerEmpleadosPorRol(varchar);
drop function if exists paxObtenerRepuestosRequeridos();
drop function if exists paxActualizarStock(json);
drop function if exists paxObtenerClientesPorIds(json);
drop function if exists paxObtenerEmpleadosPorIds(json);
drop function if exists paxObtenerRepuestosPorIds(json);
drop function if exists paxObtenerRepuestosPorProyecto(int);
drop function if exists paxAgregarRepuestosRequeridos(json);
drop function if exists paxAsignarRepuestosAProyecto(json);
drop function if exists paxObtenerProyectoPorJefe(int);
drop function if exists paxObtenerEtapaPorId(int);
drop function if exists paxObtenerRepuestosFaltantesPorJefe(int);
drop function if exists paObtenerTecnicosDisponibles();
drop function if exists paAsignarEmpleadosAProyecto(int, int[], date);
drop function if exists paCambiarEtapaProyecto(int, int, date);
drop function if exists paObtenerProyectosPorTecnico(int);
drop function if exists paRegistrarFeedback(json);

-------------------- FUNCTIONS -------------------

-- paxRegistrarCliente : Registra un cliente en la base de datos
create or replace function paxRegistrarCliente(
    cliente_json json
) returns int as
$$
declare
    nuevo_cliente_id int;
begin
    insert into cliente(nombre,
                        ruc,
                        direccion,
                        telefono,
                        correo,
                        documento_de_identidad,
                        tipo_de_documento_de_identidad)
    values ((cliente_json ->> 'nombre')::varchar,
            (cliente_json ->> 'ruc')::varchar,
            (cliente_json ->> 'direccion')::varchar,
            (cliente_json ->> 'telefono')::varchar,
            (cliente_json ->> 'correo')::varchar,
            (cliente_json ->> 'documento_de_identidad')::varchar,
            (cliente_json ->> 'tipo_de_documento_de_identidad')::varchar)
    returning id_cliente into nuevo_cliente_id;
    return nuevo_cliente_id;
end;
$$ language plpgsql;

-- paxRegistrarEmpleado : Registra un empleado en la base de datos
create or replace function paxRegistrarEmpleado(
    empleado_json json
) returns int as
$$
declare
    nuevo_empleado_id int;
begin
    insert into empleado(usuario,
                         password,
                         nombre,
                         apellido,
                         correo,
                         telefono,
                         direccion,
                         tipo_documento,
                         documento_identidad,
                         rol)
    values ((empleado_json ->> 'usuario')::varchar,
            (empleado_json ->> 'password')::varchar,
            (empleado_json ->> 'nombre')::varchar,
            (empleado_json ->> 'apellido')::varchar,
            (empleado_json ->> 'correo')::varchar,
            (empleado_json ->> 'telefono')::varchar,
            (empleado_json ->> 'direccion')::varchar,
            (empleado_json ->> 'tipo_documento')::varchar,
            (empleado_json ->> 'documento_identidad')::varchar,
            (empleado_json ->> 'rol')::varchar)
    returning id_empleado into nuevo_empleado_id;
    return nuevo_empleado_id;
end;
$$ language plpgsql;

-- paxObtenerClientes : Obtiene la lista de clientes
create or replace function paxObtenerClientes()
    returns json as
$$
declare
    clientes json;
begin
    select json_agg(json_build_object(
            'idCliente', c.id_cliente,
            'nombre', c.nombre,
            'ruc', c.ruc,
            'direccion', c.direccion,
            'telefono', c.telefono,
            'correo', c.correo,
            'documentoDeIdentidad', c.documento_de_identidad,
            'tipoDeDocumentoDeIdentidad', c.tipo_de_documento_de_identidad))
    into clientes
    from cliente c;
    return clientes;
end;
$$ language plpgsql;

-- paxObtenerPruebasConParametros: Obtiene la lista de pruebas con sus parámetros
create or replace function paxObtenerPruebasConParametros()
    returns json as
$$
declare
    pruebas json;
begin
    with parametros_por_prueba as (select tp.id_tipo_prueba,
                                          tp.nombre,
                                          coalesce(
                                                  json_agg(
                                                          json_build_object(
                                                                  'idParametro', p.id_parametro,
                                                                  'unidades', p.unidades,
                                                                  'nombre', p.nombre
                                                          )
                                                  ),
                                                  '[]'::json
                                          ) as parametro_info
                                   from tipo_prueba tp
                                            left join parametro p
                                                      on tp.id_tipo_prueba = p.id_tipo_prueba
                                   group by tp.id_tipo_prueba, tp.nombre)
    select json_agg(
                   json_build_object(
                           'idTipoPrueba', p.id_tipo_prueba,
                           'nombre', p.nombre,
                           'parametros', p.parametro_info
                   )
           )
    into pruebas
    from parametros_por_prueba p;

    return pruebas;
end;
$$ language plpgsql;

-- paxInsertarProyecto : Registra un proyecto en la base de datos
create or replace function paxInsertarProyecto(
    proyecto_json json
) returns int as
$$
declare
    repuestos_array         json[];
    costo_total_repuestos   decimal;
    costo_unitario_repuesto decimal;
    nuevo_costo_id          int;
    nuevo_proyecto_id       int;
    parametros_array        json[];
    tipo_prueba_id          int;
begin
    select array(
                   select json_array_elements(proyecto_json -> 'repuestos')
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            select (r.precio * (repuestos_array[i] ->> 'cantidad')::int)
            into costo_unitario_repuesto
            from repuesto r
            where r.id_repuesto = (repuestos_array[i] ->> 'idRepuesto')::int;
            costo_total_repuestos := costo_total_repuestos + costo_unitario_repuesto;
        end loop;

    insert into costos(costo_mano_obra, costo_repuestos, costo_total)
    values ((proyecto_json ->> 'costoManoDeObra')::decimal,
            costo_total_repuestos,
            (proyecto_json ->> 'costoManoDeObra')::decimal + costo_total_repuestos)
    returning id_costo into nuevo_costo_id;
    insert into proyecto(id_cliente,
                         id_supervisor,
                         id_jefe,
                         id_etapa_actual,
                         id_costo,
                         titulo,
                         descripcion,
                         fechainicio,
                         fechafin)
    values ((proyecto_json ->> 'idCliente')::int,
            (proyecto_json ->> 'idSupervisor')::int,
            (proyecto_json ->> 'idJefe')::int,
            1,
            nuevo_costo_id,
            (proyecto_json ->> 'titulo')::varchar,
            (proyecto_json ->> 'descripcion')::text,
            (proyecto_json ->> 'fechaInicio')::date,
            (proyecto_json ->> 'fechaFin')::date)
    returning id_proyecto into nuevo_proyecto_id;
    select array(
                   select json_array_elements(proyecto_json -> 'parametros')
           )
    into parametros_array;
    for i in 1..array_length(parametros_array, 1)
        loop
            select tp.id_tipo_prueba
            into tipo_prueba_id
            from parametro p
                     join tipo_prueba tp on p.id_tipo_prueba = tp.id_tipo_prueba
            where p.id_parametro = (parametros_array[i] ->> 'idParametro')::int;
            insert into proyecto_especificaciones_pruebas(id_proyecto,
                                                          id_tipo_prueba,
                                                          id_parametro,
                                                          valor_maximo,
                                                          valor_minimo)
            values (nuevo_proyecto_id, tipo_prueba_id,
                    (parametros_array[i] ->> 'idParametro')::int,
                    (parametros_array[i] ->> 'valorMaximo')::decimal,
                    (parametros_array[i] ->> 'valorMinimo')::decimal);
        end loop;
    for i in 1..array_length(repuestos_array, 1)
        loop
            insert into proyecto_repuestos_cantidad(id_proyecto,
                                                    id_repuesto,
                                                    cantidad)
            values (nuevo_proyecto_id,
                    (repuestos_array[i] ->> 'idRepuesto')::int,
                    (repuestos_array[i] ->> 'cantidad')::int);
        end loop;
    insert into proyecto_etapas_cambio(id_proyecto, id_etapa, fecha_inicio, fecha_fin)
    values (nuevo_proyecto_id, 1, (proyecto_json ->> 'fechaInicio')::date, null);
    return nuevo_proyecto_id;
end;
$$ language plpgsql;

-- paxRegistrarRepuesto : Registra un repuesto en la base de datos
create or replace function paxRegistrarRepuesto(
    repuesto_json json
) returns int as
$$
declare
    nuevo_repuesto_id int;
begin
    if (repuesto_json ->> 'stockActual')::int < 0 then
        raise exception 'El stock actual no puede ser negativo';
    end if;
    insert into repuesto(nombre, precio, stock_disponible, stock_requerido, stock_asignado)
    values ((repuesto_json ->> 'nombre')::varchar,
            (repuesto_json ->> 'precio')::decimal,
            (repuesto_json ->> 'stockActual')::int,
            0,
            0)
    returning id_repuesto into nuevo_repuesto_id;
    return nuevo_repuesto_id;
end;
$$ language plpgsql;

-- paxObtenerRepuestos : Obtiene la lista de repuestos
create or replace function paxObtenerRepuestos()
    returns json as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'precio', r.precio,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado,
            'stockActual', r.stock_disponible + r.stock_asignado,
            'linkImg', r.link_img))
    into repuestos
    from repuesto r;
    return repuestos;
end;
$$ language plpgsql;

-- paxObtenerProyectos : Obtiene la lista de proyectos
create or replace function paxObtenerProyectos()
    returns json as
$$
declare
    proyectos json;
begin
    select json_agg(paobtenerproyectosporid(p.id_proyecto))
    into proyectos
    from proyecto p;
    return proyectos;
end;
$$ language plpgsql;

-- paObtenerProyectosPorId : Obtiene los proyectos por id
create or replace function paObtenerProyectosPorId(p_id_proyecto int)
    returns json as
$$
declare
    v_cliente_json            json;
    v_supervisor_json         json;
    v_jefe_json               json;
    v_repuestos_json          json;
    v_especificaciones_json   json;
    v_resultados_prueba_json  json;
    v_feedback_json           json;
    v_empleados_actuales_ids  int[];
    v_empleados_actuales_json json;
    v_proyecto_json           json;
begin
    select json_build_object(
                   'idCliente', c.id_cliente,
                   'nombre', c.nombre,
                   'ruc', c.ruc,
                   'direccion', c.direccion,
                   'telefono', c.telefono,
                   'correo', c.correo,
                   'documentoIdentidad', c.documento_de_identidad,
                   'tipoDocumento', c.tipo_de_documento_de_identidad
           )
    into v_cliente_json
    from cliente c
             join proyecto p on c.id_cliente = p.id_cliente
    where p.id_proyecto = p_id_proyecto;

    select json_build_object(
                   'idEmpleado', e.id_empleado,
                   'usuario', e.usuario,
                   'nombre', e.nombre,
                   'apellido', e.apellido,
                   'correo', e.correo,
                   'telefono', e.telefono,
                   'direccion', e.direccion,
                   'documentoIdentidad', e.documento_identidad,
                   'tipoDocumento', e.tipo_documento,
                   'rol', e.rol
           )
    into v_supervisor_json
    from empleado e
    where e.id_empleado = (select p.id_supervisor from proyecto p where p.id_proyecto = p_id_proyecto);

    select json_build_object(
                   'idEmpleado', e.id_empleado,
                   'usuario', e.usuario,
                   'nombre', e.nombre,
                   'apellido', e.apellido,
                   'correo', e.correo,
                   'telefono', e.telefono,
                   'direccion', e.direccion,
                   'documentoIdentidad', e.documento_identidad,
                   'tipoDocumento', e.tipo_documento,
                   'rol', e.rol
           )
    into v_jefe_json
    from empleado e
    where e.id_empleado = (select p.id_jefe from proyecto p where p.id_proyecto = p_id_proyecto);

    select json_agg(
                   json_build_object(
                           'idRepuesto', r.id_repuesto,
                           'nombre', r.nombre,
                           'descripcion', r.descripcion,
                           'precio', r.precio,
                           'linkImg', r.link_img,
                           'stockDisponible', r.stock_disponible,
                           'stockAsignado', r.stock_asignado,
                           'stockRequerido', r.stock_requerido,
                           'cantidad', prc.cantidad
                   )
           )
    into v_repuestos_json
    from repuesto r
             join proyecto_repuestos_cantidad prc on r.id_repuesto = prc.id_repuesto
    where prc.id_proyecto = p_id_proyecto;

    select json_agg(
                   json_build_object(
                           'idTipoPrueba', sq.id_tipo_prueba,
                           'nombre', (select tp.nombre from tipo_prueba tp where tp.id_tipo_prueba = sq.id_tipo_prueba),
                           'parametros', parametro_prueba
                   )
           )
    into v_especificaciones_json
    from (select pep.id_tipo_prueba,
                 json_agg(
                         json_build_object(
                                 'idParametro', p.id_parametro,
                                 'nombre', p.nombre,
                                 'unidades', p.unidades,
                                 'valorMaximo', pep.valor_maximo,
                                 'valorMinimo', pep.valor_minimo
                         )
                 ) as parametro_prueba
          from proyecto_especificaciones_pruebas pep
                   join parametro p on pep.id_parametro = p.id_parametro
          where pep.id_proyecto = p_id_proyecto
          group by pep.id_tipo_prueba) as sq;


    select json_agg(
                   json_build_object(
                           'idResultadoPrueba', sq2.id_resultado_prueba,
                           'idProyecto', sq2.id_proyecto,
                           'idEmpleado', sq2.id_empleado,
                           'idTipoPrueba', sq2.id_tipo_prueba,
                           'fecha', sq2.fecha,
                           'resultados', resultados
                   )
           )
    into v_resultados_prueba_json
    from (select sq.id_tipo_prueba,
                 sq.id_resultado_prueba,
                 sq.id_proyecto,
                 sq.id_empleado,
                 sq.fecha,
                 json_agg(
                         json_build_object(
                                 'idTipoPrueba', sq.id_tipo_prueba,
                                 'resultadosParametros', resultados_parametros
                         )
                 ) as resultados
          from (select prp.id_tipo_prueba,
                       prp.id_resultado_prueba,
                       rp.id_proyecto,
                       rp.fecha,
                       rp.id_empleado,
                       json_agg(
                               json_build_object(
                                       'idParametro', p.id_parametro,
                                       'nombre', p.nombre,
                                       'unidades', p.unidades,
                                       'resultado', prp.valor
                               )
                       ) as resultados_parametros
                from parametro p
                         join prueba_parametro_resultado prp on p.id_parametro = prp.id_parametro
                         join resultado_prueba rp on prp.id_resultado_prueba = rp.id_resultado_prueba
                where rp.id_proyecto = p_id_proyecto
                group by prp.id_tipo_prueba, prp.id_resultado_prueba, rp.id_proyecto, rp.fecha, rp.id_empleado) as sq
          group by sq.id_tipo_prueba, sq.id_resultado_prueba, sq.id_proyecto, sq.id_empleado, sq.fecha) as sq2;


    select json_agg(
                   json_build_object(
                           'idFeedback', f.id_feedback,
                           'idResultadoPruebaTecnico', f.id_resultado_prueba_tecnico,
                           'idResultadoPruebaSupervisor', f.id_resultado_prueba_supervisor,
                           'aprobado', f.aprobado,
                           'comentario', f.comentario
                   )
           )
    into v_feedback_json
    from feedback f
    where f.id_resultado_prueba_supervisor in (select rp.id_resultado_prueba
                                               from resultado_prueba rp
                                               where rp.id_proyecto = p_id_proyecto)
       or f.id_resultado_prueba_tecnico in (select rp.id_resultado_prueba
                                            from resultado_prueba rp
                                            where rp.id_proyecto = p_id_proyecto);

    select array(select case
                            when p.id_etapa_actual = 3 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 4 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 7 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 7)
                            end
                 from proyecto p
                 where p.id_proyecto = p_id_proyecto
           )
    into v_empleados_actuales_ids;

    v_empleados_actuales_ids := array_remove(v_empleados_actuales_ids, null);

    select json_agg(
                   json_build_object(
                           'idEmpleado', e.id_empleado,
                           'usuario', e.usuario,
                           'nombre', e.nombre,
                           'apellido', e.apellido,
                           'correo', e.correo,
                           'telefono', e.telefono,
                           'direccion', e.direccion,
                           'documentoIdentidad', e.documento_identidad,
                           'tipoDocumento', e.tipo_documento,
                           'rol', e.rol
                   )
           )
    into v_empleados_actuales_json
    from empleado e
    where e.id_empleado = any (v_empleados_actuales_ids);

    select json_build_object(
                   'idProyecto', p.id_proyecto,
                   'titulo', p.titulo,
                   'descripcion', p.descripcion,
                   'fechaInicio', p.fechaInicio,
                   'fechaFin', p.fechaFin,
                   'costoManoObra', c.costo_mano_obra,
                   'costoRepuestos', c.costo_repuestos,
                   'costoTotal', c.costo_total,
                   'idEtapaActual', p.id_etapa_actual,
                   'etapaActual', (select e.nombre from etapa e where e.id_etapa = p.id_etapa_actual),
                   'cliente', v_cliente_json,
                   'supervisor', v_supervisor_json,
                   'jefe', v_jefe_json,
                   'repuestos', v_repuestos_json,
                   'especificaciones', v_especificaciones_json,
                   'resultados', v_resultados_prueba_json,
                   'feedbacks', v_feedback_json,
                   'empleadosActuales', v_empleados_actuales_json
           )
    into v_proyecto_json
    from proyecto p
             join costos c on p.id_costo = c.id_costo
    where id_proyecto = p_id_proyecto;
    return v_proyecto_json;
end;
$$ language plpgsql;

-- paCrearTipoPrueba : Crea un tipo de prueba
create or replace function paCrearTipoPrueba(
    nombre_prueba varchar
) returns int as
$$
declare
    nuevo_tipo_prueba_id int;
begin
    insert into tipo_prueba(nombre)
    values (nombre_prueba)
    returning id_tipo_prueba into nuevo_tipo_prueba_id;
    return nuevo_tipo_prueba_id;
end;
$$ language plpgsql;

-- paxCrearParametro : Crea un parametro
create or replace function paxCrearParametro(
    parametro_json json
) returns int as
$$
declare
    nuevo_parametro_id int;
begin
    insert into parametro(id_tipo_prueba, unidades, nombre)
    values ((parametro_json ->> 'idTipoPrueba')::int,
            (parametro_json ->> 'unidades')::varchar,
            (parametro_json ->> 'nombre')::varchar)
    returning id_parametro into nuevo_parametro_id;
    return nuevo_parametro_id;
end;
$$ language plpgsql;

-- paxCrearPruebaParametros : Crea un tipo de prueba junto a sus parámetros
create or replace function paxCrearPruebaParametros(
    prueba_parametros_json json
) returns int as
$$
declare
    nuevo_tipo_prueba_id int;
    repuestos_array      json[];
    repuesto_json        json;
begin
    nuevo_tipo_prueba_id := paCrearTipoPrueba((prueba_parametros_json ->> 'nombre')::varchar);
    select array(
                   select json_array_elements(prueba_parametros_json -> 'parametros')
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            repuesto_json := json_build_object(
                    'idTipoPrueba', nuevo_tipo_prueba_id,
                    'unidades', (repuestos_array[i] ->> 'unidades')::varchar,
                    'nombre', (repuestos_array[i] ->> 'nombre')::varchar);
            perform paxcrearparametro(repuesto_json);
        end loop;
    return nuevo_tipo_prueba_id;
end;
$$ language plpgsql;

-- paxObtenerEmpleadosPorRol : Obtiene la lista de empleados por rol
create or replace function paxObtenerEmpleadosPorRol(
    rol_empleado varchar
) returns json as
$$
declare
    empleados json;
begin
    select json_agg(json_build_object(
            'idEmpleado', e.id_empleado,
            'usuario', e.usuario,
            'nombre', e.nombre,
            'apellido', e.apellido,
            'correo', e.correo,
            'telefono', e.telefono,
            'direccion', e.direccion,
            'documentoIdentidad', e.documento_identidad,
            'tipoDocumento', e.tipo_documento,
            'rol', e.rol))
    into empleados
    from empleado e
    where e.rol = rol_empleado;
    return empleados;
end;
$$ language plpgsql;

-- paxObtenerRepuestosRequeridos : Obtiene la lista de repuestos requeridos
create or replace function paxObtenerRepuestosRequeridos()
    returns json as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado))
    into repuestos
    from repuesto r
    where r.stock_requerido < 0;
    return repuestos;
end;
$$ language plpgsql;

-- paxActualizarStock : Actualiza el stock de un repuesto
create or replace function paxActualizarStock(
    repuesto_json json
) returns int as
$$
declare
    repuesto_id int;
begin
    update repuesto
    set stock_disponible = stock_disponible + (repuesto_json ->> 'stockAgregado')::int,
        stock_requerido  = stock_requerido + (repuesto_json ->> 'stockAgregado')::int
    where id_repuesto = (repuesto_json ->> 'idRepuesto')::int
    returning id_repuesto into repuesto_id;
    return repuesto_id;
end;
$$ language plpgsql;

-- paxObtenerClientesPorIds : Obtiene los clientes por ids
create or replace function paxObtenerClientesPorIds(
    ids_clientes json
) returns json as
$$
declare
    clientes json;
    ids      int[];
begin
    select array(
                   select json_array_elements_text(ids_clientes)
           )
    into ids;
    select json_agg(json_build_object(
            'idCliente', c.id_cliente,
            'nombre', c.nombre,
            'ruc', c.ruc,
            'direccion', c.direccion,
            'telefono', c.telefono,
            'correo', c.correo,
            'documentoDeIdentidad', c.documento_de_identidad,
            'tipoDeDocumentoDeIdentidad', c.tipo_de_documento_de_identidad))
    into clientes
    from cliente c
    where c.id_cliente = any (ids);
    return clientes;
end;
$$ language plpgsql;

-- paxObtenerEmpleadosPorIds : Obtiene los empleados por ids
create or replace function paxObtenerEmpleadosPorIds(
    ids_empleados json
) returns json as
$$
declare
    empleados json;
begin
    select json_agg(json_build_object(
            'idEmpleado', e.id_empleado,
            'usuario', e.usuario,
            'nombre', e.nombre,
            'apellido', e.apellido,
            'correo', e.correo,
            'telefono', e.telefono,
            'direccion', e.direccion,
            'documentoIdentidad', e.documento_identidad,
            'tipoDocumento', e.tipo_documento,
            'rol', e.rol))
    into empleados
    from empleado e
    where e.id_empleado = any ((select array(select json_array_elements_text(ids_empleados)))::int[]);
    return empleados;
end;
$$ language plpgsql;

-- paxObtenerRepuestosPorIds : Obtiene los repuestos por ids
create or replace function paxObtenerRepuestosPorIds(
    ids_repuestos json
) returns json as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado))
    into repuestos
    from repuesto r
    where r.id_repuesto = any ((select array(select json_array_elements_text(ids_repuestos)))::int[]);
    return repuestos;
end;
$$ language plpgsql;

-- paxObtenerRepuestosPorProyecto : Obtiene los repuestos por proyecto
create or replace function paxObtenerRepuestosPorProyecto(
    id_proyecto_r int
) returns json as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado,
            'cantidad', prc.cantidad))
    into repuestos
    from repuesto r
             join proyecto_repuestos_cantidad prc on r.id_repuesto = prc.id_repuesto
    where prc.id_proyecto = id_proyecto_r;
    return repuestos;
end;
$$ language plpgsql;

-- paxAgregarRepuestosRequeridos : Agrega repuestos requeridos
create or replace function paxAgregarRepuestosRequeridos(
    repuestos_requeridos json
) returns void as
$$
declare
    repuestos_array json[];
begin
    select array(
                   select json_array_elements(repuestos_requeridos)
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            if (repuestos_array[i] ->> 'stockRequerido')::int < 0 then
                raise exception 'El stock requerido no puede ser negativo';
            end if;
            update repuesto
            set stock_requerido = stock_requerido - (repuestos_array[i] ->> 'stockRequerido')::int
            where id_repuesto = (repuestos_array[i] ->> 'idRepuesto')::int;
        end loop;
end;
$$ language plpgsql;

-- paxAsignarRepuestosAProyecto : Asigna repuestos a un proyecto
create or replace function paxAsignarRepuestosAProyecto(
    repuestos_asignados json
) returns void as
$$
declare
    repuestos_array json[];
begin
    select array(
                   select json_array_elements(repuestos_asignados)
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            if (repuestos_array[i] ->> 'stockAsignado')::int < 0 then
                raise exception 'El stock asignado no puede ser negativo';
            end if;
            update repuesto
            set stock_asignado   = stock_asignado + (repuestos_array[i] ->> 'stockAsignado')::int,
                stock_disponible = stock_disponible - (repuestos_array[i] ->> 'stockAsignado')::int
            where id_repuesto = (repuestos_array[i] ->> 'idRepuesto')::int;
        end loop;
    -- deberia cambiar de etapa?
end;
$$ language plpgsql;

-- paxObtenerProyectoPorJefe : Obtiene los proyectos por jefe
create or replace function paxObtenerProyectoPorJefe(
    id_jefe_p int
) returns json as
$$
declare
begin
    return (select json_agg(paobtenerproyectosporid(p.id_proyecto))
            from proyecto p
            where p.id_jefe = id_jefe_p);
end;
$$ language plpgsql;

-- paxObtenerProyectoPorSupervisor : Obtiene los proyectos por supervisor
create or replace function paxObtenerProyectoPorSupervisor(
    id_supervisor_p int
) returns json as
$$
declare
begin
    return (select json_agg(paobtenerproyectosporid(p.id_proyecto))
            from proyecto p
            where p.id_supervisor = id_supervisor_p);
end;
$$ language plpgsql;

-- paxObtenerEtapaPorId : Obtiene la etapa por id
create or replace function paxObtenerEtapaPorId(
    id_etapa_p int
) returns json as
$$
declare
    etapa json;
begin
    select json_build_object(
                   'idEtapa', e.id_etapa,
                   'nombre', e.nombre
           )
    into etapa
    from etapa e
    where e.id_etapa = id_etapa_p;
    return etapa;
end;
$$ language plpgsql;

-- paxObtenerRepuestosFaltantesPorJefe : Obtiene los repuestos faltantes de los proyectos de un jefe
create or replace function paxObtenerRepuestosFaltantesPorJefe(
    id_jefe_p int
) returns json as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado,
            'cantidad', prc.cantidad))
    into repuestos
    from repuesto r
             join proyecto_repuestos_cantidad prc on r.id_repuesto = prc.id_repuesto
             join proyecto p on prc.id_proyecto = p.id_proyecto
    where p.id_jefe = id_jefe_p
      and r.stock_requerido < 0
    group by r.id_repuesto;
    return repuestos;
end;
$$ language plpgsql;

-- paObtenerTecnicosDisponibles : Obtiene los técnicos disponibles
create or replace function paObtenerTecnicosDisponibles()
    returns json
as
$$
declare
    tecnicos_ids int[];
    tecnicos     json;
begin
    select array(select case
                            when p.id_etapa_actual = 3 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 4 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 7 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 7)
                            end
                 from proyecto p)
    into tecnicos_ids;

    tecnicos_ids := array_remove(tecnicos_ids, null);

    select json_agg(json_build_object(
            'idEmpleado', e.id_empleado,
            'usuario', e.usuario,
            'nombre', e.nombre,
            'apellido', e.apellido,
            'correo', e.correo,
            'telefono', e.telefono,
            'direccion', e.direccion,
            'documentoIdentidad', e.documento_identidad,
            'tipoDocumento', e.tipo_documento,
            'rol', e.rol))
    into tecnicos
    from empleado e
    where e.rol = 'tecnico'
      and e.id_empleado != all (tecnicos_ids);

    raise notice '%', tecnicos;

    return tecnicos;
end;
$$ language plpgsql;

-- paAsignarEmpleadosAProyecto : Asigna empleados a un proyecto
create or replace function paAsignarEmpleadosAProyecto(
    p_idProyecto int,
    p_idEmpleados int[],
    p_fechaAsignacion date
) returns void as
$$
declare
    v_tecnicos_ocupados int[];
    v_id_etapa_prev       int;
begin
    select array(select case
                            when p.id_etapa_actual = 3 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 4 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 7 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 7)
                            end
                 from proyecto p)
    into v_tecnicos_ocupados;
    v_tecnicos_ocupados := array_remove(v_tecnicos_ocupados, null);

    IF array_length(p_idEmpleados, 1) IS NULL THEN
        RAISE EXCEPTION 'La lista de empleados no puede estar vacía.';
    END IF;
    IF p_idEmpleados && v_tecnicos_ocupados THEN
        RAISE EXCEPTION 'No se puede asignar a un técnico que no está disponible';
    END IF;
    for i in 1..array_length(p_idEmpleados, 1)
        loop
            INSERT INTO proyecto_etapa_empleado (id_proyecto, id_etapa, id_tecnico)
            VALUES (p_idProyecto, 3, p_idEmpleados[i]);
        end loop;
    select p.id_etapa_actual into v_id_etapa_prev from proyecto p where p.id_proyecto = p_idProyecto;
    if v_id_etapa_prev = 2 then
        perform  paCambiarEtapaProyecto(p_idProyecto, 3, p_fechaAsignacion);
    else
        if v_id_etapa_prev = 6 then
            perform paCambiarEtapaProyecto(p_idProyecto, 7, p_fechaAsignacion);
        end if;
    end if;
end;
$$ language plpgsql;

-- paCambiarEtapaProyecto : Cambia la etapa de un proyecto
create or replace function paCambiarEtapaProyecto(
    p_id_proyecto int,
    p_id_etapa int,
    p_fecha_inicio date
)
    returns void as
$$
declare
    v_id_etapa_prev int;
begin
    select pec.id_etapa
    into v_id_etapa_prev
    from proyecto_etapas_cambio pec
    where pec.id_proyecto = p_id_proyecto
      and pec.fecha_fin is null;
    update proyecto_etapas_cambio pec
    set fecha_fin = p_fecha_inicio
    where pec.id_proyecto = p_id_proyecto
      and pec.id_etapa = v_id_etapa_prev;
    insert into proyecto_etapas_cambio (id_proyecto, id_etapa, fecha_inicio)
    values (p_id_proyecto, p_id_etapa, p_fecha_inicio);
    update proyecto
    set id_etapa_actual = p_id_etapa
    where id_proyecto = p_id_proyecto;
end;
$$ language plpgsql;

-- paObtenerProyectoPorTecnico : Obtiene los proyectos por tecnico
create or replace function paObtenerProyectoPorTecnico(p_id_empleado int)
    returns json as
$$
declare
    v_ids_proyecto  int;
    v_proyecto_json json;
begin
    select pee.id_proyecto
    into v_ids_proyecto
    from proyecto_etapa_empleado pee
    where pee.id_tecnico = p_id_empleado
    limit 1;
    select * into v_proyecto_json from paObtenerProyectosPorId(v_ids_proyecto);
    return v_proyecto_json;
end;
$$ language plpgsql;

-- paRegistrarResultados : Registra los resultados de una prueba
create or replace function paRegistrarResultados(
    p_registro_json json
)
    returns int as
$$
declare
    v_resultados          json[];
    v_especificaciones    json[];
    v_resultado_prueba_id int;
    v_etapa_previa        int;
begin
    insert into resultado_prueba (id_proyecto, id_empleado, fecha)
    values ((p_registro_json ->> 'idProyecto')::integer, (p_registro_json ->> 'idEmpleado')::integer,
            (p_registro_json ->> 'fecha')::date)
    returning id_resultado_prueba into v_resultado_prueba_id;
    select array(
                   select json_array_elements(p_registro_json -> 'resultados')
           )
    into v_resultados;
    for i in 1..array_length(v_resultados, 1)
        loop
            select array(
                           select json_array_elements(v_resultados[i] -> 'especificaciones')
                   )
            into v_especificaciones;
            for j in 1..array_length(v_especificaciones, 1)
                loop
                    insert into prueba_parametro_resultado (id_resultado_prueba, id_tipo_prueba, id_parametro, valor)
                    values (v_resultado_prueba_id, (v_resultados[i] ->> 'idTipoPrueba')::int,
                            (v_especificaciones[j] ->> 'idParametro')::int,
                            (v_especificaciones[j] ->> 'resultado')::numeric);
                end loop;
        end loop;
    select p.id_etapa_actual
    into v_etapa_previa
    from proyecto p
    where p.id_proyecto = (p_registro_json ->> 'idProyecto')::int;
    if v_etapa_previa = 3 then
        perform paCambiarEtapaProyecto((p_registro_json ->> 'idProyecto')::int, 4, (p_registro_json ->> 'fecha')::date);
    end if;
    return v_resultado_prueba_id;
end;
$$ language plpgsql;

-- paRegistrarFeedback : Registra un feedback
create or replace function paRegistrarFeedback(
    p_feedback_json json
) returns int
as
$$
declare
    v_resultados                     json;
    v_resultado_prueba_supervisor_id int;
    v_feedback_id                    int;
    v_etapa_previa                   int;
begin
    select json_build_object(
                   'idProyecto', p_feedback_json ->> 'idProyecto',
                   'idEmpleado', p_feedback_json ->> 'idEmpleado',
                   'fecha', p_feedback_json ->> 'fecha',
                   'resultados', p_feedback_json -> 'resultados'
           )
    into v_resultados;
    select * into v_resultado_prueba_supervisor_id from paRegistrarResultados(v_resultados);
    insert into feedback (id_resultado_prueba_tecnico, id_resultado_prueba_supervisor, aprobado, comentario)
    values (p_feedback_json ->> 'idResultadoPruebaTecnico', v_resultado_prueba_supervisor_id,
            p_feedback_json ->> 'aprobado', p_feedback_json ->> 'comentario')
    returning id_feedback into v_feedback_id;
    select p.id_proyecto into v_etapa_previa from proyecto p where p.id_proyecto = p_feedback_json ->> 'idProyecto';
    if v_etapa_previa = 4 and p_feedback_json ->> 'aprobado'::bool then
        perform paCambiarEtapaProyecto(p_feedback_json ->> 'idProyecto', 5, p_feedback_json ->> 'fecha');
    else
        if v_etapa_previa = 4 and not p_feedback_json ->> 'aprobado'::bool then
            perform paCambiarEtapaProyecto(p_feedback_json ->> 'idProyecto', 3, p_feedback_json ->> 'fecha');
        end if;
    end if;
    return v_feedback_id;
end;
$$ language plpgsql;

-- paObtenerHistorialProyecto: Obtiene el historial del proyecto
create or replace function paObtenerHistorialProyecto(
    p_id_proyecto integer
) returns json
as
$$
declare
    v_etapas_empleados_json json;
    v_etapas_cambios_json   json;
    v_historial_json        json;
begin
    -- Obtener las etapas y empleados asignados
    select json_agg(
               json_build_object(
                   'idEtapa', e.id_etapa,
                   'nombreEtapa', e.nombre,
                   'empleados', (
                       select json_agg(
                           json_build_object(
                               'idEmpleado', em.id_empleado,
                               'nombre', em.nombre,
                               'apellido', em.apellido,
                               'correo', em.correo,
                               'telefono', em.telefono,
                               'tipoDocumento', em.tipo_documento,
                               'documentoIdentidad', em.documento_identidad,
                               'rol', em.rol,
                               'linkImg', em.link_img
                           )
                       )
                       from proyecto_etapa_empleado pee
                                join empleado em on pee.id_tecnico = em.id_empleado
                       where pee.id_proyecto = p_id_proyecto
                         and pee.id_etapa = e.id_etapa
                   )
               )
           )
    into v_etapas_empleados_json
    from etapa e
    where e.id_etapa in (
        select distinct pee.id_etapa
        from proyecto_etapa_empleado pee
        where pee.id_proyecto = p_id_proyecto
    );

    -- Obtener los cambios en las etapas
    select json_agg(
               json_build_object(
                   'idEtapaCambio', pec.id_proyecto_etapas_cambio,
                   'idEtapa', pec.id_etapa,
                   'nombreEtapa', e.nombre,
                   'fechaInicio', pec.fecha_inicio,
                   'fechaFin', pec.fecha_fin
               )
           )
    into v_etapas_cambios_json
    from proyecto_etapas_cambio pec
             join etapa e on pec.id_etapa = e.id_etapa
    where pec.id_proyecto = p_id_proyecto;

    -- Construir el historial del proyecto
    select json_build_object(
               'idProyecto', p_id_proyecto,
               'etapasEmpleados', v_etapas_empleados_json,
               'etapasCambios', v_etapas_cambios_json
           )
    into v_historial_json;

    return v_historial_json;
end;
$$ language plpgsql;

comment on function paObtenerHistorialProyecto(integer) is 'Obtiene el historial del proyecto por ID, incluyendo asignaciones de empleados y cambios de etapas';

-- paValidarCorreo: Obtiene la información del empleado por correo
create or replace function paValidarCorreo(
    p_correo varchar
) returns json
as
$$
declare
    v_empleado json;
begin
    -- Intentar obtener el empleado con el correo proporcionado
    select json_build_object(
               'idEmpleado', e.id_empleado,
               'password', e.password,
               'nombre', e.nombre,
               'apellido', e.apellido,
               'correo', e.correo,
               'telefono', e.telefono,
               'direccion', e.direccion,
               'tipoDocumento', e.tipo_documento,
               'documentoIdentidad', e.documento_identidad,
               'rol', e.rol,
               'linkImg', e.link_img
           )
    into v_empleado
    from empleado e
    where e.correo = p_correo;

    -- Si no se encuentra el empleado, retornar NULL
    if v_empleado is null then
        raise exception 'Usuario no encontrado';
    end if;

    return v_empleado;
end;
$$ language plpgsql;

comment on function paValidarCorreo(varchar) is 'Obtiene la información del empleado por correo';


-------------------- COMMENTS --------------------

comment on function paxRegistrarCliente(json) is 'Registra un cliente en la base de datos';
comment on function paxRegistrarEmpleado(json) is 'Registra un empleado en la base de datos';
comment on function paxObtenerClientes() is 'Obtiene la lista de clientes';
comment on function paxObtenerPruebasConParametros() is 'Obtiene la lista de pruebas con sus parametros';
comment on function paxInsertarProyecto(json) is 'Registra un proyecto en la base de datos';
comment on function paxRegistrarRepuesto(json) is 'Registra un repuesto en la base de datos';
comment on function paxObtenerRepuestos() is 'Obtiene la lista de repuestos';
comment on function paxObtenerProyectos() is 'Obtiene la lista de proyectos';
comment on function paObtenerProyectosPorId(int) is 'Obtiene los proyectos por id';
comment on function paCrearTipoPrueba(varchar) is 'Crea un tipo de prueba';
comment on function paxCrearParametro(json) is 'Crea un parametro';
comment on function paxCrearPruebaParametros(json) is 'Crea un tipo de prueba junto a sus parametros';
comment on function paxObtenerEmpleadosPorRol(varchar) is 'Obtiene la lista de empleados por rol';
comment on function paxObtenerRepuestosRequeridos() is 'Obtiene la lista de repuestos requeridos';
comment on function paxActualizarStock(json) is 'Actualiza el stock de un repuesto';
comment on function paxObtenerClientesPorIds(json) is 'Obtiene los clientes por ids';
comment on function paxObtenerEmpleadosPorIds(json) is 'Obtiene los empleados por ids';
comment on function paxObtenerRepuestosPorIds(json) is 'Obtiene los repuestos por ids';
comment on function paxObtenerRepuestosPorProyecto(int) is 'Obtiene los repuestos por proyecto';
comment on function paxAgregarRepuestosRequeridos(json) is 'Agrega repuestos requeridos';
comment on function paxAsignarRepuestosAProyecto(json) is 'Asigna repuestos a un proyecto';
comment on function paxObtenerProyectoPorJefe(int) is 'Obtiene los proyectos por jefe';
comment on function paxObtenerEtapaPorId(int) is 'Obtiene la etapa por id';
comment on function paxObtenerRepuestosFaltantesPorJefe(int) is 'Obtiene los repuestos faltantes de los proyectos de un jefe';
comment on function paObtenerTecnicosDisponibles() is 'Obtiene los técnicos disponibles';
comment on function paAsignarEmpleadosAProyecto(int, int[], date) is 'Asigna empleados a un proyecto';
comment on function paCambiarEtapaProyecto(int, int, date) is 'Cambia la etapa de un proyecto';
comment on function paObtenerProyectoPorTecnico(int) is 'Obtiene los proyectos por tecnico';
comment on function paRegistrarResultados(json) is 'Registra los resultados de una prueba';
