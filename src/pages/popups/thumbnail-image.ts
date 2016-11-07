/**
 * Created by fernando on 11/2/16.
 */
import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'popups-thumbnail-image',
  templateUrl: 'thumbnail-image.html'
})

export class ThumbnailImage {

  data: any;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.data = params.get('image');
  }

  closePopup() {
    this.viewCtrl.dismiss();
  }

}
