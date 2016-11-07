/**
 * Created by fernando on 11/5/16.
 */
import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";

@Component({
  selector: 'sort-feed-popover',
  templateUrl: 'sort-feed-popover.html'
})

export class SortFeedPopover {

  categories: any;
  typeOfPage: string;
  callback: any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {

    this.typeOfPage = this.navParams.get('typeOfPage');
    console.log('Popovers type of page is: ', this.typeOfPage);
    this.callback = this.navParams.get('cb');
    console.log('first', this.callback);

    this.categories = ['Hot','New','Rising','Controversial','Top']

  }

  selectCategory(category) {
    console.log(category.title);
    this.viewCtrl.dismiss(category);
  }

}
