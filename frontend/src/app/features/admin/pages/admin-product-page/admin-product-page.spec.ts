import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductPage } from './admin-product-page';

describe('AdminProductPage', () => {
  let component: AdminProductPage;
  let fixture: ComponentFixture<AdminProductPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
