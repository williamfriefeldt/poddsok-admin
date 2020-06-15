import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastUpdateAllComponent } from './podcast-update-all.component';

describe('PodcastUpdateAllComponent', () => {
  let component: PodcastUpdateAllComponent;
  let fixture: ComponentFixture<PodcastUpdateAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastUpdateAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastUpdateAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
