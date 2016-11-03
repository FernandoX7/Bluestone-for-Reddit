/**
 * Created by fernando on 11/2/16.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Constants} from "../util/Constants";

@Injectable()
export class GetSubredditService {

  http: any;

  constructor(http: Http, private constants: Constants) {
    this.http = http;
  }

  ngOnInit() {
    this.getSubreddit('');
  }

  getSubreddit(subreddit) {
    return this.http
      .get(this.constants.GET_SUBREDDIT + subreddit + '.json')
      .map(res => res.json());
  }

}
