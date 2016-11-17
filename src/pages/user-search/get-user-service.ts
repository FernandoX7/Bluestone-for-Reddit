/**
 * Created by fernando on 11/15/16.
 */
import {Injectable, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Constants} from "../util/Constants";

@Injectable()
export class GetUserService implements OnInit {

  http: any;

  constructor(http: Http, private constants: Constants) {
    this.http = http;
  }

  ngOnInit() {
    this.getUser('');
  }

  getUser(user) {
    return this.http
      .get(this.constants.GET_USER + user + this.constants.ENDING)
      .map(res => res.json());
  }

  getUserSorted(user, subTypeOfPage) {
    subTypeOfPage = subTypeOfPage.toLowerCase();
    let feed = this.constants.GET_USER + user + '/' + subTypeOfPage + this.constants.ENDING;
    return this.http
      .get(feed)
      .map(res => res.json());
  }

}
