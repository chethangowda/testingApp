import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { MetricsDataService } from '../metricDataServices/data.service';
import { UserDashboardService } from 'src/services/userdashboard.services';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  public pieChartOptions: ChartOptions = {};
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [];

  chartColors: any = ['#797bea', '#00ac7d', '#f7c244', '#5dd4fa', '#0083ef'];
  resourceName: any;
  constructor(private metricsDataService: MetricsDataService,
    private userDashboardService: UserDashboardService) {

    let self = this;
    this.pieChartOptions = {
      responsive: true,
      legend: {
        position: 'right',
        labels: {
          boxWidth: 21,
          fontSize: 10,
          fontColor: '#000000',
          usePointStyle: true
        },
        // onClick: function(event: MouseEvent, legendItem: ChartLegendLabelItem) {
        //     self.chartClicked(event);
        // }
      },
      tooltips: {
        bodyFontColor: '#FFFFFF',
        titleFontColor: '#FFFFFF'
      },
      plugins: {
        datalabels: {
          color: '#fff'
        }
      },
      elements: {
        line: {

        }
      },
      // legend: {
      //   position: 'top',
      // },
      // plugins: {
      //   datalabels: {
      //     formatter: (value, ctx) => {
      //       const label = ctx.chart.data.labels[ctx.dataIndex];
      //       return label;
      //     },
      //   },
      // }
    };

  }

  ngOnInit() {

    this.metricsDataService.barchartData.subscribe(data => {
      this.pieChartLabels = [];
      this.pieChartData = [];
      this.resourceName = data.resourceName;
      this.datasourceListByResource(data.resourceName);
    })

  }

  datasourceListByResource(resoiurceName) {
    this.userDashboardService.getDataourceByResource(resoiurceName).subscribe(data => {
      if (data) {
        for (let item of data) {
          this.pieChartData.push(item.resourceCount);
          this.pieChartLabels.push(item.datasourceName + '-' + item.datasourceId);
          // this.chartColors.push(this.getRandomColor());
          this.pieChartColors = [
            {
              backgroundColor: this.chartColors,
            },
          ];
        }
      }
    })
  }

  random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        const value = chart.data.datasets[0].data[clickedElementIndex];
        let dsName = label.split('-')[0];
        if (dsName == 'Other') {
          return;
        }
        let param = {
          value: value,
          label: label,
          resourcce: this.resourceName
        }
        this.metricsDataService.sendPiechartData(param);
      }

    }
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

}
