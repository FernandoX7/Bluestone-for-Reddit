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
import {RedditService} from "../../services/reddit-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FeedService]
})

export class Home implements OnInit {
  @ViewChild(Content) content: Content;

  posts: any;
  typeOfPage: string;
  subTypeOfPage: any;
  loader: any;
  amountOfMoreData = 0;

  constructor(private navCtrl: NavController,
              private data: FeedService,
              private modalCtrl: ModalController,
              private navParams: NavParams,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private reddit: RedditService) {
  }

  ngOnInit() {
    this.showLoadingPopup('Please wait...');
    this.determineNewsFeedToShow();
    this.getFeed();
  }

  getFeed() {
    this.reddit.getHotPosts().then((posts) => {
      this.loadFeed(posts, false);
    }).catch(err => {
      console.log('Error getting hot posts', err);
      this.reddit.getHotPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  // Update news feed based on new sub type
  loadSubType(subType) {
    this.showLoadingPopup('Please wait...');
    this.content.scrollToTop();
    this.data
      .getSubTypeFeed(this.typeOfPage, subType)
      .subscribe(
        data => {
          // this.nextPageCode = data.data.after;
          this.loadFeed(data, false);
          data = data.data.children;
        },
        err => console.error('There was an error loading the home page news feed (subType)', err),
        () => console.log('Successfully loaded the home page news feed (subType)')
      );
  }

  goToItemDetail(post) {
    this.navCtrl.push(HomeItemDetail, {
      feedPost: post
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
   * @param posts - Returned from the service
   * @param isLoadingMoreData - Used for when scrolling down and loading data
   */
  loadFeed(posts, isLoadingMoreData: boolean) {
    this.loader.dismissAll();

    if (isLoadingMoreData) {
      this.posts = this.posts.concat(posts);
    } else {
      this.posts = posts;
    }

    this.addHigherQualityThumbnails();
  }

  addHigherQualityThumbnails() {
    _.forEach(this.posts, (post) => {
      // Set hours posted ago
      post['hoursAgo'] = this.getHoursAgo(post.created_utc);

      // If there's no preview property - it's an all text post
      if (post.hasOwnProperty('preview')) {
        // Iterate through the resolutions array to find the highest resolution for that picture
        let maximumResolution = 10;
        let allImageResolutions = post.preview.images[0].resolutions;

        // Check if it's a gif
        if (post.url.substr(post.url.length - 4) === 'gifv') {
          if (post.preview.images[0].variants.gif) {
            allImageResolutions = post.preview.images[0].variants.gif.resolutions;
          } else {
            allImageResolutions = {
              noResolutions: true,
              url: post.url
            }
          }

          if (allImageResolutions.noResolutions !== true) {
            while (maximumResolution > 0) {
              if (_.isNil(allImageResolutions[maximumResolution])) {
                maximumResolution--; // GET OUT OF LOOP! :O
              } else {
                // Make the url actually point to an image and add it as a property to the object
                let thumbnailImageUrl = allImageResolutions[maximumResolution].url;
                thumbnailImageUrl = _.replace(thumbnailImageUrl, new RegExp('&amp;', 'g'), '&'); // Replace & with &amp;
                post['gifImage'] = thumbnailImageUrl;
                break;
              }
            }
          }
        }

        // Reset variable back to normal images and not gifs
        allImageResolutions = post.preview.images[0].resolutions;

        while (maximumResolution > 0) {
          if (_.isNil(allImageResolutions[maximumResolution])) {
            maximumResolution--;
          } else {
            // Make the url actually point to the image and add it as a property to the object
            let thumbnailImageUrl = allImageResolutions[maximumResolution].url;
            thumbnailImageUrl = _.replace(thumbnailImageUrl, new RegExp('&amp;', 'g'), '&');
            post['thumbnailImage'] = thumbnailImageUrl;
            break;
          }
        }
      }
    });
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
    this.amountOfMoreData = this.amountOfMoreData + 25;

    if (this.subTypeOfPage === 'Hot') {
      setTimeout(() => {
        this.reddit.getHotPosts(undefined, this.amountOfMoreData).then((posts) => {
          this.loadFeed(posts, true);
          infiniteScroll.complete();
        }).catch(err => {
          console.log('Error getting more hot posts', err);
          this.reddit.getHotPosts().then(posts => {
            this.posts = posts
          });
        });
      }, 500);
    } else {
      // TODO: Handle other sub types of page
    }
  }

  truncateTitle(post) {
    let title = '';
    if (post.thumbnail !== 'default' && post.thumbnail !== 'self') {
      title = post.title.substring(0, 35);
    } else {
      if (post.link_flair_text) {
        title = post.title.substring(0, 60);
      } else {
        title = post.title.substring(0, 70);
      }
    }

    if (title.length >= 35) {
      return title + '...';
    } else {
      return title;
    }
  }

  hasLinkFlair(linkFlair) {
    return !_.isNil(linkFlair) && linkFlair !== ''
  }

  // Adds K to a number if greaters then 999 - Ex: 4.5K
  formatToThousand(votes) {
    return votes > 999 ? (votes / 1000).toFixed(1) + 'K' : votes;
  }

  postIsGilded(gildedAmount) {
    return gildedAmount > 0;
  }

  hasThumbnail(post) {
    return post.thumbnailImage;
  }
}
