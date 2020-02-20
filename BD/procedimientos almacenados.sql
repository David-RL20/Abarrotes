-- Consigue todos los departamentos de un producto
create procedure productos_departamentos(in codigoProducto varchar(30))
	select d.codigoDpto , d.nombre
	from productos_departamento dp join productos p join departamento d
	on p.codigoBarras = dp.codigoProducto and d.codigoDpto = dp.codigoDpto
	where p.codigoBarras = codigoProducto
;
call productos_departamentos ('1235671');

select * from productos_departamento;

select * from departamento where codigoDpto = 'VERDU';


