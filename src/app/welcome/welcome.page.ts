import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  iralLogin() {
    this.navCtrl.navigateForward('/login'); // Navega a la página de login
  }

}
