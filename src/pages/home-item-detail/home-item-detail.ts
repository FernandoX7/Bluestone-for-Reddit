import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {NavController, NavParams} from 'ionic-angular';
import * as moment from 'moment';

@Component({
  selector: 'page-home-item-detail',
  templateUrl: 'home-item-detail.html'
})

export class HomeItemDetail implements OnInit {

  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('feedItem');
    console.log('Successfully got: ', this.selectedItem);
  }

  ngOnInit() {

    // If there's no .preview property - it's an all text post
    if (typeof this.selectedItem.data.preview !== 'undefined') {
      // Iterate through the resolutions array to find the highest resolution for that picture
      var maximumResolution = 10;
      var selectedItemsResolutions = this.selectedItem.data.preview.images[0].resolutions;

      // Check if it's a gif
      if (typeof this.selectedItem.data.preview.images[0].variants.gif !== 'undefined') {
        var selectedItemsResolutionsGifs = this.selectedItem.data.preview.images[0].variants.gif.resolutions;
        selectedItemsResolutions = selectedItemsResolutionsGifs;
      }

      while (maximumResolution > 0) {
        if (typeof selectedItemsResolutions[maximumResolution] === 'undefined') {
          maximumResolution--;
        } else {
          // Make the url actually point to the image and add it as a property to the object
          var headerImageUrl = selectedItemsResolutions[maximumResolution].url;
          headerImageUrl = _.replace(headerImageUrl, new RegExp('&amp;', 'g'), '&');
          this.selectedItem.data['headerImage'] = headerImageUrl;
          break;
        }
      }
    }

    // Parse selftext html into actual html that can be interpreted
    this.selectedItem.data['selftext_html_parsed'] = this.decodeHtml(this.selectedItem.data.selftext_html);
    // Get hours posted ago
    this.selectedItem.data['hoursAgo'] = this.getHoursAgo(this.selectedItem.data.created_utc);

  }

  decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

    private getHoursAgo(created_utc: any) {
    var currentTime = moment();
    var createdAt = moment.unix(created_utc);
    return currentTime.diff(createdAt, 'hours');
  }
}
