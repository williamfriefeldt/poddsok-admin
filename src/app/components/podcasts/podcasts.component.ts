import { Component, OnInit } from '@angular/core';
import { Podcast } from '../../interfaces/podcast';
import { PodcastService } from '../../services/podcast.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.css']
})

/**
 * @description Get and show podcasts on home page.
 */
export class PodcastsComponent implements OnInit {

	podcasts: Podcast[];
  loading: boolean = true;
  loadCount: number = 0;

  /**
   * @description Track images loaded. If done, hide loading.
   */
  onLoad(): void {
    this.loadCount++;
    if( this.loadCount === this.podcasts.length ) {
      this.loading = false;
    }
  }

  /**
   * @description Get podcasts from service.
   */
  getPodcasts(): void {
    this.podcastService.getPodcasts()    
      .subscribe( podcasts => {
        this.podcasts = podcasts;
      });
  }

  /**
   * @param { PodcastService } - To get all podcasts
   */
  constructor(private podcastService: PodcastService) { } 

  /**
  * @description When component is ready - get podcasts.
  */
  ngOnInit(): void {
    this.getPodcasts();
  }

}
