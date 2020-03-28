use abarrotes;
							/*			D E P A R T A M E N T O  */
insert into departamento values
('VERDU','Dpto. de Verduras'),
('LACTE','Dpto. de Lacteos y Quesos'),
('DLATA','Dpto. de Enlatados'),
('GALLE','Dpto. de Galletas y Panes '),
('SABRI','Dpto. de Sabritas y Botanas'),
('GRANE','Dpto. de Venta a Granel'),
('MEDIC','Dpto. de Medicamentos'),
('ABARR','Dpto. de Abarrote en General');

								/* C L I E N T E S*/
/*		Utilizar este formato par al incercion de datos con auto_increment*/
insert into clienteCredito (nombre,limiteCredito) values ('Publico General',null);
insert into clienteCredito (nombre,limiteCredito) values ('Usuario Prueba',300);


select count(*) from productos;
select * from clienteCredito;
 select v.fechaVenta,v.montoTotal,v.numCliente,numVenta from ventas_credito as vc join ventas as v on numVenta = consecutivo and vc.status=0 and  vc.numCliente =2;
 select * from ventas ;
 
 select * from productos_ventas where consecutivoVenta =?;
