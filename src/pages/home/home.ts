import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  NavController, ModalController, NavParams, PopoverController, AlertController,
  LoadingController
} from 'ionic-angular';
import {FeedService} from "./feed-service";
import {HomeItemDetail} from "../home-item-detail/home-item-detail";
import {ThumbnailImage} from "../popups/thumbnail-image";
import {SortFeedPopover} from "./sort-feed-popover";
import {SubredditSearch} from "../subreddit-search/subreddit-search";
import {UserSearch} from "../user-search/user-search";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FeedService]
})
export class Home implements OnInit {

  feed: any;
  typeOfPage: string;
  subTypeOfPage: any;

  constructor(public navCtrl: NavController, private data: FeedService, public modalCtrl: ModalController, private navParams: NavParams, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    // Determine type of news feed to show
    this.typeOfPage = this.navParams.get('typeOfPage');
    this.subTypeOfPage = 'Hot'; // Front page
    if (this.typeOfPage === undefined) {
      this.typeOfPage = 'Front page';
    } else if (this.typeOfPage === null) {
      this.typeOfPage = 'Front page';
    }
    this.data
      .getFeed(this.typeOfPage)
      .subscribe(
        data => {
          loader.dismissAll();
          data = data.data.children;
          this.feed = data;

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

                while (maximumResolution > 0) {
                  if (typeof selectedItemsResolutions[maximumResolution] === 'undefined') {
                    maximumResolution--;
                  } else {
                    // Make the url actually point to the image and add it as a property to the object
                    var thumbnailImageUrl = selectedItemsResolutions[maximumResolution].url;
                    thumbnailImageUrl = _.replace(thumbnailImageUrl, new RegExp('&amp;', 'g'), '&');
                    data[i].data['gifImage'] = thumbnailImageUrl;
                    break;
                  }
                }

              }

              // Reset variable back to normal images not gifs
              selectedItemsResolutions = data[i].data.preview.images[0].resolutions;

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

  openImage(feedItem) {
    let thumbnailPopup: any;
    // Check if its a gif
    if (feedItem.data.hasOwnProperty('gifImage')) {
      thumbnailPopup = this.modalCtrl.create(ThumbnailImage, {
        image: feedItem.data.gifImage
      });
    } else {
      thumbnailPopup = this.modalCtrl.create(ThumbnailImage, {
        image: feedItem.data.thumbnailImage
      });
    }
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

  // Update news feed based on new sub type
  loadSubType(subType) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    this.data
      .getSubTypeFeed(this.typeOfPage, subType)
      .subscribe(
        data => {
          loader.dismissAll();
          data = data.data.children;
          this.feed = data;

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

                while (maximumResolution > 0) {
                  if (typeof selectedItemsResolutions[maximumResolution] === 'undefined') {
                    maximumResolution--;
                  } else {
                    // Make the url actually point to the image and add it as a property to the object
                    var thumbnailImageUrl = selectedItemsResolutions[maximumResolution].url;
                    thumbnailImageUrl = _.replace(thumbnailImageUrl, new RegExp('&amp;', 'g'), '&');
                    data[i].data['gifImage'] = thumbnailImageUrl;
                    break;
                  }
                }

              }

              // Reset variable back to normal images not gifs
              selectedItemsResolutions = data[i].data.preview.images[0].resolutions;

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
            this.navCtrl.push(UserSearch, {
              searchValue: data.title
            });
          }
        },
        {
          text: 'Subreddit',
          handler: data => {
            this.navCtrl.push(SubredditSearch, {
              searchValue: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }

  openSortingPopover(myEvent) {
    let popover = this.popoverCtrl.create(SortFeedPopover, {
      typeOfPage: this.typeOfPage,
      subCategory: this.subTypeOfPage
    });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {

      if (data) {
        this.subTypeOfPage = data.newSubTypeOfPage;
        this.loadSubType(data.newSubTypeOfPage);
      }

    });

  }

}
