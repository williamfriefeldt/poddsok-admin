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
  loading: boolean = true;
  loadCount: number = 0;

  onLoad(): void {
    this.loadCount++;
    if( this.loadCount === this.podcasts.length ) {
      this.loading = false;
    }
  }

  getPodcasts(): void {
    this.podcastService.getPodcasts()
      .subscribe( podcasts => {
        this.podcasts = podcasts;
      });
  }

  constructor(private podcastService: PodcastService) { } 

  ngOnInit(): void {
    this.getPodcasts();
  }

}
