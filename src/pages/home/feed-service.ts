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

  getFeed(typeOfPage) {

    var type = '';

    switch (typeOfPage) {
      case 'Front page': // or Homepage
        type = this.constants.HOMEPAGE_NEWS_FEED;
        break;
      case 'All':
        type = this.constants.ALL_NEWS_FEED;
        break;
      case 'New':
        type = this.constants.NEW_NEWS_FEED;
        break;
      case 'Rising':
        type = this.constants.RISING_NEWS_FEED;
        break;
      case 'Controversial':
        type = this.constants.CONTROVERSIAL_NEWS_FEED;
        break;
      case 'Top':
        type = this.constants.TOP_NEWS_FEED;
        break;
    }

    return this.http
      .get(this.constants.URL +  type)
      .map(res => res.json());
  }

}
