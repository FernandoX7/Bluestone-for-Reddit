/**
 * Created by fernando on 11/22/17.
 */
import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Constants} from "../pages/util/Constants";
import * as _ from 'lodash';

/**
 * Service for all sorts of reddit things 🤠
 */

@Injectable()
export class RedditService implements OnInit {

  snoowrap = require('snoowrap');
  reddit = new this.snoowrap(this.constants.AUTH_INFO);
  http: any;

  constructor(http: HttpClient, private constants: Constants) {
    this.http = http;
  }

  ngOnInit() {
  }

  getPostsBoilerPlateCode(submissions, fetchMoreAmount, resolve) {
    let posts = [];

    _.forEach(submissions, (submission) => {
      posts.push(submission);
    });

    if (fetchMoreAmount > 0) {
      let newPosts = [];
      submissions.fetchMore({amount: fetchMoreAmount, append: false}).then(extendedPosts => {
        _.forEach(extendedPosts, (extendedPost) => {
          newPosts.push(extendedPost);
        });
        resolve(newPosts.slice(-25));
      });
    } else {
      resolve(posts);
    }
  }

  getHotPosts(subreddit?, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getHot(subreddit).then((submissions) => {
        this.getPostsBoilerPlateCode(submissions, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  getNewPosts(subreddit?, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getNew(subreddit).then((submissions) => {
        this.getPostsBoilerPlateCode(submissions, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  getRisingPosts(subreddit?, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getRising(subreddit).then((submissions) => {
        this.getPostsBoilerPlateCode(submissions, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  getControversialPosts(subreddit?, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getControversial(subreddit).then((submissions) => {
        this.getPostsBoilerPlateCode(submissions, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  getTopPosts(subreddit?, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getTop(subreddit).then((submissions) => {
        this.getPostsBoilerPlateCode(submissions, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  getUserOverview(user, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getOverview().then((overview) => {
        this.getPostsBoilerPlateCode(overview, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  getUserComments(user, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getComments().then((comments) => {
        this.getPostsBoilerPlateCode(comments, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  // API key and user you are searching for must match or this will fail
  getUserUpvotedContent(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getUpvotedContent().then((content) => {
        resolve(content);
      }).catch(error => reject(error));
    });
  }

  // API key and user you are searching for must match or this will fail
  getUserDownvotedContent(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getDownvotedContent().then((content) => {
        resolve(content);
      }).catch(error => reject(error));
    });
  }

  getUserSubmittedPosts(user, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getSubmissions().then((submittedPosts) => {
        this.getPostsBoilerPlateCode(submittedPosts, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

  getUserInfo(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).fetch().then((info) => {
        resolve(info)
      }).catch(error => reject(error));
    });
  }

  getUserGildedContent(user, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getGildedContent().then((gildedContent) => {
        this.getPostsBoilerPlateCode(gildedContent, fetchMoreAmount, resolve);
      }).catch(error => reject(error));
    });
  }

}
