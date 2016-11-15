import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ModalController, PopoverController} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import {GetUserService} from "./get-user-service";
import {ThumbnailImage} from "../popups/thumbnail-image";
import {HomeItemDetail} from "../home-item-detail/home-item-detail";
import {SortUserFeedPopover} from "./sort-user-feed-popover";

@Component({
  selector: 'page-user-search',
  templateUrl: 'user-search.html',
  providers: [GetUserService]
})

export class UserSearch implements OnInit {

  passedUserName: string;
  feed: any;
  typeOfPage: string;
  subTypeOfPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: GetUserService, public modalCtrl: ModalController, public popoverCtrl: PopoverController) {
    this.passedUserName = navParams.get('searchValue');
  }

  ngOnInit() {
    // Determine type of news feed to show
    this.typeOfPage = this.navParams.get('typeOfPage');
    this.subTypeOfPage = 'Overview'; // Default
    this.data
      .getUser(this.passedUserName)
      .subscribe(
        data => {
          data = data.data.children;
          this.feed = data;
          console.log(this.passedUserName, 'data:', data);

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
        err => console.error('There was an error getting the searched user', err),
        () => console.log('Successfully got the searched user')
      );

  }

  // Update news feed based on new sub type
  loadSubType(subType) {
    this.data
      .getUserSorted(this.passedUserName, subType)
      .subscribe(
        data => {
          data = data.data.children;
          this.feed = data;
          console.log(this.passedUserName, 'data:', data);

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
        err => console.error('There was an error getting the searched user', err),
        () => console.log('Successfully got the searched user')
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

  openSortingPopover(myEvent) {
    let popover = this.popoverCtrl.create(SortUserFeedPopover, {
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
