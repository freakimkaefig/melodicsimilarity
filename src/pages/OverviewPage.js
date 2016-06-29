import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import {APP_NAME} from '../constants/AppConstants';
import {statistics} from '../../config/api.config.json';
import StatisticsService from '../services/StatisticsService';
import StatisticsStore from '../stores/StatisticsStore';
import ReactHighcharts from 'react-highcharts';
import deepcopy from 'deepcopy';
import '../stylesheets/OverviewPage.less';

export default class HomePage extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.barChartConfig = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        categories: []
      },
      yAxis: {
        min: 0,
        title: {
        }
      },
      tooltip: {
        pointFormat: '{point.key} {point.y}'
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        data: []
      }]
    };

    this.pieChartConfig = {
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{point.name} {point.percentage:-1f}%'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        data: []
      }]
    };

    this.state = {
      notes: StatisticsStore.notes,
      intervals: StatisticsStore.intervals,
      keys: StatisticsStore.keys
    };

    this.onStatisticsStoreChange = this.onStatisticsStoreChange.bind(this);
  }

  componentDidMount() {
    StatisticsStore.addChangeListener(this.onStatisticsStoreChange);

    if (StatisticsStore.notes.length <= 0) {
      StatisticsService.getStatistics('notes');
    }
    if (StatisticsStore.intervals.length <= 0) {
      StatisticsService.getStatistics('intervals');
    }
    if (StatisticsStore.keys.length <= 0) {
      StatisticsService.getStatistics('keys');
    }
  }

  componentWillUnmount() {
    StatisticsStore.removeChangeListener(this.onStatisticsStoreChange);
  }

  onStatisticsStoreChange() {
    this.updateChart(this.refs.notes, StatisticsStore.notes);
    this.updateChart(this.refs.intervals, StatisticsStore.intervals);
    this.updateChart(this.refs.keys, StatisticsStore.keys);

    this.setState({
      notes: StatisticsStore.notes,
      intervals: StatisticsStore.intervals,
      keys: StatisticsStore.keys
    });
  }

  updateChart(ref, data) {
    let chart = ref.getChart();
    chart.series[0].setData(data, true);
  }

  getBarChartConfig(mode, data) {
    let chartConfig = deepcopy(this.barChartConfig);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.xAxis.categories = statistics[mode].labels;
    chartConfig.yAxis.title.text = statistics[mode].yAxis;
    chartConfig.series[0].data = data;

    return chartConfig;
  }

  getPieChartConfig(mode, data) {
    let chartConfig = deepcopy(this.pieChartConfig);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.series[0].data = data;

    return chartConfig;
  }

  render() {
    let {notes, intervals, keys} = this.state;

    const notesChart = this.getBarChartConfig('notes', notes);
    const intervalChart = this.getBarChartConfig('intervals', intervals);
    const keyChart = this.getBarChartConfig('keys', keys);

    return (
      <DocumentTitle title={`Übersicht // ${APP_NAME}`}>
        <div>
          <div className="row">
            <div className="col-xs-12">
              <h1 className="text-center">Übersicht</h1>
              <div className="row">
                <div id="notes-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={notesChart} ref="notes" />
                </div>
                <div id="intervals-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={intervalChart} ref="intervals" />
                </div>
              </div>
              <div className="row">
                <div id="intervals-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={keyChart} ref="keys" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}