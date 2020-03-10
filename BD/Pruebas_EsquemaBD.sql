use abarrotes;

select * from productos_ventas;

select * from ventas;

insert into productos_ventas(consecutivoVenta,codigoProducto,monto,cantidad,cantidadGramos) values(?,?,?,?);

select count(*) from productos; 

update productos_ventas set monto = ? where consecutivoVenta=?;