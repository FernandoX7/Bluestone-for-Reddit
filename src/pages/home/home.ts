import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  NavController, ModalController, NavParams, PopoverController, AlertController,
  LoadingController, Content
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

  @ViewChild(Content) content: Content;

  feed: any;
  typeOfPage: string;
  subTypeOfPage: any;
  loader: any;
  nextPageCode: string;

  constructor(private navCtrl: NavController,
              private data: FeedService,
              private modalCtrl: ModalController,
              private navParams: NavParams,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.showLoadingPopup('Please wait...');
    this.determineNewsFeedToShow();
    // Get news feed
    this.data
      .getFeed(this.typeOfPage)
      .subscribe(
        data => {
          this.loadFeed(data, false);
          this.nextPageCode = data.data.after;
          data = data.data.children;
        },
        err => console.error('There was an error loading the home page news feed', err),
        () => console.log('Successfully loaded the home page news feed')
      );
  }

  // Update news feed based on new sub type
  loadSubType(subType) {
    this.showLoadingPopup('Please wait...');
    this.content.scrollToTop();
    this.data
      .getSubTypeFeed(this.typeOfPage, subType)
      .subscribe(
        data => {
          this.nextPageCode = data.data.after;
          this.loadFeed(data, false);
          data = data.data.children;
        },
        err => console.error('There was an error loading the home page news feed (subType)', err),
        () => console.log('Successfully loaded the home page news feed (subType)')
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
              this.navCtrl.push(UserSearch, {
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
              this.navCtrl.push(SubredditSearch, {
                searchValue: data.title
              });
            }
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

  /**
   * Handles loading the news feed
   * @param data - JSON data returned from the service
   * @param isLoadingMoreData - Used for when scrolling down and loading data
   */
  loadFeed(data, isLoadingMoreData: boolean) {
    // Feed loaded - dismiss loading popup
    this.loader.dismissAll();

    data = data.data.children;
    if(!isLoadingMoreData) {
      this.feed = data;
    }

    // Add higher quality thumbnails
    for (var i = 0; i < data.length; i++) {

      // Add the next page of data to the feed
      if(isLoadingMoreData) {
        this.feed.push(data[i]);
      }

      // Get hours posted ago
      this.feed[i].data['hoursAgo'] = this.getHoursAgo(this.feed[i].data.created_utc);

      // If there's no .preview property - it's an all text post
      if (typeof data[i].data.preview !== 'undefined') {
        // Iterate through the resolutions array to find the highest resolution for that picture
        let maximumResolution = 10;
        let selectedItemsResolutions = data[i].data.preview.images[0].resolutions;

        // Check if it's a gif
        if (typeof data[i].data.preview.images[0].variants.gif !== 'undefined') {
          selectedItemsResolutions = data[i].data.preview.images[0].variants.gif.resolutions;

          while (maximumResolution > 0) {
            if (typeof selectedItemsResolutions[maximumResolution] === 'undefined') {
              maximumResolution--;
            } else {
              // Make the url actually point to the image and add it as a property to the object
              let thumbnailImageUrl = selectedItemsResolutions[maximumResolution].url;
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
            let thumbnailImageUrl = selectedItemsResolutions[maximumResolution].url;
            thumbnailImageUrl = _.replace(thumbnailImageUrl, new RegExp('&amp;', 'g'), '&');
            data[i].data['thumbnailImage'] = thumbnailImageUrl;
            break;
          }
        }
      }
    }

  }

  showLoadingPopup(message) {
    this.loader = this.loadingCtrl.create({
      content: message,
      duration: 3000
    });
    this.loader.present();
  }

  determineNewsFeedToShow() {
    this.typeOfPage = this.navParams.get('typeOfPage');
    this.subTypeOfPage = 'Hot'; // Front page
    if (this.typeOfPage === undefined) {
      this.typeOfPage = 'Front page';
    } else if (this.typeOfPage === null) {
      this.typeOfPage = 'Front page';
    }
  }

  loadMoreData(infiniteScroll) {
    console.log('Begin loading more data async', this.subTypeOfPage);

    if (this.subTypeOfPage !== 'Hot') {
      setTimeout(() => {
        this.data
          .getMoreSubTypeFeed(this.typeOfPage, this.subTypeOfPage, this.nextPageCode)
          .subscribe(
            data => {
              this.loadFeed(data, true);
              this.nextPageCode = data.data.after;
            },
            err => console.error('There was an error loading the home page news feed for subtype ', this.subTypeOfPage, err),
            () => console.log('Successfully loaded the home page news feed')
          );
        infiniteScroll.complete();
      }, 500);
    } else {
      setTimeout(() => {
        this.data
          .getMoreFeed(this.typeOfPage, this.nextPageCode)
          .subscribe(
            data => {
              this.loadFeed(data, true);
              this.nextPageCode = data.data.after;
            },
            err => console.error('There was an error loading the home page news feed for subtype ', this.subTypeOfPage, err),
            () => console.log('Successfully loaded the home page news feed')
          );
        infiniteScroll.complete();
      }, 500);
    }

  }

}
