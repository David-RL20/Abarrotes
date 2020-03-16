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


-- Consigue todos los departamentos de un producto
create procedure productos_departamentos(in codigoProducto varchar(30))
	select d.codigoDpto , d.nombre
	from productos_departamento dp join productos p join departamento d
	on p.codigoBarras = dp.codigoProducto and d.codigoDpto = dp.codigoDpto
	where p.codigoBarras = codigoProducto
;
insert into productos_departamento values (26000003056,'123C');
select * from departamento;
/*INSERCION DE PRODUCTOS*/
update productos set codigoBarras = ?,nombre = ? , precio=?,ventaGranel=? where codigoBarras=?;
update productos set codigoBarras = '12345',nombre ='Prueba modificada' , precio=2.0,ventaGranel='no' where codigoBarras='123';

select * from productos where codigoBarras='70330709485';
insert into productos (codigoBarras,nombre,precio,ventaGranel)values 
('26000003056',"Elmers Pegamento Liquido",18,'no'),
('70330700918',"Ratrillo Bic Twin",11,'no'),
('70330709485',"Rastrillo Bic Confort",11,'no'),
('70952000045',"Pasta codo liso (200g)",7,'no'),
('70952000083',"Pasta Talia Conchitas 200g",7,'no'),
('70952000113',"Pasta Talia Spaghetti 200g",7,'no'),
('70952000274',"Pasta Talia Pluma Lisa 200g",7,'no'),
('70952004067',"Pasta Talia Fideo Mediano 200g",7,'no'),
('71240012344',"Teasdale Maiz Blanco",50,'no'),
('96619960095',"Papel higienico kirkland",14,'no'),
('3086120000000',"Encendedor Big Maxi",25,'no'),
('3270220000000',"Colores BIC Evolution",80,'no'),
('602760000000',"Cuaderno Estrella 100h",20,'no'),
('602760000000',"Cuaderno Estrella 50h",20,'no'),
('602760000000',"Cuaderno Estrella cuadro 100h",20,'no'),
('602760000000',"Cuaderno Estrella dibujo 100h",20,'no'),
('6910020000000',"Cepillo Premiere Clean",13,'no'),
('706460000000',"Pedigree Sobres Pollo 150g",13,'no'),
('706460000000',"Pedigree Sobres Res 150g",13,'no'),	
('723829000000',"Vela paquete (pendiente)",100,'no'),	
('744218000000',"L Gummys Lombrices (Pendientes)",100,'no'),	
('744218000000',"L Gummys Lombriz Neon (Pendientes)",100,'no'),	
('744218000000',"L Gummys Aros de Durazno (Pendientes)",100,'no'),	
('744218000000',"L Gummys Corazones (Pendientes)",100,'no'),	
('744218000000',"L Gummys Cubitos (Pendientes)",100,'no'),	
('75002220',"Canelitas (60g)",14,'no'),		
('75002343',"Aceite 123 1L",30,'no'),		
('7500440000000',"Secret Antitraspirante",40,'no'),		
('7500480000000',"Churrumais (200g)",30,'no'),		
('7500480000000',"Galletas Maravillas 100g",12,'no'),		
('7500480000000',"Chokis clasicas (57g)",15,'no'),
('7500480000000',"Chokis clasicas (180.5g)",25,'no'),	
('7500480000000',"Chokis clasicas (76g)",15,'no'),	
('7500480000000',"Cheetos Poffs (38gr)",11,'no'),	
('7500480000000',"Emperador Combinadas (200g)",25,'no'),	
('7500480000000',"Emperador Limon (211g)",25,'no'),	
('7501000000000',"Chips Jalapeño (204g)",32,'no'),	
('7501000000000',"Papas Toreadas (70g)",32,'no'),	
('7501000000000',"Marias Doradas",19,'no'),	
('7501000000000',"Florentinas Fresa Gamesa 83g",14,'no'),	
('7501000000000',"Florentinas Cajeta Gamesa 83g",14,'no'),	
('7501000000000',"Cremax De Nieve Chocolate 90g",14,'no'),	
('7501000000000',"Cremax De Nieve Vainilla 90g",14,'no'),		
('7501000000000',"Cremax De Nieve Fresa 90g",14,'no'),
('7501000000000',"Cremax Chocolate (213g)",25,'no'),
('7501000000000',"Cremax Fresa (213g)",25,'no'),
('7501000000000',"Cremax Vainilla (213g)",25,'no'),
('7501000000000',"Emperador Chocolate (101g)",14,'no'),
('7501000000000',"Emperador Vainilla (101g)",14,'no'),
('7501000000000',"Emperador Nuez (101g)",14,'no'),
('7501000000000',"Emperador conbinadad (101g)",14,'no');
