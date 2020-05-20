import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PodcastsComponent } from './podcasts/podcasts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PodcastDetailComponent } from './podcast-detail/podcast-detail.component';

const routes: Routes = [
	{ path: 'podcasts', component: PodcastsComponent },
	{ path: 'detail/:title', component: PodcastDetailComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
