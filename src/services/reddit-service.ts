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

  getHotPosts(subreddit?, fetchMoreAmount?) {
    return new Promise((resolve, reject) => {
      this.reddit.getHot(subreddit).then((submissions) => {
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

      }).catch(error => reject(error));
    });
  }

}
