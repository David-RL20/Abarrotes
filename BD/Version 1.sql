
use phpmyadmin;
drop database abarrotes ;
 create database abarrotes;

use abarrotes;

create table productos(
	codigoBarras varchar(30) primary key,
	stock int,
	nombre varchar(60),
	precio decimal(7,2)
);

create table clienteCredito(
	numCliente int primary key auto_increment,
	nombre varchar(50),
	limiteCredito decimal(7,2)
);

create table proveedores(
	numProveedor int primary key auto_increment,
	diasReparto varchar(20),
	diasPedido varchar(20),
	nombreEmpresa varchar(60),
	constraint CK_proveedores_DiasPedido check (diasPedido in ('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo')),
	constraint CK_proveedores_DiasReparto check (diasReparto in ('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'))
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
    tipoVenta varchar(10),
    foreign key(numCliente) references clienteCredito(numCliente)
);

create table compras(
	consecutivo int primary key auto_increment,
	fechaCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	montoTotal decimal(7,2),
	numProveedor int,
    foreign key (numProveedor)references proveedores(numProveedor)
);


/*				Tablas de Muchos a Muchos*/
create table productos_ventas(
	consecutivoVenta int ,
	codigoProducto varchar(30),
	monto decimal(7,2),
	cantidad int,
	cantidadGramos decimal(7,2) default null,
    foreign key(consecutivoVenta) references ventas(consecutivo),
    foreign key(codigoProducto) references productos(codigoBarras)
);

create table productos_compras(
	codigoProducto varchar(30) ,
	consecutivoCompras int,
	montoTotal decimal(7,2),
	cantidad int,
	cantidadGramos decimal(7,2) default null,
    foreign key(codigoProducto) references productos(codigoBarras),
     foreign key(consecutivoCompras) references compras(consecutivo)
);

create table productos_departamento(
	codigoProducto varchar(30) ,
	codigoDpto char(5) ,
    foreign key(codigoProducto) references productos(codigoBarras),
    foreign key (codigoDpto)references departamento(codigoDpto)
);

create table ventas_credito(
	total decimal(7,2),
    numCliente int ,
    foreign key(numCliente) references clienteCredito (numCliente)
);

alter table ventas 
add constraint ck_type_Sell
check  (tipoVenta='efectivo' or tipoVenta = 'credito') ;