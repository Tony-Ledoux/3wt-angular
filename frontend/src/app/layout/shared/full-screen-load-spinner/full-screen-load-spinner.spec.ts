import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenLoadSpinner } from './full-screen-load-spinner';

describe('FullScreenLoadSpinner', () => {
  let component: FullScreenLoadSpinner;
  let fixture: ComponentFixture<FullScreenLoadSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenLoadSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenLoadSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
