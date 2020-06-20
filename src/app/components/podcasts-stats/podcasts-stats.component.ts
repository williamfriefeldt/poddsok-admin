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
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [], label: 'Segment', backgroundColor: '#5900b3', hoverBackgroundColor:'#a64dff' }
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
      			this.podcasts.map(podcast => {
      				this.barChartData[0].data.push( podcast.totalSegments );
      			});
      			this.barChartData[0].data.sort( this.sortNr );
      			this.addTitles();
      		}, 1500);     	
      	} else {
      		this.calcTotSegments();
      		this.podcasts.map(podcast => {
      			this.barChartData[0].data.push( podcast.totalSegments );
      		});
					this.barChartData[0].data.sort( this.sortNr );
      		this.addTitles();
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
  	});
  }

  sortNr( a: any, b:any ): number {
    if( a > b ) {
      return -1;
    } else if ( a < b ) {
      return 1;
    } else{
      return 0;
    }
    return 0;
  }

  addTitles(): void {
  	this.barChartData[0].data.forEach( nr => {
			this.podcasts.map(podcast => {
					if( nr === podcast.totalSegments ) this.barChartLabels.push(podcast.title);
			});
		});
  }
}
