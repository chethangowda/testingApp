import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { MetricsDataService } from '../metricDataServices/data.service';
import { UserDashboardService } from 'src/services/userdashboard.services';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  sumOfPatientData: any;
  mode = 'determinate';
  value = 80;
  bufferValue = 1000;
  progressCss: any;
  searchText: any;
  resourceCount: any = [];
  selectedIndex: any;

  constructor(private metricsDataService: MetricsDataService,
    private userDashboardService: UserDashboardService) {
  }

  ngOnInit() {
    this.getResourceList();
  }

  public setRow(_index: number) {
    this.selectedIndex = _index;
  }

  onSearch(event) {
    this.searchText = event.target.value;
  }

  sum(array, key) {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
  }


  getResourceList() {
    this.userDashboardService.getResourceCount().subscribe(data => {
      if (data) {
        this.sumOfPatientData = this.sum(data, 'resourceCount');

        for (let item of data) {
          item['value'] = Math.round((item.resourceCount * 100) / this.sumOfPatientData);
          this.progressCss = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

        }
        this.resourceCount = data;
      }
    })
  }

  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
      }
    }
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  onSelectResource(item) {
    this.metricsDataService.sendBarchartData(item);
  }

}
