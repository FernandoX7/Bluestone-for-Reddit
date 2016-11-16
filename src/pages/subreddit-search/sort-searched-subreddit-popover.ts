/**
 * Created by fernando on 11/15/16.
 */
import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";

@Component({
  selector: 'sort-searched-subreddit-popover',
  templateUrl: 'sort-searched-subreddit-popover.html'
})

export class SortSearchedSubredditPopover {

  categories: any;
  typeOfPage: string;
  subTypeOfPage: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.typeOfPage = this.navParams.get('typeOfPage');
    this.subTypeOfPage = this.navParams.get('subCategory');
    this.categories = ['Hot','New','Rising','Controversial','Top']
  }

  selectCategory(subType) {
    this.viewCtrl.dismiss({
      typeOfPage: this.typeOfPage,
      subTypeOfPage: this.subTypeOfPage,
      newSubTypeOfPage: subType
    });
  }

}
