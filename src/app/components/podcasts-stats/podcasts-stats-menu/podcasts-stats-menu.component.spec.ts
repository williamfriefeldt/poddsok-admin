import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastsStatsMenuComponent } from './podcasts-stats-menu.component';

describe('PodcastsStatsMenuComponent', () => {
  let component: PodcastsStatsMenuComponent
  let fixture: ComponentFixture<PodcastsStatsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastsStatsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastsStatsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
