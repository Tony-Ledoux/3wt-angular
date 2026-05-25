import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectboxWrapper } from './modal-selectbox-wrapper';

describe('ModalSelectboxWrapper', () => {
  let component: ModalSelectboxWrapper;
  let fixture: ComponentFixture<ModalSelectboxWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSelectboxWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSelectboxWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
