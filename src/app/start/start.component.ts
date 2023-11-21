import { Component } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  host: { class: 'full-screen-component' }
})
export class StartComponent {
  ufoSrc = "../assets/imgs/ufo.png";
  logoSrc = "../assets/imgs/logo-upm.png"
}
