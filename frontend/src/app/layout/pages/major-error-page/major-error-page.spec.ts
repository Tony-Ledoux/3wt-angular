import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorErrorPage } from './major-error-page';

describe('MajorErrorPage', () => {
  let component: MajorErrorPage;
  let fixture: ComponentFixture<MajorErrorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorErrorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MajorErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
