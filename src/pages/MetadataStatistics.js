import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import {APP_NAME} from '../constants/AppConstants';
import {statistics} from '../../server/config/api.config.json';
import StatisticsService from '../services/StatisticsService';
import StatisticsStore from '../stores/StatisticsStore';
import ReactHighcharts from 'react-highcharts';
import deepcopy from 'deepcopy';
import _ from 'lodash';
import '../stylesheets/GraphPage.less';

export default class MetadataStatistics extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.barChartConfig = {
      chart: {
        type: 'bar'
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
        pointFormat: '{point.name}: {point.y}'
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
        },
        series: {
          dataLabels:{
            enabled: true,
            formatter: function(){
              if(this.y > 0)
                return this.y;
            }
          }
        }
      },
      series: [{
        data: []
      }],
      exporting: {
        enabled: true,
        filename: 'chart'
      }
    };

    this.lineChartConfig = {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          year: '%Y'
        },
        tickInterval: Date.UTC(2010, 0, 1) - Date.UTC(2009, 0, 1)
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Anzahl'
        }
      },
      legend: {
        enabled: true
      },
      credits: {
        text: 'Ausschnitt wählen um heranzuzoomen.',
        enabled: true,
        position: {
          align: 'center'
        }
      },
      series: [],
      exporting: {
        enabled: true,
        filename: 'chart'
      }
    };

    this.state = {
      dates: StatisticsStore.dates,
      origin: StatisticsStore.origin,
      archive: StatisticsStore.archive
    };

    this.onStatisticsStoreChange = this.onStatisticsStoreChange.bind(this);
  }

  componentDidMount() {
    StatisticsStore.addChangeListener(this.onStatisticsStoreChange);

    if (StatisticsStore.dates.length <= 0) {
      StatisticsService.getStatistics('temporal');
    }
    if (!StatisticsStore.origin) {
      StatisticsService.getStatistics('origin');
    }
    if (!StatisticsStore.archive) {
      StatisticsService.getStatistics('archive');
    }
  }

  componentWillUnmount() {
    StatisticsStore.removeChangeListener(this.onStatisticsStoreChange);
  }

  onStatisticsStoreChange() {
    let {
      dates,
      origin,
      archive
    } = this.state;
    let nextDates = StatisticsStore.dates;
    let nextOrigin = StatisticsStore.origin;
    let nextArchive = StatisticsStore.archive;

    if (_.difference(dates, nextDates).length > 0) {
      let dateChart = this.refs.temporal.getChart();
      dateChart.series = nextDates;
    }
    if (_.difference(origin.labels, nextOrigin.labels).length > 0
      || _.difference(origin.values, nextOrigin.values).length > 0) {
      let originChart = this.refs.origin.getChart();
      originChart.series[0].setData(nextOrigin.values);
      originChart.xAxis.categories = nextOrigin.labels;
    }
    if (_.difference(archive.labels, nextArchive.labels).length > 0
      || _.difference(archive.values, nextArchive.values).length > 0) {
      let originChart = this.refs.archive.getChart();
      originChart.series[0].setData(nextArchive.values);
      originChart.xAxis.categories = nextArchive.labels;
    }


    this.setState({
      dates: nextDates,
      origin: nextOrigin,
      archive: nextArchive
    });
  }

  /**
   * Create a new config object for highcharts bar chart
   * @param {String} mode - The selected mode (for lookup in api config)
   * @param {object} data - The chart data
   * @returns {object} react-highcharts config object
   */
  getBarChartConfig(mode, data) {
    let chartConfig = deepcopy(this.barChartConfig);
    let sum = 0;
    if (data !== false) {
      sum = data.values.reduce((pv, cv) => pv + cv, 0);
    }
    chartConfig.title.text = statistics[mode].title;
    chartConfig.exporting.filename = statistics[mode].title;
    if (data !== false) {
      chartConfig.xAxis.categories = data.labels;
    }
    chartConfig.yAxis.title.text = statistics[mode].yAxis;
    chartConfig.tooltip.formatter = function() {
      return '<strong>' + this.key + ': ' + (this.y / sum * 100).toFixed(2) + '%</strong>';
    };
    if (data !== false) {
      chartConfig.series[0].data = data.values;
    }

    return chartConfig;
  }

  /**
   * Create a new config object for highcharts line chart
   * @param {String} mode - The selected mode (for lookup in api config)
   * @param {object} data - The chart data
   * @returns {object} react-highcharts config object
   */
  getLineChartConfig(mode, data) {
    let chartConfig = deepcopy(this.lineChartConfig);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.exporting.filename = statistics[mode].title;
    for (var i = 0; i < data.length; i++) {
      chartConfig.series.push({
        name: data[i].name,
        data: data[i].data
      });
    }

    return chartConfig;
  }

  render() {
    let {dates, origin, archive} = this.state;

    const temporalChart = this.getLineChartConfig('temporal', dates);
    const originChart = this.getBarChartConfig('origin', origin);
    const archiveChart = this.getBarChartConfig('archive', archive);

    return (
      <DocumentTitle title={`Metadaten // Statistik // ${APP_NAME}`}>
        <div>
          <div className="row charts-container">
            <div className="col-xs-12">
              <h1 className="text-center">Metadaten</h1>
              <div className="row">
                <div id="temporal-chart" className="chart zoom col-xs-12">
                  <ReactHighcharts config={temporalChart} ref="temporal" />
                </div>
              </div>
              <div className="row around-md">
                <div id="origin-chart" className="chart col-xs-12 col-md-5">
                  <ReactHighcharts config={originChart} ref="origin" />
                </div>
                <div id="origin-chart" className="chart col-xs-12 col-md-5">
                  <ReactHighcharts config={archiveChart} ref="archive" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}