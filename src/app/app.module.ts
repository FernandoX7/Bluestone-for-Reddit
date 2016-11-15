import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { HomeItemDetail } from '../pages/home-item-detail/home-item-detail';
import {FeedService} from "../pages/home/feed-service";
import {Constants} from "../pages/util/Constants";
import {ThumbnailImage} from "../pages/popups/thumbnail-image";
import {SubredditSearch} from "../pages/subreddit-search/subreddit-search";
import {GetSubredditService} from "../pages/subreddit-search/get-subreddit-service";
import {SortFeedPopover} from "../pages/home/sort-feed-popover";
import {UserSearch} from "../pages/user-search/user-search";

@NgModule({
  declarations: [
    MyApp,
    Home,
    HomeItemDetail,
    ThumbnailImage,
    SubredditSearch,
    SortFeedPopover,
    UserSearch
  ],
  imports: [
    IonicModule.forRoot(MyApp, { mode: 'md' })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    HomeItemDetail,
    ThumbnailImage,
    SubredditSearch,
    SortFeedPopover,
    UserSearch
  ],
  providers: [FeedService, Constants, GetSubredditService]
})
export class AppModule {}
