import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastNewComponent } from './podcast-new.component';

describe('PodcastNewComponent', () => {
  let component: PodcastNewComponent;
  let fixture: ComponentFixture<PodcastNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
