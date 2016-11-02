import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { HomeItemDetail } from '../pages/home-item-detail/home-item-detail';
import {FeedService} from "../pages/home/feed-service";
import {Constants} from "../pages/util/Constants";

@NgModule({
  declarations: [
    MyApp,
    Home,
    HomeItemDetail
  ],
  imports: [
    IonicModule.forRoot(MyApp, { mode: 'md' })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    HomeItemDetail
  ],
  providers: [FeedService, Constants]
})
export class AppModule {}
