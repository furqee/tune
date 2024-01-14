import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IUser } from '../../data/user';
import { ILog, LogType } from '../../data/logs';
import logs from '../../data/logs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-user-dashboard-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-dashboard-card.component.html',
  styleUrls: ['./user-dashboard-card.component.scss'],
})
export class UserDashboardCardComponent implements OnChanges {
  @Input() user!: IUser;
  logs: ILog[] = [];
  totalImpressions: number = 0;
  totalConversions: number = 0;
  totalRevenue: number = 0;
  startDate: string = '';
  endDate: string = '';
  lineChart: Chart | undefined | null;
  lineChartLabels: any[] = [];
  lineChartData: any[] = [];
  imagesArray = [
    '',
    'assets/image-0.jpg',
    'assets/image-1.jpg',
    'assets/image-2.jpg',
    'assets/image-3.jpg',
    'assets/image-4.jpg',
    'assets/image-5.jpg',
  ];

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      const newlogs = logs.map((log) => {
        const dateString = log.time;
        const dateOnly = dateString.split(' ')[0];
        return {
          ...log,
          date: dateOnly,
          avatar: this.getRandomImageFromArray(this.imagesArray),
        };
      });
      this.user.avatar = this.getRandomImageFromArray(this.imagesArray);
      this.logs = newlogs.filter((log) => log.user_id === this.user.id);
      this.calculateUserStats();
      this.generateLineChartData();
      this.updateChart();
    }
  }

  ngAfterViewInit(): void {
    this.initializeChart();
    this.updateChart();
  }

  private initializeChart() {
    const canvas = this.el.nativeElement.querySelector(
      '#lineChartCanvas'
    ) as HTMLCanvasElement;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.lineChart = new Chart(ctx, {
          type: 'line', // Make sure the type is set to 'line'
          data: {
            labels: this.lineChartLabels,
            datasets: this.lineChartData,
          },
          options: {
            responsive: true,
            // legend: {
            //   display: true,
            // },
          },
        });
      }
    }
  }

  private updateChart() {
    if (this.lineChart) {
      this.lineChart.data.labels = this.lineChartLabels;
      this.lineChart.data.datasets = this.lineChartData;
      this.lineChart.update();
    }
  }

  private generateLineChartData() {
    // Assuming you have a property like 'date' in the logs
    this.lineChartLabels = [
      ...new Set(
        this.logs.map((log) => {
          const dateString = log.time;
          const dateOnly = dateString.split(' ')[0];
          return dateOnly;
        })
      ),
    ];

    let data = this.lineChartLabels.map((date) =>
      this.getCurrentDayImpressionsWithDate(date)
    );

    this.lineChartData = [
      {
        data,
        label: 'Impressions',
      },
    ];
  }

  private getCurrentDayImpressionsWithDate = (date: string) => {
    const currentDayImpressions = this.logs.filter((l) => l.date === date);
    return currentDayImpressions.length;
  };

  private calculateUserStats() {
    this.totalImpressions = this.logs.filter(
      (log) => log.type === LogType.impression
    ).length;
    this.totalConversions = this.logs.filter(
      (log) => log.type === LogType.conversion
    ).length;

    const sortedLogs = this.logs.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedLogs.length > 0) {
      this.startDate = sortedLogs[0].date;
      this.endDate = sortedLogs[sortedLogs.length - 1].date;
    }

    this.totalRevenue = this.logs
      .filter((log) => log.type === LogType.conversion && log.revenue)
      .reduce((acc, log) => acc + (log.revenue || 0), 0);
  }

  // Function to pick a image from the array
  private getRandomImageFromArray(arr: any) {
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * arr.length);

    // Return the string at the random index
    return arr[randomIndex];
  }
}
