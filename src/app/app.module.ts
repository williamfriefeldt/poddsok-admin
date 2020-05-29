import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { CookieService } from 'ngx-cookie-service'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { PodcastsComponent } from './podcasts/podcasts.component';
import { PodcastDetailComponent } from './podcast-detail/podcast-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PodcastUpdateComponent } from './podcast-update/podcast-update.component';

@NgModule({
  declarations: [
    AppComponent,
    PodcastsComponent,
    PodcastDetailComponent,
    MessagesComponent,
    DashboardComponent,
    PodcastUpdateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
