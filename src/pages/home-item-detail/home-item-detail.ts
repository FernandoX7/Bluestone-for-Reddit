import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home-item-detail',
  templateUrl: 'home-item-detail.html'
})

export class HomeItemDetail {

  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('feedItem');
    console.log('Successfully got: ', this.selectedItem);

  }
  
}
