import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {NavController} from 'ionic-angular';
import {FeedService} from "./feed-service";
import {HomeItemDetail} from "../home-item-detail/home-item-detail";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FeedService]
})
export class Home implements OnInit {

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

          // Add higher quality thumbnails
          for (var i = 0; i < data.length; i++) {
            // If there's no .preview property - it's an all text post
            if (typeof data[i].data.preview !== 'undefined') {
              // Iterate through the resolutions array to find the highest resolution for that picture
              var maximumResolution = 10;
              var selectedItemsResolutions = data[i].data.preview.images[0].resolutions;

              // Check if it's a gif
              if (typeof data[i].data.preview.images[0].variants.gif !== 'undefined') {
                var selectedItemsResolutionsGifs = data[i].data.preview.images[0].variants.gif.resolutions;
                selectedItemsResolutions = selectedItemsResolutionsGifs;
              }

              while (maximumResolution > 0) {
                if (typeof selectedItemsResolutions[maximumResolution] === 'undefined') {
                  maximumResolution--;
                } else {
                  // Make the url actually point to the image and add it as a property to the object
                  var thumbnailImageUrl = selectedItemsResolutions[maximumResolution].url;
                  thumbnailImageUrl = _.replace(thumbnailImageUrl, new RegExp('&amp;', 'g'), '&');
                  data[i].data['thumbnailImage'] = thumbnailImageUrl;
                  break;
                }
              }
            }
          }
          
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
