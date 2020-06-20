import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastsStatsComponent } from './podcasts-stats.component';

describe('PodcastsStatsComponent', () => {
  let component: PodcastsStatsComponent;
  let fixture: ComponentFixture<PodcastsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
