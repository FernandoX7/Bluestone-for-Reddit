import {Component, Input} from '@angular/core';

@Component({
  selector: 'comments-list',
  templateUrl: 'comments-list.html'
})

export class CommentsList {

  @Input() comments;
  randomColor = require('randomcolor');
  defaultCommentBorder = '1px solid #a0a2a7';
  expandedCommentBorder = this.getRandomCommentBorderColor();

  constructor() {
  }

  toggleExpanded(comment) {
    if (comment.replies.length > 0) {
      comment.expanded = !comment.expanded;
    }
  }

  trackByCommentId(index, comment) {
    return comment.id;
  }

  getRandomCommentBorderColor() {
    return '1px solid' + this.randomColor.randomColor();
  }
}
