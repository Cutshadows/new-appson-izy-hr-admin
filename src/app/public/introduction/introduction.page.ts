import { Component, OnInit } from '@angular/core';
import { IntroductionService } from '../../services/introduction.service';
import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';



@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class Introduction implements OnInit {
  slides:any[] = [
    {
      title: "¡Bienvenido!",
      description: "",
      image: "assets/img/introduction/ica-slidebox-img-1.png",
    },
    {
      title: "Geolocalización",
      description: "<b>IZY HR ADMIN, posibilita ubicar en donde el empleado realiza marca de ingreso y darnos las referencias de como llegar al lugar en donde se produjo dicha marca.</b>",
      image: "assets/img/introduction/ica-slidebox-img-2.png",
    },
    {
      title: "Control en Tiempo Real",
      description: "<b>IZY ADMIN, permite controlar en tiempo real las marcas de sus empleados.</b>",
      image: "assets/img/introduction/ica-slidebox-img-3.png",
    },
    {
      title: "Control de Marcas",
      description: "<b>Además, cada cierto tiempo se enviara una notificación con las personas que aún no marcan.</b>",
      image: "assets/img/introduction/ica-slidebox-img-4.png",
    }
  ];
  slidesOpts = {
    initialSlide: 0,
    speed: 400
  };
    constructor(private _tutorial:IntroductionService, private nativePageTransitions: NativePageTransitions, private router: Router) { }

  ngOnInit() {
  }
  saltar_tutorial(){
    this._tutorial.introduccion.mostrar_tutorial=false;
    this._tutorial.guardar_storage();
    this.router.navigate(['login']);
  }

}
