import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHousehold } from './create-household';

describe('CreateHousehold', () => {
  let component: CreateHousehold;
  let fixture: ComponentFixture<CreateHousehold>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHousehold]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHousehold);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
