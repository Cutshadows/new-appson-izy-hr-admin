# IZY HR ADMIN [IOS] v0.0.3 Current Version
 izy_admin
[11:49, 17/10/2019] Douglas: # IZY HR ADMIN [IOS]
 izy_admin

# ![aplicacion movil para IzyTech](https://lh3.googleusercontent.com/YBN_C2LrrPICJ3YKVYB4eqJIg2xkU0n8U70NO8QOGU5RACKqVwZCvBuZQCD2-yhK3g=s180-rw) ![plataforma IOS](https://img1.freepng.es/20180319/kvw/kisspng-iphone-computer-icons-apple-icon-image-format-app-os7-style-metro-ui-icon-5ab06b39630445.4370921315215112254056.jpg =200x)

## 1 .- Modulos de Control
   * login (ingreso)
   * dashboard (menu Principal)
   * selectbranch
   * mydevices
   * attendanceview
   * attendanceviewdetail
   * informations

## 2 .-Componentes
   * footer
   * header
   * menu-footer

## 3.- Providers o Servicios
   * auth-login.services
   * api-expend.services
   * auth-guard.services
   * authentication.services
   * functions.services
   * introduction.services

## 4.- Funcionalidades
   * Listado de Sucursales
   * Listados de Dispositivos que Marcan
   * Revision de Trabajores por Sucursal y Horario
   * Información del trabajador
   * Hora de Marca del Trabajador y Geolocalización.
   * Inicio de Sesion con autentificacion por Huella o Reconocimiento Facial.

> Documentacion aplicacion movil IZY HR ADMIN 

* http con promise para conectarse a la api.
* timeout rxjs para agotar tiempo de espera.
* manejo de estados en la red
* catchError para error timeout
* delay para ejecutar skeleton en las plantillas de pre carga.
* mensajes Toast, Loading y Alert personalizados.
``` bash  
    404 (no se encuentra dato)
    500 (server problem)
    400 (No encuentra la direccion)
    408 (timeout expire)