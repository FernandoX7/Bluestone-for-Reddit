import {Component, OnInit} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {CommentsService} from "../comments/comments-service";
import * as _ from 'lodash';

@Component({
  selector: 'page-home-item-detail',
  templateUrl: 'home-item-detail.html',
  providers: [CommentsService]
})

export class HomeItemDetail implements OnInit {

  post: any;
  comments: any;
  loadedComments: boolean = false;

  constructor(public navParams: NavParams, private commentsService: CommentsService) {
    this.post = navParams.get('feedPost');
    console.log('this.post', this.post);
  }

  ngOnInit() {
    this.retrieveComments();
  }

  retrieveComments() {
    this.commentsService.fetchComments(this.post).subscribe((comments) => {
      this.loadedComments = true;
      this.comments = comments;
    });
  }

  hasThumbnail(post) {
    return post.thumbnailImage;
  }

  hasLinkFlair(linkFlair) {
    return !_.isNil(linkFlair) && linkFlair !== ''
  }

  // Adds K to a number if greaters then 999 - Ex: 4.5K
  formatToThousand(votes) {
    return votes > 999 ? (votes / 1000).toFixed(1) + 'K' : votes;
  }


  postIsGilded(gildedAmount) {
    return gildedAmount > 0;
  }

  hasSelfText(selfText) {
    return selfText !== '';
  }


}
