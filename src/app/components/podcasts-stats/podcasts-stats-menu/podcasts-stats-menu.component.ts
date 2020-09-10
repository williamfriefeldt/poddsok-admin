import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './podcasts-stats-menu.component.html',
  styleUrls: ['./podcasts-stats-menu.component.css']
})
export class PodcastsStatsMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  topics = [ 
  	'Inlägg',
  	'Besökare',
  	'Populärt'
  ]

}
