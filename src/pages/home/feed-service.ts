/**
 * Created by fernando on 11/2/16.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Constants} from "../util/Constants";

@Injectable()
export class FeedService {

  http: any;

  constructor(http: Http, private constants: Constants) {
    this.http = http;
  }

  ngOnInit() {
    this.getFeed('');
  }

  getTypeOfPage(typeOfPage, isGettingSubType) {
    var type = '';
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
   var type = this.getTypeOfPage(typeOfPage, false);
    return this.http
      .get(this.constants.URL +  type)
      .map(res => res.json());
  }

  getSubTypeFeed(typeOfPage, subTypeOfPage) {
    var type = this.getTypeOfPage(typeOfPage, true);
    subTypeOfPage = subTypeOfPage.toLowerCase();
    var feed = type + subTypeOfPage + this.constants.ENDING;
    return this.http
      .get(feed)
      .map(res => res.json());
  }

}
