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

  getUserOverview(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getOverview().then((overview) => {

        console.log('User overview', overview);

      }).catch(error => reject(error));
    });
  }

  getUserComments(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getComments().then((comments) => {

        console.log('User comments', comments);

      }).catch(error => reject(error));
    });
  }

  // API key and user you are searching for must match or this will fail
  getUserUpvotedContent(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getUpvotedContent().then((content) => {
      }).catch(error => reject(error));
    });
  }

  // API key and user you are searching for must match or this will fail
  getUserDownvotedContent(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getDownvotedContent().then((content) => {
      }).catch(error => reject(error));
    });
  }

  getUserSubmittedPosts(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).getSubmissions().then((posts) => {

        console.log('User submitted posts', posts);

      }).catch(error => reject(error));
    });
  }

  getUserInfo(user) {
    return new Promise((resolve, reject) => {
      this.reddit.getUser(user).fetch().then((info) => {

        console.log('User info', info);

      }).catch(error => reject(error));
    });
  }

}
