import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoragelocationForm } from './add-storagelocation-form';

describe('AddStoragelocationForm', () => {
  let component: AddStoragelocationForm;
  let fixture: ComponentFixture<AddStoragelocationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStoragelocationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStoragelocationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
