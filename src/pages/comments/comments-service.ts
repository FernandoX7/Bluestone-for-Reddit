import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

const BASE_URL: string = 'https://www.reddit.com/';
const JSON_POSTFIX: string = '.json';

@Injectable()
export class CommentsService {

  constructor(public http: Http) {
  }

  fetchComments(post) {
    let url: string = BASE_URL + post.permalink + JSON_POSTFIX;
    return this.http.get(url)
      .map(res => res.json()[1].data.children.map(c => c.data).filter(c => c.body))
      .map(this.beautifyReplies.bind(this))
  }

  beautifyReplies(comments) {
    return comments.map(comment => {
      comment.replies = comment.replies ? comment.replies.data.children.map(reply => reply.data).filter(c => c.body) : [];
      this.beautifyReplies(comment.replies);
      return comment;
    })
  }
}
