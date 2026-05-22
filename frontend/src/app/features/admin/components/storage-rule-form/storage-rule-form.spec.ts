import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleForm } from './storage-rule-form';

describe('StorageRuleForm', () => {
  let component: StorageRuleForm;
  let fixture: ComponentFixture<StorageRuleForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageRuleForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageRuleForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
