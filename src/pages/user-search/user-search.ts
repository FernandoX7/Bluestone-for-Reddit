import {Component, OnInit, ViewChild} from '@angular/core';
import {
  NavController, NavParams, ModalController, PopoverController, LoadingController,
  ToastController, Content
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
  @ViewChild(Content) content: Content;

  username: string;
  subTypeOfPage: any;
  loader: any;
  user = {};
  posts: any;
  amountOfMoreData = 0;

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
    this.subTypeOfPage = 'Overview'; // Default
    this.setupUser().then(user => {
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
              this.addContentType(overviewData).then(posts => {
                overviewData = posts;
                this.user['overview'] = overviewData;

                resolve(this.user);
              });
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

  addContentType(posts) {
    return new Promise(resolve => {
      _.forEach(posts, (post) => {
        post['contentType'] = post.constructor.name;
      });
      resolve(posts);
    });
  }

  // Update news feed based on new sub type
  loadSubType(subType) {
    this.showLoadingPopup('Please wait...');
    this.content.scrollToTop();

    switch (subType) {
      case 'Overview':
        this.getOverviewPosts(this.user['name']);
        break;
      case 'Comments':
        this.getCommentPosts(this.user['name']);
        break;
      case 'Submitted':
        this.getSubmittedPosts(this.user['name']);
        break;
      case 'Gilded':
        this.getGildedPosts(this.user['name']);
        break;
    }
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

  isUserSubmittedPost(contentType) {
    return contentType === 'Submission';
  }

  isUserComment(contentType) {
    return contentType === 'Comment';
  }

  getHoursAgo(created_utc: any) {
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

  loadMoreData(infiniteScroll) {
    this.amountOfMoreData = this.amountOfMoreData + 25;

    switch (this.subTypeOfPage) {
      case 'Overview':
        setTimeout(() => {
          this.getMoreOverviewPosts(infiniteScroll, this.username);
        }, 500);
        break;
      case 'Comments':
        setTimeout(() => {
          this.getMoreCommentPosts(infiniteScroll, this.username);
        }, 500);
        break;
      case 'Submitted':
        setTimeout(() => {
          this.getMoreSubmittedPosts(infiniteScroll, this.username);
        }, 500);
        break;
      case 'Gilded':
        setTimeout(() => {
          this.getMoreGildedPosts(infiniteScroll, this.username);
        }, 500);
        break;
    }
  }

  loadFeed(posts, isLoadingMoreData: boolean) {
    this.loader.dismissAll();

    this.addContentType(posts).then(newPosts => {
      if (isLoadingMoreData) {
        this.posts = this.posts.concat(newPosts);
      } else {
        this.posts = newPosts;
      }

      this.addHigherQualityThumbnails(newPosts);
    });
  }

  addHigherQualityThumbnails(posts?) {
    if (_.isNil(posts)) {
      posts = this.posts;
    }

    _.forEach(posts, (post) => {
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

  decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  getOverviewPosts(user) {
    this.reddit.getUserOverview(user).then((overview) => {
      this.loadFeed(overview, false);
    }).catch(err => {
      console.log('Error getting user overview', err);
    });
  }

  getMoreOverviewPosts(infiniteScroll, user) {
    this.reddit.getUserOverview(user, this.amountOfMoreData).then((posts) => {
      this.loadFeed(posts, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more overview posts', err);
    });
  }

  getCommentPosts(user) {
    this.reddit.getUserComments(user).then((comments) => {
      this.loadFeed(comments, false);
    }).catch(err => {
      console.log('Error getting user comments', err);
    });
  }

  getMoreCommentPosts(infiniteScroll, user) {
    this.reddit.getUserComments(user, this.amountOfMoreData).then((comments) => {
      this.loadFeed(comments, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more comments', err);
    });
  }

  getSubmittedPosts(user) {
    this.reddit.getUserSubmittedPosts(user).then((submittedPosts) => {
      this.loadFeed(submittedPosts, false);
    }).catch(err => {
      console.log('Error getting user submitted posts', err);
    });
  }

  getMoreSubmittedPosts(infiniteScroll, user) {
    this.reddit.getUserSubmittedPosts(user, this.amountOfMoreData).then((submittedPosts) => {
      this.loadFeed(submittedPosts, true);
      infiniteScroll.complete();
    }).catch(err => {
      console.log('Error getting more user submitted posts', err);
    });
  }

  getGildedPosts(user) {

  }

  getMoreGildedPosts(infiniteScroll, user) {
    // TODO:
  }

}
