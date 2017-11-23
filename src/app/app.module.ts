import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {Home} from '../pages/home/home';
import {HomeItemDetail} from '../pages/home-item-detail/home-item-detail';
import {FeedService} from "../pages/home/feed-service";
import {ThumbnailImage} from "../pages/popups/thumbnail-image";
import {SubredditSearch} from "../pages/subreddit-search/subreddit-search";
import {GetSubredditService} from "../pages/subreddit-search/get-subreddit-service";
import {SortFeedPopover} from "../pages/home/sort-feed-popover";
import {UserSearch} from "../pages/user-search/user-search";
import {SortUserFeedPopover} from "../pages/user-search/sort-user-feed-popover";
import {SortSearchedSubredditPopover} from "../pages/subreddit-search/sort-searched-subreddit-popover";
import {CommentsList} from "../pages/comments/comments-list/comments-list";
import {MomentModule} from "angular2-moment";
import {Constants} from "../pages/util/Constants";
import {BrowserModule} from '@angular/platform-browser';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    Home,
    HomeItemDetail,
    ThumbnailImage,
    SubredditSearch,
    SortFeedPopover,
    UserSearch,
    SortUserFeedPopover,
    SortSearchedSubredditPopover,
    CommentsList
  ],
  imports: [
    IonicModule.forRoot(MyApp, {mode: 'md'}),
    MomentModule,
    BrowserModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    HomeItemDetail,
    ThumbnailImage,
    SubredditSearch,
    SortFeedPopover,
    UserSearch,
    SortUserFeedPopover,
    SortSearchedSubredditPopover
  ],
  providers: [
    FeedService,
    Constants,
    GetSubredditService,
    StatusBar,
    SplashScreen
  ]
})

export class AppModule {
}
