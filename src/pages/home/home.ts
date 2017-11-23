import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  NavController, ModalController, NavParams, PopoverController, AlertController,
  LoadingController, Content
} from 'ionic-angular';
import {HomeItemDetail} from "../home-item-detail/home-item-detail";
import {ThumbnailImage} from "../popups/thumbnail-image";
import {SortFeedPopover} from "./sort-feed-popover";
import {SubredditSearch} from "../subreddit-search/subreddit-search";
import {UserSearch} from "../user-search/user-search";
import {RedditService} from "../../services/reddit-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})

export class Home implements OnInit {
  @ViewChild(Content) content: Content;

  posts: any;
  typeOfPage: string; // Front or All
  subTypeOfPage: any; // hot, new, rising, etc
  loader: any;
  amountOfMoreData = 0;

  constructor(private navCtrl: NavController,
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
    this.getHotPosts();
  }

  getHotPosts() {
    let subreddit = this.typeOfPage === 'All' ? 'all' : '';
    this.reddit.getHotPosts(subreddit).then((posts) => {
      this.loadFeed(posts, false);
    }).catch(err => {
      console.log('Error getting hot posts', err);
      this.reddit.getHotPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getMoreHotPosts(infiniteScroll) {
    let subreddit = this.typeOfPage === 'All' ? 'all' : undefined;
    this.reddit.getHotPosts(subreddit, this.amountOfMoreData).then((posts) => {
      this.loadFeed(posts, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more hot posts', err);
      this.reddit.getHotPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getNewPosts() {
    let subreddit = this.typeOfPage === 'All' ? 'all' : '';
    this.reddit.getNewPosts(subreddit).then((posts) => {
      this.loadFeed(posts, false);
    }).catch(err => {
      console.log('Error getting new posts', err);
      this.reddit.getNewPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getMoreNewPosts(infiniteScroll) {
    let subreddit = this.typeOfPage === 'All' ? 'all' : undefined;
    this.reddit.getNewPosts(subreddit, this.amountOfMoreData).then((posts) => {
      this.loadFeed(posts, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more new posts', err);
      this.reddit.getNewPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getRisingPosts() {
    let subreddit = this.typeOfPage === 'All' ? 'all' : '';
    this.reddit.getRisingPosts(subreddit).then((posts) => {
      this.loadFeed(posts, false);
    }).catch(err => {
      console.log('Error getting rising posts', err);
      this.reddit.getRisingPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getMoreRisingPosts(infiniteScroll) {
    let subreddit = this.typeOfPage === 'All' ? 'all' : undefined;
    this.reddit.getRisingPosts(subreddit, this.amountOfMoreData).then((posts) => {
      this.loadFeed(posts, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more rising posts', err);
      this.reddit.getRisingPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getControversialPosts() {
    let subreddit = this.typeOfPage === 'All' ? 'all' : '';
    this.reddit.getControversialPosts(subreddit).then((posts) => {
      this.loadFeed(posts, false);
    }).catch(err => {
      console.log('Error getting controversial posts', err);
      this.reddit.getControversialPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getMoreControversialPosts(infiniteScroll) {
    let subreddit = this.typeOfPage === 'All' ? 'all' : undefined;
    this.reddit.getControversialPosts(subreddit, this.amountOfMoreData).then((posts) => {
      this.loadFeed(posts, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more controversial posts', err);
      this.reddit.getControversialPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getTopPosts() {
    let subreddit = this.typeOfPage === 'All' ? 'all' : '';
    this.reddit.getTopPosts(subreddit).then((posts) => {
      this.loadFeed(posts, false);
    }).catch(err => {
      console.log('Error getting top posts', err);
      this.reddit.getTopPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  getMoreTopPosts(infiniteScroll) {
    let subreddit = this.typeOfPage === 'All' ? 'all' : undefined;
    this.reddit.getTopPosts(subreddit, this.amountOfMoreData).then((posts) => {
      this.loadFeed(posts, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more top posts', err);
      this.reddit.getTopPosts().then(posts => {
        this.posts = posts
      });
    });
  }

  // Update news feed based on new sub type
  loadSubType(subType) {
    this.showLoadingPopup('Please wait...');
    this.content.scrollToTop();

    switch (subType) {
      case 'Hot':
        this.getHotPosts();
        break;
      case 'New':
        this.getNewPosts();
        break;
      case 'Rising':
        this.getRisingPosts();
        break;
      case 'Controversial':
        this.getControversialPosts();
        break;
      case 'Top':
        this.getTopPosts();
        break;
    }
  }

  goToItemDetail(post) {
    this.navCtrl.push(HomeItemDetail, {
      feedPost: post
    });
  }

  openImage(post) {
    let thumbnailPopup: any;
    // Check if its a gif
    if (post.hasOwnProperty('gifImage')) {
      thumbnailPopup = this.modalCtrl.create(ThumbnailImage, {
        image: post.gifImage
      });
    } else {
      thumbnailPopup = this.modalCtrl.create(ThumbnailImage, {
        image: post.thumbnailImage
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

      // Decode HTML
      post['selftext_html_parsed'] = this.decodeHtml(post.selftext_html);
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

    if (_.isNil(this.typeOfPage)) {
      this.typeOfPage = 'Front page';
    }
  }

  loadMoreData(infiniteScroll) {
    this.amountOfMoreData = this.amountOfMoreData + 25;

    switch (this.subTypeOfPage) {
      case 'Hot':
        setTimeout(() => {
         this.getMoreHotPosts(infiniteScroll);
        }, 500);
        break;
      case 'New':
        setTimeout(() => {
          this.getMoreNewPosts(infiniteScroll);
        }, 500);
        break;
      case 'Rising':
        this.getMoreRisingPosts(infiniteScroll);
        break;
      case 'Controversial':
        this.getMoreControversialPosts(infiniteScroll);
        break;
      case 'Top':
        this.getMoreTopPosts(infiniteScroll);
        break;
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

  decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
}
