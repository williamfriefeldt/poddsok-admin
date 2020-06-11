import { Component, OnInit } from '@angular/core';
import { Podcast } from '../../interfaces/podcast';
import { PodcastService } from '../../services/podcast.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.css']
})
export class PodcastsComponent implements OnInit {

	podcasts: Podcast[];

  getPodcasts(): void {
    this.podcastService.getPodcasts()
      .subscribe( podcasts => this.podcasts = podcasts );
  }

  constructor(private podcastService: PodcastService) { } 

  ngOnInit(): void {
    this.getPodcasts();
  }

}
