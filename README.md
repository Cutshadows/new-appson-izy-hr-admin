# izy_admin
 izy_admin

# ![aplicacion movil para IzyTech](../new-appson-izy-hr-admin/platforms/android/app/build/intermediates/merged_assets/debug/mergeDebugAssets/out/www/assets/img/introduction/ica-slidebox-img-2.png)

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
```