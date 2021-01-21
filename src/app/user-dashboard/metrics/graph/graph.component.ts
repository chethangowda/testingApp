import { Component, OnInit, ViewChild, Renderer2, ElementRef, Renderer, NgZone } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { UserDashboardService } from 'src/services/userdashboard.services';
import { MetricsDataService } from '../metricDataServices/data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  datasourceName: any;
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public chartColors: Array<any> = [
    {
      backgroundColor: '#bfe0fb',
      borderColor: '#68b5f5',
      pointBackgroundColor: '#0083ef',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#0083ef'
    },
  ];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Extraction', fill: true },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B', stack: 'a' }
  ];
  @ViewChild('graphdiv', { static: true }) inputEl: ElementRef;
  constructor(private userDashboardService: UserDashboardService,
    private metricsDataService: MetricsDataService,
    private datePipe: DatePipe,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private renderer: Renderer) { }

  @ViewChild('myCanvas', { static: true })
  public canvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public chartType: string = 'line';
  public chartData: any[];
  public chartLabels: any[];
  public chartColorsl: any[];
  public chartOptions: any;

  ngOnInit() {
    this.metricsDataService.piechartData.subscribe(data => {
      this.datasourceName = data.label
      if (data) {
        let datasourceID = data.label.split('-')[1];
        this.extractionDetails(data.resourcce, datasourceID);
      }
    })

    this.metricsDataService.barchartData.subscribe(data => {
      this.barChartData[0].data = [];
      this.barChartLabels = [];
    })


    this.chartColorsl = [{
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: 'rgba(0, 0, 0, 1)'
    }];
    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      // scales: {
      //   yAxes: [{
      //     ticks: {
      //       beginAtZero: true,
      //       stepSize: 1
      //     }
      //   }]
      // },
      annotation: {
        drawTime: 'beforeDatasetsDraw',
        annotations: [{
          type: 'box',
          id: 'a-box-1',
          yScaleID: 'y-axis-0',
          yMin: 0,
          yMax: 1,
          backgroundColor: '#4cf03b'
        }, {
          type: 'box',
          id: 'a-box-2',
          yScaleID: 'y-axis-0',
          yMin: 1,
          yMax: 2.7,
          backgroundColor: '#fefe32'
        }, {
          type: 'box',
          id: 'a-box-3',
          yScaleID: 'y-axis-0',
          yMin: 2.7,
          yMax: 5,
          backgroundColor: '#fe3232'
        }]
      }
    }

  }

  extractionDetails(resource, datasourceID) {
    this.barChartData[0].data = [];
    this.barChartLabels = [];
    this.userDashboardService.getExtractionListByDataourceandResource(resource, datasourceID).subscribe(data => {
      if (data) {


        let tempExtCount = [];
        for (let item of data) {
          tempExtCount.push(item.resourceCount);
          if ('extractionDate' in item) {
            let tempDate = this.datePipe.transform(item.extractionDate, 'dd-MM-yyyy hh:mm a');
            this.barChartLabels.push(tempDate);
          }
        }
        setTimeout(() => {
          this.inputEl.nativeElement.focus();
        })

        this.barChartLabels = this.barChartLabels.reverse();
        this.barChartData[0].data = tempExtCount.reverse();
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

}
