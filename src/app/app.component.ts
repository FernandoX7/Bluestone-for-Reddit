import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';
import { HomeItemDetail } from '../pages/home-item-detail/home-item-detail';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;

  pages: Array<{title: string, component: any, icon: string}>;
  subscriptions: Array<{title: string}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Home, icon: 'home' },
      { title: 'Front page', component: Home, icon: 'trending-up' },
      { title: 'All', component: Home, icon: 'podium' },
      // New Line
      { title: 'Search', component: Home, icon: 'search' },
      { title: 'Settings', component: Home, icon: 'settings' },
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
    this.nav.setRoot(page.component);
  }
}
