import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, AlertController} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';
import {SubredditSearch} from "../pages/subreddit-search/subreddit-search";
import {UserSearch} from "../pages/user-search/user-search";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;

  pages: Array<{title: string, component: any, icon: string, typeOfPage: string}>;
  subscriptions: Array<{title: string}>;

  constructor(public platform: Platform, public alertCtrl: AlertController) {
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

  showSearchPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Search',
      cssClass: 'alert-dialog',
      inputs: [
        {
          name: 'title',
          placeholder: 'Subreddit or User'
        },
      ],
      buttons: [
        {
          text: 'User',
          handler: data => {
            data.title = data.title.trim();
            if (data.title !== '') {
              this.nav.push(UserSearch, {
                searchValue: data.title
              });
            }
          }
        },
        {
          text: 'Subreddit',
          handler: data => {
            data.title = data.title.trim();
            if (data.title !== '') {
              this.nav.push(SubredditSearch, {
                searchValue: data.title
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }

  openPage(page) {
    if (page.title === 'Search') {
      this.showSearchPrompt();
    } else {
      this.nav.setRoot(page.component, {
        typeOfPage: page.typeOfPage
      });
    }
  }
}
