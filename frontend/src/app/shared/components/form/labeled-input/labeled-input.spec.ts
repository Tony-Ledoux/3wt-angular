import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabeledInput } from './labeled-input';

describe('LabeledInput', () => {
  let component: LabeledInput;
  let fixture: ComponentFixture<LabeledInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabeledInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabeledInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
