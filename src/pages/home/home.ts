import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {NavController, ModalController, NavParams, PopoverController} from 'ionic-angular';
import {FeedService} from "./feed-service";
import {HomeItemDetail} from "../home-item-detail/home-item-detail";
import {ThumbnailImage} from "../popups/thumbnail-image";
import {SubredditSearch} from "../subreddit-search/subreddit-search";
import {SortFeedPopover} from "./sort-feed-popover";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FeedService]
})
export class Home implements OnInit {

  feed: any;
  randomPlaceholder: string;
  typeOfPage: string;
  subTypeOfPage: any;

  constructor(public navCtrl: NavController, private data: FeedService, public modalCtrl: ModalController, private navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ngOnInit() {
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
    this.navCtrl.push(SubredditSearch, {
      searchValue: searchValue
    });
  }

  getPlaceholder() {
    var searches = ['camaro', 'AskReddit', 'politics', 'android', 'iOS',
      'pics', 'funny', 'nfl', 'gaming', 'WTF', 'movies'];
    this.randomPlaceholder = searches[Math.floor(Math.random() * searches.length)];
  }

  clearItems() {
    this.getPlaceholder();
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

  openSortingPopover(myEvent) {
    let popover = this.popoverCtrl.create(SortFeedPopover, {
      typeOfPage: this.typeOfPage
    });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
      console.log("popover dismissed");
      console.log("Selected Item is " + data);


      //TODO: If a user clicks the popup and then closes out of it by clicking outsie the subtype gets set to null. Make it store the current one so that when it closes it keeps it
        this.subTypeOfPage = data;

    });

  }

}
