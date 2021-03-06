
use phpmyadmin;
drop database abarrotes ;
 create database abarrotes;
ALTER DATABASE abarrotes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use abarrotes;

create table productos(
	codigoBarras varchar(30) primary key,
	nombre varchar(60),
	precio decimal(7,2),
    ventaGranel varchar(2)
);

create table clienteCredito(
	numCliente int primary key auto_increment,
	nombre varchar(50),
	limiteCredito decimal(7,2)
);

create table departamento(
	codigoDpto char(5) primary key,
	nombre varchar(50)
    
);

create table ventas(
	consecutivo int primary key auto_increment,
	fechaVenta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	montoTotal decimal(7,2),
	numCliente int, 
    foreign key(numCliente) references clienteCredito(numCliente)
);




/*				Tablas de Muchos a Muchos*/
create table productos_ventas(
	consecutivoVenta int ,
	codigoProducto varchar(30),
	subtotal decimal(7,2),
	cantidad decimal(7,2) ,
    foreign key(consecutivoVenta) references ventas(consecutivo),
    foreign key(codigoProducto) references productos(codigoBarras)
);


create table productos_departamento(
	codigoProducto varchar(30) ,
	codigoDpto char(5) ,
    foreign key(codigoProducto) references productos(codigoBarras),
    foreign key (codigoDpto)references departamento(codigoDpto) on delete cascade
);

create table ventas_credito(
	total decimal(7,2),
    numCliente int ,
    numVenta int ,
    status bit default 0
);

 

/*verificar si el producto se vende a granel */
alter table productos 
add constraint ck_quantity_type
check  (ventaGranel='si' or ventaGranel = 'no') ;

insert into clienteCredito values (1,'Publico General',null);

-- Consigue todos los departamentos de un producto
create procedure productos_departamentos(in codigoProducto varchar(30))
	select d.codigoDpto , d.nombre
	from productos_departamento dp join productos p join departamento d
	on p.codigoBarras = dp.codigoProducto and d.codigoDpto = dp.codigoDpto
	where p.codigoBarras = codigoProducto
; 
 