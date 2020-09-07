import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { PodcastService } from '../../services/podcast.service';
import { Podcast } from '../../interfaces/podcast';

@Component({
  selector: 'app-podcasts-stats',
  templateUrl: './podcasts-stats.component.html',
  styleUrls: ['./podcasts-stats.component.css']
})
export class PodcastsStatsComponent implements OnInit {

	podcasts: Podcast[];
  sortedArray: { title: string, segments: number } []  = [];
  loading: boolean = true;
  totSegments: number = 0;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        }
      }],
      yAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        }   
      }]
    },
    legend: {
      display: false
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [], backgroundColor: '#5900b3', hoverBackgroundColor:'#a64dff' }
  ];

  constructor(
  	private podcastService: PodcastService
  ) { }

  ngOnInit(): void {
  	this.getPodcasts();
  }

  getPodcasts(): void {
    this.podcastService.getPodcasts()
      .subscribe( podcasts => {
      	this.podcasts = podcasts;
      	if (podcasts.length === 0) {
      		setTimeout(() => {
            this.calcTotSegments();
          }, 2000);  
      	} else {
          this.calcTotSegments();
        }
    });
  }


  calcTotSegments(): void {
  	this.podcasts.forEach(podcast => {
  		let totalSegments = 0;
      podcast.episodes.forEach( episode => {
        if( episode !== undefined && episode.minutes !== undefined ) {
          const minList = episode.minutes.filter( min => min.text !== "" );
          totalSegments += minList.length;
        }
      });
      podcast.totalSegments = totalSegments;
      this.totSegments += totalSegments;
      this.sortedArray.push( { title: podcast.title, segments: podcast.totalSegments } );
  	});
    this.sortedArray = this.sortedArray.sort( this.sortNr );
    this.sortedArray.forEach( pod => {
      this.barChartData[0].data.push( pod.segments );
      this.barChartLabels.push( pod.title );
    });
    this.loading = false;
  }

  sortNr( a: any, b:any ): number {
    return b.segments - a.segments;
  }
}
