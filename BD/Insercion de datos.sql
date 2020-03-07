use abarrotes;
select * from departamento;
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
insert into clienteCredito (nombre,limiteCredito) values ('Dona pelos 1',300);
insert into clienteCredito (nombre,limiteCredito) values ('Dona pelos 2',350);
insert into clienteCredito (nombre,limiteCredito) values ('Dona pelos 3',120.40);


							/*	P R O D U C T O S*/
insert into productos values
( 8000500267035,30,'Kinder Delice',18.5);
insert into productos values
(1235679,70,'Oreo',15),
(1235671,80,'Chettos',11),
(1235672,60,'Quesos',18.5),
(1235,20,'Leche',18.5),
(123538,33,'Galletas',18.5),
(1232178,31,'Galletas',18.5);
 

 

insert into productos_departamento values 
('1235671','VERDU');

