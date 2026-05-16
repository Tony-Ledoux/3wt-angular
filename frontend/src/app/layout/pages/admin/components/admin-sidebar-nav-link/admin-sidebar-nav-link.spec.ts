import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSidebarNavLink } from './admin-sidebar-nav-link';

describe('AdminSidebarNavLink', () => {
  let component: AdminSidebarNavLink;
  let fixture: ComponentFixture<AdminSidebarNavLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSidebarNavLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSidebarNavLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
