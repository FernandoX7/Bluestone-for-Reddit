/**
 * Created by fernando on 11/2/16.
 */
import {Injectable, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Constants} from "../util/Constants";

@Injectable()
export class GetSubredditService implements OnInit{

  http: any;

  constructor(http: Http, private constants: Constants) {
    this.http = http;
  }

  ngOnInit() {
    this.getSubreddit('');
  }

  getSubreddit(subreddit) {
    return this.http
      .get(this.constants.GET_SUBREDDIT + subreddit + this.constants.ENDING)
      .map(res => res.json());
  }

  getSortedSubreddit(subreddit, subTypeOfPage) {
    subTypeOfPage = subTypeOfPage.toLowerCase();
    let feed = this.constants.GET_SUBREDDIT + subreddit + this.constants.AND + subTypeOfPage + this.constants.ENDING;
    return this.http
      .get(feed)
      .map(res => res.json());
  }

}
