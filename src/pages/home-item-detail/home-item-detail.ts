import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {NavParams} from 'ionic-angular';
import * as moment from 'moment';
import {CommentsService} from "../comments/comments-service";

@Component({
  selector: 'page-home-item-detail',
  templateUrl: 'home-item-detail.html',
  providers: [CommentsService]
})

export class HomeItemDetail implements OnInit {

  selectedItem: any;
  post: any;
  comments: any;
  loadCompleted: boolean = false;

  constructor(public navParams: NavParams, public commentsService: CommentsService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('feedPost');
    console.log('Successfully passed news feed item ' + moment().format("M/D/YY - h:mm:ss a"), this.selectedItem);
    this.post = this.selectedItem.data;
    this.retrieveComments();
  }

  retrieveComments() {
    this.commentsService.fetchComments(this.post).subscribe((comments) => {
      this.loadCompleted = true;
      this.comments = comments;
    })
  }

  ngOnInit() {
    // If there's no .preview property - it's an all text post
    if (typeof this.selectedItem.data.preview !== 'undefined') {
      // Iterate through the resolutions array to find the highest resolution for that picture
      let maximumResolution = 10;
      let selectedItemsResolutions = this.selectedItem.data.preview.images[0].resolutions;

      // Check if it's a gif
      if (typeof this.selectedItem.data.preview.images[0].variants.gif !== 'undefined') {9
        selectedItemsResolutions = this.selectedItem.data.preview.images[0].variants.gif.resolutions;
      }

      while (maximumResolution > 0) {
        if (typeof selectedItemsResolutions[maximumResolution] === 'undefined') {
          maximumResolution--;
        } else {
          // Make the url actually point to the image and add it as a property to the object
          let headerImageUrl = selectedItemsResolutions[maximumResolution].url;
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
    let currentTime = moment();
    let createdAt = moment.unix(created_utc);
    let hoursAgo = currentTime.diff(createdAt, 'hours');
    if (hoursAgo <= 23) {
      return hoursAgo + 'h';
    } else if (hoursAgo >= 24 && hoursAgo <= 8759) {
      let daysAgo = currentTime.diff(createdAt, 'days');
      return daysAgo + 'd';
    } else if (hoursAgo >= 8760) {
      let yearsAgo = currentTime.diff(createdAt, 'years');
      return yearsAgo + 'y';
    }
  }

}
