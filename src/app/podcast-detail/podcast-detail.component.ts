import { Component, OnInit, Input } from '@angular/core';
import { Podcast }  from '../podcast';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.css']
})
export class PodcastDetailComponent implements OnInit {
	@Input() podcast: Podcast;

  constructor() { }

  ngOnInit(): void {
  }

}
	