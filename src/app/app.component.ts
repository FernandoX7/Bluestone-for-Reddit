import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;

  pages: Array<{title: string, component: any, icon: string, typeOfPage: string}>;
  subscriptions: Array<{title: string}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Home, icon: 'home', typeOfPage: 'Front page' },
      { title: 'Front page', component: Home, icon: 'trending-up', typeOfPage: 'Front page' },
      { title: 'All', component: Home, icon: 'podium', typeOfPage: 'All' },
      // New Line
      { title: 'Search', component: Home, icon: 'search', typeOfPage: null },
      { title: 'Settings', component: Home, icon: 'settings', typeOfPage: null },
    ];

    this.subscriptions = [
      { title: 'Android' },
      { title: 'Camaro' },
      { title: 'iOS' },
      { title: 'Mustang' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {
      typeOfPage: page.typeOfPage
    });
  }
}
