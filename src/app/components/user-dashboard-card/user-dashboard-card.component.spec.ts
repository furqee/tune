import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardCardComponent } from './user-dashboard-card.component';

describe('UserDashboardCardComponent', () => {
  let component: UserDashboardCardComponent;
  let fixture: ComponentFixture<UserDashboardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashboardCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
