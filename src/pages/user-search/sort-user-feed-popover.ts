/**
 * Created by fernando on 11/15/16.
 */
import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";

@Component({
  selector: 'sort-user-feed-popover',
  templateUrl: 'sort-user-feed-popover.html'
})

export class SortUserFeedPopover {

  categories: any;
  subTypeOfPage: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.subTypeOfPage = this.navParams.get('subCategory');
    this.categories = ['Overview','Comments','Submitted','Gilded']
  }

  selectCategory(subType) {
    this.viewCtrl.dismiss({
      subTypeOfPage: this.subTypeOfPage,
      newSubTypeOfPage: subType
    });
  }

}
