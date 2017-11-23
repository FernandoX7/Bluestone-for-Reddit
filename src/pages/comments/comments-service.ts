import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";

const BASE_URL: string = 'https://www.reddit.com/';
const JSON_POSTFIX: string = '.json';

@Injectable()
export class CommentsService {

  constructor(public http: HttpClient) {
  }

  fetchComments(post) {
    let url: string = BASE_URL + post.permalink + JSON_POSTFIX;
    return this.http.get(url)
      .map(res => res[1].data.children.map(c => c.data).filter(c => c.body))
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
