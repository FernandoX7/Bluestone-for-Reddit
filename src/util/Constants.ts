/**
 * Created by fernando on 11/2/16.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class Constants {

  URL = 'https://www.reddit.com/';
  URL2 = 'https://www.reddit.com/r/all/';

  REDIRECT = 'https://crossorigin.me/';

  HOMEPAGE_NEWS_FEED = '/.json';
  ALL_NEWS_FEED = '/r/all/.json';
  NEW_NEWS_FEED = '/new/.json';
  RISING_NEWS_FEED = '/rising/.json';
  CONTROVERSIAL_NEWS_FEED = '/controversial/.json';
  TOP_NEWS_FEED = '/top/.json';
  GET_SUBREDDIT = 'https://www.reddit.com/r/';
  GET_USER = 'https://www.reddit.com/user/';

  AND = '/';
  ENDING = '/.json';


}
