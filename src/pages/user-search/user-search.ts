import {Component, OnInit} from '@angular/core';
import {
  NavController, NavParams, ModalController, PopoverController, LoadingController,
  ToastController
} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import {GetUserService} from "./get-user-service";
import {ThumbnailImage} from "../popups/thumbnail-image";
import {HomeItemDetail} from "../home-item-detail/home-item-detail";
import {SortUserFeedPopover} from "./sort-user-feed-popover";
import {RedditService} from "../../services/reddit-service";

@Component({
  selector: 'page-user-search',
  templateUrl: 'user-search.html',
  providers: [GetUserService]
})

export class UserSearch implements OnInit {

  username: string;
  feed: any;
  typeOfPage: string;
  subTypeOfPage: any;
  loader: any;
  user = {};
  posts: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private data: GetUserService,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public reddit: RedditService) {

    this.username = navParams.get('username');
  }

  ngOnInit() {
    this.showLoadingPopup('Please wait...');
    this.determineNewsFeedToShow();
    this.setupUser().then(user => {
      console.log('user', user);
      this.posts = user['overview'];
    })
  }

  setupUser() {
    return new Promise((resolve, reject) => {
      this.reddit.getUserInfo(this.username).then((userInfo) => {
        this.user = {
          id: userInfo['id'],
          commentKarma: userInfo['comment_karma'],
          createdUTC: userInfo['created_utc'],
          postKarma: userInfo['link_karma'],
          name: userInfo['name']
        };

        this.reddit.getUserSubmittedPosts(this.username).then((submittedPosts) => {
          this.user['submittedPosts'] = submittedPosts;

          this.reddit.getUserComments(this.username).then((comments) => {
            this.user['comments'] = comments;

            this.reddit.getUserOverview(this.username).then((overviewData) => {
              // Save if it's a user submitted post or a comment
              _.forEach(overviewData, (item) => {
                item['contentType'] = item.constructor.name;
              });

              this.user['overview'] = overviewData;

              resolve(this.user);
            }).catch(err => {
              console.log('Error getting the users comments', err);
              reject(err);
            });

          }).catch(err => {
            console.log('Error getting the users comments', err);
            reject(err);
          });

        }).catch(err => {
          console.log('Error getting the users submitted posts', err);
          reject(err);
        });

      }).catch(err => {
        console.log('Error getting users info', err);
        reject(err);
      });
    });
  }

  // Update news feed based on new sub type
  loadSubType(subType) {
    this.showLoadingPopup('Please wait...');
    console.log('subType', subType);
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

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
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
    this.subTypeOfPage = 'Overview'; // Default
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

  truncateCommentTitle(title) {
    if (title.length >= 140) {
      return title.substring(0, 140) + '...';
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

  isUserSubmittedPost(contentType) {
    return contentType === 'Submission';
  }

  isUserComment(contentType) {
    return contentType === 'Comment';
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
