import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {GetSubredditService} from "./get-subreddit-service";
import * as _ from 'lodash';
import * as moment from 'moment';
import {HomeItemDetail} from "../home-item-detail/home-item-detail";
import {ThumbnailImage} from "../popups/thumbnail-image";

@Component({
  selector: 'page-subreddit-search',
  templateUrl: 'subreddit-search.html',
  providers: [GetSubredditService]
})

export class SubredditSearch implements OnInit {

  passedSubredditName: string;
  feed: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: GetSubredditService, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
    this.passedSubredditName = navParams.get('searchValue');
  }

  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    this.data
      .getSubreddit(this.passedSubredditName)
      .subscribe(
        data => {
          loader.dismissAll();
          data = data.data.children;
          this.feed = data;
          console.log(this.passedSubredditName, 'data:', data);

          // Add higher quality thumbnails
          for (var i = 0; i < data.length; i++) {

            // Get hours posted ago
            this.feed[i].data['hoursAgo'] = this.getHoursAgo(this.feed[i].data.created_utc);

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

        },
        err => console.error('There was an error getting the searched subreddit', err),
        () => console.log('Successfully got the searched subreddit')
      );

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

  private getHoursAgo(created_utc: any) {
    var currentTime = moment();
    var createdAt = moment.unix(created_utc);
    var hoursAgo = currentTime.diff(createdAt, 'hours');
    if (hoursAgo <= 23) {
      return hoursAgo + 'h';
    } else if (hoursAgo >= 24 && hoursAgo <= 8759) {
      var daysAgo = currentTime.diff(createdAt, 'days');
      return daysAgo + 'd';
    } else if (hoursAgo >= 8760) {
      var yearsAgo = currentTime.diff(createdAt, 'years');
      return yearsAgo + 'y';
    }
  }

}
