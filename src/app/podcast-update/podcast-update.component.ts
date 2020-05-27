import { Component, OnInit } from '@angular/core';
import { ItunesService } from '../itunes.service';
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
  	private itunesService: ItunesService,
  	private podcastService: PodcastService,
  	private messageService: MessageService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const pod = this.router.snapshot.paramMap.get('title');
    this.itunesService.searchPod( pod ).subscribe( res => console.log(res) )
  }

}
