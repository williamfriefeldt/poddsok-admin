import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PodcastsComponent } from './components/podcasts/podcasts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PodcastDetailComponent } from './components/podcast-detail/podcast-detail.component';
import { PodcastUpdateComponent } from './components/podcast-update/podcast-update.component';

const routes: Routes = [
	{ path: 'podcasts', component: PodcastsComponent },
	{ path: 'statistik', component: PodcastsComponent },
	{ path: 'uppdateraAlla', component: PodcastsComponent },
	{ path: 'nypodd', component: PodcastsComponent },
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
