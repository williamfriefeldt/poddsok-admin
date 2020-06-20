import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PodcastsComponent } from './components/podcasts/podcasts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PodcastDetailComponent } from './components/podcast-detail/podcast-detail.component';
import { PodcastUpdateComponent } from './components/podcast-update/podcast-update.component';
import { PodcastNewComponent } from './components/podcast-new/podcast-new.component';
import { PodcastUpdateAllComponent } from './components/podcast-update-all/podcast-update-all.component';
import { PodcastsStatsComponent } from './components/podcasts-stats/podcasts-stats.component';

/*
* Routes and corresponding components for entier app.
*/

const routes: Routes = [
	{ path: 'podcasts', component: PodcastsComponent },
	{ path: 'statistik', component: PodcastsStatsComponent },
	{ path: 'uppdateraAlla', component: PodcastUpdateAllComponent },
	{ path: 'nypodd', component: PodcastNewComponent },
	{ path: 'detail/:title', component: PodcastDetailComponent },
	{ path: 'update/:title', component: PodcastUpdateComponent },
	{ path: '', component: DashboardComponent },
	{ path: '', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
