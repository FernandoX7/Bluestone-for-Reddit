import {Component, OnInit} from '@angular/core';

import { NavController } from 'ionic-angular';
import {FeedService} from "./feed-service";
import {HomeItemDetail} from "../home-item-detail/home-item-detail";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FeedService]
})
export class Home implements OnInit{

  feed: any;

  constructor(public navCtrl: NavController, private data: FeedService) {

  }

  ngOnInit() {
    this.data
      .getFeed()
      .subscribe(
        data => {
          data = data.data.children;
          this.feed = data;
          console.log('Feed data', data);
        },
        err => console.error('There was an error getting the news feed', err),
        () => console.log('Successfully got the news feed')
      );
  }

  goToItemDetail(item) {
    this.navCtrl.push(HomeItemDetail, {
      feedItem: item
    });
  }

}
