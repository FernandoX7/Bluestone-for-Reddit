/**
 * Created by fernando on 11/2/16.
 */
import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Constants} from "../util/Constants";

@Injectable()
export class GetSubredditService implements OnInit {

  http: any;

  constructor(http: HttpClient, private constants: Constants) {
    this.http = http;
  }

  ngOnInit() {
    this.getSubreddit('');
  }

  getSubreddit(subreddit) {
    return this.http
      .get(this.constants.GET_SUBREDDIT + subreddit + this.constants.ENDING);
  }

  // Load more feed while scrolling
  getMoreSubreddit(subreddit, afterPageCode) {
    return this.http
      .get(this.constants.GET_SUBREDDIT + subreddit + this.constants.ENDING + '?after=' + afterPageCode);
  }

  getSortedSubreddit(subreddit, subTypeOfPage) {
    subTypeOfPage = subTypeOfPage.toLowerCase();
    let feed = this.constants.GET_SUBREDDIT + subreddit + this.constants.AND + subTypeOfPage + this.constants.ENDING;
    return this.http.get(feed);
  }

  // Load more feed while scrolling
  getMoreSortedSubreddit(subreddit, subTypeOfPage, afterPageCode) {
    subTypeOfPage = subTypeOfPage.toLowerCase();
    let feed = this.constants.GET_SUBREDDIT + subreddit + this.constants.AND + subTypeOfPage + this.constants.ENDING + '?after=' + afterPageCode;
    return this.http.get(feed);
  }

}
