import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CommentsService {

  constructor(public http: HttpClient) {
  }

  fetchComments(post) {
    let url: string = 'https://www.reddit.com/' + post.permalink + '.json';
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
