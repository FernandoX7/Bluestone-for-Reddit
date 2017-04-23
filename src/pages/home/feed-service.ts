/**
 * Created by fernando on 11/2/16.
 */
import {Injectable, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Constants} from "../../util/Constants";

/**
 * Handles loading the news feed
 */

@Injectable()
export class FeedService implements OnInit {

  http: any;

  constructor(http: Http, private constants: Constants) {
    this.http = http;
  }

  ngOnInit() {
    this.getFeed(null);
  }

  getTypeOfPage(typeOfPage, isGettingSubType) {
    let type = '';
    if (isGettingSubType) {
      switch (typeOfPage) {
        case 'Front page': // or Homepage
          type = this.constants.URL;
          break;
        case 'All':
          type = this.constants.URL2;
          break;
      }
    } else {
      switch (typeOfPage) {
        case 'Front page': // or Homepage
          type = this.constants.HOMEPAGE_NEWS_FEED;
          break;
        case 'All':
          type = this.constants.ALL_NEWS_FEED;
          break;
      }
    }
    return type;
  }

  getFeed(typeOfPage) {
   let type = this.getTypeOfPage(typeOfPage, false);
    return this.http
      .get(this.constants.URL +  type)
      .map(res => res.json());
  }

  // Load more feed while scrolling
  getMoreFeed(typeOfPage, afterPageCode) {
    let type = this.getTypeOfPage(typeOfPage, false);
    return this.http
      .get(this.constants.URL +  type + '?after=' + afterPageCode)
      .map(res => res.json());
  }

  getSubTypeFeed(typeOfPage, subTypeOfPage) {
    let type = this.getTypeOfPage(typeOfPage, true);
    subTypeOfPage = subTypeOfPage.toLowerCase();
    let feed = type + subTypeOfPage + this.constants.ENDING;
    return this.http
      .get(feed)
      .map(res => res.json());
  }

  // Load more feed while scrolling
  getMoreSubTypeFeed(typeOfPage, subTypeOfPage, afterPageCode) {
    let type = this.getTypeOfPage(typeOfPage, true);
    subTypeOfPage = subTypeOfPage.toLowerCase();
    let feed = type + subTypeOfPage + this.constants.ENDING + '?after=' + afterPageCode;
    return this.http
      .get(feed)
      .map(res => res.json());
  }

}
