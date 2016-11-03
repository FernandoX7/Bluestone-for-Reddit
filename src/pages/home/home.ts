import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {NavController, ModalController, Thumbnail} from 'ionic-angular';
import {FeedService} from "./feed-service";
import {HomeItemDetail} from "../home-item-detail/home-item-detail";
import {ThumbnailImage} from "../popups/thumbnail-image";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FeedService]
})
export class Home implements OnInit {

  feed: any;
  randomPlaceholder: string;

  constructor(public navCtrl: NavController, private data: FeedService, public modalCtrl: ModalController) {

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
    
    this.getPlaceholder();

  }

  goToItemDetail(item) {
    this.navCtrl.push(HomeItemDetail, {
      feedItem: item
    });
  }

  openImage(feedItem) {
    let thumbnailPopup = this.modalCtrl.create(ThumbnailImage, {
      image: feedItem.data.thumbnailImage
    });
    thumbnailPopup.present();
  }

  getItems(event: any) {
    // set val to the value of the searchbar
    let searchValue = event.target.value;
    console.log(searchValue);
  }

  getPlaceholder() {
    var searches = ['camaro', 'AskReddit', 'politics', 'android', 'iOS',
      'pics', 'funny', 'nfl', 'gaming', 'WTF', 'movies'];
    this.randomPlaceholder = searches[Math.floor(Math.random() * searches.length)];
  }

  clearItems() {
    this.getPlaceholder();
  }

}
