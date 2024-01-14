import { Component } from '@angular/core';
import { UserDashboardCardComponent } from '../user-dashboard-card/user-dashboard-card.component';
import usersData from '../../data/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserDashboardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  users = usersData;
  constructor() {}
  ngOnInit() {}
}
