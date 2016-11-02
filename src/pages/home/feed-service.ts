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
    this.getFeed();
  }

  getFeed() {
    return this.http
      .get(this.constants.HOMEPAGE_NEWS_FEED)
      .map(res => res.json());
  }

}
