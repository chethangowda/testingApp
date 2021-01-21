import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserDashboardService } from 'src/services/userdashboard.services';
import { MetricsDataService } from '../metrics/metricDataServices/data.service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-metrics-dashdoard',
  templateUrl: './metrics-dashdoard.component.html',
  styleUrls: ['./metrics-dashdoard.component.scss']
})
export class MetricsDashdoardComponent implements OnInit {

  sumOfPatientData: any;
  progressCss: any;
  resourceCount: any = [];
  selectedIndex: any;
  searchText: any;

  datasourceLoader: boolean = false;
  extractionLoader: boolean = false;
  resourcecLoader: boolean = false;


  public pieChartOptions: ChartOptions = {};
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [];
  chartColors: any = ['#797bea', '#00ac7d', '#f7c244', '#5dd4fa', '#0083ef', '#9309EF', '#EC4244', '#F5E9C1'];

  resourceName: any;
  selectedPirColor: any;



  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartColors: Array<any> = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Extraction', fill: true },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B', stack: 'a' }
  ];

  datasourceName: any;

  @ViewChild('graphdiv', { static: true }) inputEl: ElementRef;
  constructor(private metricsDataService: MetricsDataService,
    private userDashboardService: UserDashboardService,
    private datePipe: DatePipe) {


    let self = this;
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
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
    this.getResourceList();
  }

  getResourceList() {
    this.resourcecLoader = true;
    this.userDashboardService.getResourceCount().subscribe(data => {
      this.resourcecLoader = false;
      if (data) {
        this.sumOfPatientData = this.sum(data, 'resourceCount');

        for (let item of data) {
          item['value'] = Math.round((item.resourceCount * 100) / this.sumOfPatientData);
          this.progressCss = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

        }
        this.resourceCount = data;
      }
    }, error => {
      this.resourcecLoader = false;
    })
  }

  sum(array, key) {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
  }

  public setRow(_index: number) {
    this.selectedIndex = _index;
  }

  onSearch(event) {
    this.searchText = event.target.value;
  }

  onSelectResource(item) {
    this.datasourceName = undefined;
    this.resourceName = undefined;
    this.barChartData[0].data = [];
    this.barChartLabels = [];
    this.pieChartLabels = [];
    this.pieChartData = [];
    // this.resourceName = item.resourceName;
    this.datasourceListByResource(item.resourceName);
  }



  listOfDataSource: any = [];
  indexVal: number = 0;
  datasourceListByResource(resoiurceName) {
    this.datasourceLoader = true;
    this.userDashboardService.getDataourceByResource(resoiurceName).subscribe(data => {
      this.resourceName = resoiurceName;
      this.datasourceLoader = false;
      if (data) {
        this.listOfDataSource = new Array(Math.ceil(data.length / 7))
          .fill(1)
          .map(_ => data.splice(0, 7))
        this.generateChart(this.indexVal);
      }
    }, error => {
      this.datasourceLoader = false;
    })
  }

  onPrevious() {
    if (this.indexVal > 0) {
      this.indexVal--;
      this.generateChart(this.indexVal);
    }
  }

  onNext() {
    if (this.indexVal < this.listOfDataSource.length - 1) {
      this.indexVal++;
      this.generateChart(this.indexVal);
    }
  }

  generateChart(index) {
    this.pieChartData = [];
    this.pieChartLabels = [];
    for (let item of this.listOfDataSource[index]) {
      this.pieChartData.push(item.resourceCount);
      this.pieChartLabels.push(item.datasourceName + '-' + item.datasourceId);
      // this.chartColors.push('#'+ Math.floor(Math.random() * 16777216).toString(16));
      this.pieChartColors = [
        {
          backgroundColor: this.chartColors,
        },
      ];
    }
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 26)];
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
        this.selectedPirColor = chart.data.datasets[0].backgroundColor[clickedElementIndex];
        let dsName = label.split('-')[0];
        if (dsName == 'Other' || dsName == 'others') {
          return;
        }
        let param = {
          value: value,
          label: label,
          resourcce: this.resourceName
        }

        if (param) {
          this.barChartColors = [
            {
              backgroundColor: this.selectedPirColor,
              borderColor: this.selectedPirColor,
              pointBackgroundColor: this.selectedPirColor,
              pointBorderColor: this.selectedPirColor,
              pointHoverBackgroundColor: this.selectedPirColor,
              pointHoverBorderColor: this.selectedPirColor
            },
          ];
          let datasourceID = param.label.split('-')[1];
          this.extractionDetails(param.resourcce, datasourceID, param.label);
        }
      }

    }
  }

  extractionDetails(resource, datasourceID, dsName) {
    this.barChartData[0].data = [];
    this.barChartLabels = [];
    this.extractionLoader = true;
    this.userDashboardService.getExtractionListByDataourceandResource(resource, datasourceID).subscribe(data => {
      this.datasourceName = dsName;
      this.extractionLoader = false;
      if (data) {

        setTimeout(() => {
          this.inputEl.nativeElement.focus();
        })

        let tempExtCount = [];
        for (let item of data) {
          tempExtCount.push(item.resourceCount);
          if ('extractionDate' in item) {
            let tempDate = this.datePipe.transform(item.extractionDate, 'dd-MM-yyyy hh:mm a');
            this.barChartLabels.push(tempDate);
          }
        }

        this.barChartLabels = this.barChartLabels.reverse();
        this.barChartData[0].data = tempExtCount.reverse();

        for (let item = 0; this.barChartLabels.length <= 9; item++) {
          if (!this.barChartLabels[item]) {
            this.barChartLabels.push('');
            tempExtCount.push('');
          }
        }

      }
    }, error => {
      this.extractionLoader = false;
    })
  }

}
