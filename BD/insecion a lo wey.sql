use abarrotes ;

select numVentaDia , fechaVenta , montoTotal,numCliente, tipoVenta from ventas;

insert into ventas (numVentaDia,montoTotal,numCliente,tipoVenta)values
(13,1700,3, 'efectivo')
;

select * from proveedores;

insert into proveedores (diasReparto , diasPedido , nombreEmpresa)values 
('martes','Sabado', 'Cocacola');


select numCompraDia,fechaCompra,montoTotal,numProveedor from compras;

insert into compras (numCompraDia,montoTotal,numProveedor)values
(3, 159.80, 3)
;


use abarrotes;

select * from clientecredito;

insert into clientecredito (nombre , limiteCredito) values
('Fulanito de tal',600);

select * from productos where codigoBarras = '123538';







use abarrotes;

select * from clientecredito;

insert into clientecredito (nombre , limiteCredito) values (?,?);


update clientecredito set limiteCredito= ? , nombre = ? where numCliente = ?

;



select * from departamento;

update departamento set codigoDpto = ? , nombre = ? where codigoDpto = ?;

insert into departamento values (?,?);

select * from productos where codigoBarras=1232178;

insert into productos values (?,?,?,?);

update productos  set codigoBarras=? , stock=? , nombre=? , precio= ?  where codigoBarras = ?;




select * from productos;

insert into compras (numCompraDia,montoTotal,numProveedor) values (?,?,?);

update compras set montoTotal = 0 where consecutivo= ?;

update compras set numCompraDia=?,montoTotal=?,numProveedor=? where numCompraDia=?;

use abarrotes;
select * from proveedores;

insert into proveedores (diasReparto,diasPedido,nombreEmpresa) values(?,?,?);

delete from proveedores where numProveedor=1;
           
select* from proveedores;

update proveedores set diasReparto ='lunes' ,diasPedido ='martes'  , nombreEmpresa ='fulanita' where numProveedor=2;


use abarrotes;
select * from productos_departamento;
select * from departamento;

select * from ventas;
insert into productos_departamento values('1235672','GALLE');
select * from productos;
insert into ventas (numVentaDia , montoTotal , numCliente ,tipoVenta) values (?,?,?, ?);


update ventas set  numVentaDia=?,montoTotal= ? , numCliente= ?, tipoVenta=? where consecutivo= 2;

insert into productos values('085040522',2,'EL PELON',1.00);