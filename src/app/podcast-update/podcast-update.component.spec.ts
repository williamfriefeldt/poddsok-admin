import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastUpdateComponent } from './podcast-update.component';

describe('PodcastUpdateComponent', () => {
  let component: PodcastUpdateComponent;
  let fixture: ComponentFixture<PodcastUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
