import { Component, OnInit } from '@angular/core';
import { Podcast } from '../../interfaces/podcast';
import { PodcastService } from '../../services/podcast.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	podcasts: Podcast[] = [];
  name: string;

  constructor( 
    private podcastService: PodcastService,
    private router: ActivatedRoute,
    private cookie: CookieService
  ) { }

  ngOnInit(): void {
    this.name = this.router.snapshot.queryParamMap.get("access_token");
    this.cookie.set( 'accessToken', this.name );
  }


}
