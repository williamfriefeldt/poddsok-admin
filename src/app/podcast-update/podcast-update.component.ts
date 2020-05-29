import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { PodcastService} from '../podcast.service';
import { MessageService } from '../message.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-podcast-update',
  templateUrl: './podcast-update.component.html',
  styleUrls: ['./podcast-update.component.css']
})
export class PodcastUpdateComponent implements OnInit {

  constructor(
  	private spotifyService: SpotifyService,
  	private podcastService: PodcastService,
  	private messageService: MessageService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const pod = this.router.snapshot.paramMap.get('title');
    this.spotifyService.searchPod( pod ).subscribe( res => console.log(res) )
  }

}
