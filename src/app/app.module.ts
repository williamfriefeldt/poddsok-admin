import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { CookieService } from 'ngx-cookie-service'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { ChartsModule } from 'ng2-charts';

/* Components */
import { PodcastsComponent } from './components/podcasts/podcasts.component';
import { PodcastDetailComponent } from './components/podcast-detail/podcast-detail.component';
import { MessagesComponent } from './components/messages/messages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PodcastUpdateComponent } from './components/podcast-update/podcast-update.component';
import { PodcastNewComponent } from './components/podcast-new/podcast-new.component';
import { PodcastUpdateAllComponent } from './components/podcast-update-all/podcast-update-all.component';
import { PodcastsStatsComponent } from './components/podcasts-stats/podcasts-stats.component';

/* Material Design */
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    AppComponent,
    PodcastsComponent,
    PodcastDetailComponent,
    MessagesComponent,
    DashboardComponent,
    PodcastUpdateComponent,
    DialogComponent,
    PodcastNewComponent,
    PodcastUpdateAllComponent,
    PodcastsStatsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ChartsModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatDialogModule,
    DragDropModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatRadioModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
