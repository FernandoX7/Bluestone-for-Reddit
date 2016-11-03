import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {GetSubredditService} from "./get-subreddit-service";
import * as _ from 'lodash';

@Component({
  selector: 'page-subreddit-search',
  templateUrl: 'subreddit-search.html',
  providers: [GetSubredditService]
})

export class SubredditSearch implements OnInit {

  passedSubredditName: string;
  feed: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: GetSubredditService) {
    this.passedSubredditName = navParams.get('searchValue');
  }

  ngOnInit() {

    this.data
      .getSubreddit(this.passedSubredditName)
      .subscribe(
        data => {
          data = data.data.children;
          this.feed = data;
          console.log(this.passedSubredditName, 'data:', data);

          // Add higher quality thumbnails
          for (var i = 0; i < data.length; i++) {
            // If there's no .preview property - it's an all text post
            if (typeof data[i].data.preview !== 'undefined') {
              // Iterate through the resolutions array to find the highest resolution for that picture
              var maximumResolution = 10;
              var selectedItemsResolutions = data[i].data.preview.images[0].resolutions;

              // Check if it's a gif
              if (typeof data[i].data.preview.images[0].variants.gif !== 'undefined') {
                var selectedItemsResolutionsGifs = data[i].data.preview.images[0].variants.gif.resolutions;
                selectedItemsResolutions = selectedItemsResolutionsGifs;
              }

              while (maximumResolution > 0) {
                if (typeof selectedItemsResolutions[maximumResolution] === 'undefined') {
                  maximumResolution--;
                } else {
                  // Make the url actually point to the image and add it as a property to the object
                  var thumbnailImageUrl = selectedItemsResolutions[maximumResolution].url;
                  thumbnailImageUrl = _.replace(thumbnailImageUrl, new RegExp('&amp;', 'g'), '&');
                  data[i].data['thumbnailImage'] = thumbnailImageUrl;
                  break;
                }
              }
            }
          }

        },
        err => console.error('There was an error getting the searched subreddit', err),
        () => console.log('Successfully got the searched subreddit')
      );

  }

}
