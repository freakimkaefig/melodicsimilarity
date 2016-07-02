import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import {APP_NAME} from '../constants/AppConstants';
import {statistics} from '../../config/api.config.json';
import StatisticsService from '../services/StatisticsService';
import StatisticsStore from '../stores/StatisticsStore';
import ReactHighcharts from 'react-highcharts';
require('highcharts-exporting')(ReactHighcharts.Highcharts);
import {TagCloud, defaultRenderer} from 'react-tagcloud';
import deepcopy from 'deepcopy';
import _ from 'lodash';
import '../stylesheets/OverviewPage.less';

export default class HomePage extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.columnChartConfig = {
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

    this.pieChartConfig = {
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '<strong>{point.key}: {point.percentage:.1f}%</strong>',
        formatter: function() {
          return '<strong>' + this.key + ': ' + this.percentage.toFixed(2) + '%</strong>';
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'default',
          dataLabels: {
            enabled: true,
            formatter: function() {
              if (this.y > 0) {
                return this.key + ': ' + this.y;
              }
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

    this.tagRenderer = defaultRenderer({
      colorOptions: {
        luminosity: 'dark',
        hue: 'random'
      },
      tagRenderer: (tag, size, handlers) => {
        return <span {...handlers} key={tag.value} className={`tag-${size}`}>{tag.value} ({tag.count})</span>;
      }
    });

    this.state = {
      notes: StatisticsStore.notes,
      intervals: StatisticsStore.intervals,
      durations: StatisticsStore.durations,
      rests: StatisticsStore.rests,
      keys: StatisticsStore.keys,
      meters: StatisticsStore.meters,
      dates: StatisticsStore.dates,
      origin: StatisticsStore.origin,
      archive: StatisticsStore.archive,
      singPlace: StatisticsStore.singPlace
    };

    this.onStatisticsStoreChange = this.onStatisticsStoreChange.bind(this);
    this.onMouseOverTag = this.onMouseOverTag.bind(this);
  }

  componentDidMount() {
    StatisticsStore.addChangeListener(this.onStatisticsStoreChange);

    if (StatisticsStore.notes.length <= 0) {
      StatisticsService.getStatistics('notes');
    }
    if (StatisticsStore.intervals.length <= 0) {
      StatisticsService.getStatistics('intervals');
    }
    if (StatisticsStore.durations.length <= 0) {
      StatisticsService.getStatistics('durations');
    }
    if (StatisticsStore.rests.length <= 0) {
      StatisticsService.getStatistics('rests');
    }
    if (StatisticsStore.keys.length <= 0) {
      StatisticsService.getStatistics('keys');
    }
    if (StatisticsStore.meters.length <= 0) {
      StatisticsService.getStatistics('meters');
    }
    if (StatisticsStore.dates.length <= 0) {
      StatisticsService.getStatistics('temporal');
    }
    if (!StatisticsStore.origin) {
      StatisticsService.getStatistics('origin');
    }
    if (!StatisticsStore.archive) {
      StatisticsService.getStatistics('archive');
    }
    if (StatisticsStore.singPlace.length <= 0) {
      StatisticsService.getStatistics('singPlace');
    }
  }

  componentWillUnmount() {
    StatisticsStore.removeChangeListener(this.onStatisticsStoreChange);
  }

  onStatisticsStoreChange() {
    let nextNotes = StatisticsStore.notes;
    let nextIntervals = StatisticsStore.intervals;
    let nextDurations = StatisticsStore.durations;
    let nextRests = StatisticsStore.rests;
    let nextKeys = StatisticsStore.keys;
    let nextMeters = StatisticsStore.meters;
    let nextDates = StatisticsStore.dates;
    let nextOrigin = StatisticsStore.origin;
    let nextArchive = StatisticsStore.archive;

    if (_.difference(this.state.notes, nextNotes).length > 0) {
      this.updateChart(this.refs.notes, nextNotes);
    }
    if (_.difference(this.state.intervals, nextIntervals).length > 0) {
      this.updateChart(this.refs.intervals, nextIntervals);
    }
    if (_.difference(this.state.durations, nextDurations).length > 0) {
      this.updateChart(this.refs.durations, nextDurations);
    }
    if (_.difference(this.state.rests, nextRests).length > 0) {
      this.updateChart(this.refs.rests, nextRests);
    }
    if (_.difference(this.state.keys, nextKeys).length > 0) {
      this.updateChart(this.refs.keys, nextKeys);
    }
    if (_.difference(this.state.meters, nextMeters).length > 0) {
      this.updateChart(this.refs.meters, nextMeters);
    }
    if (_.difference(this.state.dates, nextDates).length > 0) {
      let dateChart = this.refs.temporal.getChart();
      dateChart.series = nextDates;
    }
    if (_.difference(this.state.origin.labels, nextOrigin.labels).length > 0
      || _.difference(this.state.origin.values, nextOrigin.values).length > 0) {
      let originChart = this.refs.origin.getChart();
      originChart.series[0].setData(nextOrigin.values);
      originChart.xAxis.categories = nextOrigin.labels;
    }
    if (_.difference(this.state.archive.labels, nextArchive.labels).length > 0
      || _.difference(this.state.archive.values, nextArchive.values).length > 0) {
      let originChart = this.refs.archive.getChart();
      originChart.series[0].setData(nextArchive.values);
      originChart.xAxis.categories = nextArchive.labels;
    }

    this.setState({
      notes: nextNotes,
      intervals: nextIntervals,
      durations: nextDurations,
      rests: nextRests,
      keys: nextKeys,
      meters: nextMeters,
      dates: nextDates,
      origin: nextOrigin,
      archive: nextArchive,
      singPlace: StatisticsStore.singPlace
    });
  }

  updateChart(ref, data) {
    let chart = ref.getChart();
    chart.series[0].setData(data, true);
  }

  getColumnChartConfig(mode, data) {
    let chartConfig = deepcopy(this.columnChartConfig);
    let sum = data.reduce((pv, cv) => pv + cv, 0);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.exporting.filename = statistics[mode].title;
    chartConfig.xAxis.categories = statistics[mode].labels;
    chartConfig.yAxis.title.text = statistics[mode].yAxis;
    chartConfig.tooltip.formatter = function() {
      return '<strong>' + this.key + ': ' + (this.y / sum * 100).toFixed(2) + '%</strong>';
    };
    chartConfig.series[0].data = data;

    return chartConfig;
  }

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

  getPieChartConfig(mode, data) {
    let chartConfig = deepcopy(this.pieChartConfig);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.exporting.filename = statistics[mode].title;
    chartConfig.series[0].data = data;

    return chartConfig;
  }

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

  onMouseOverTag(tag) {
    alert(tag.count);
  }

  render() {
    let {notes, intervals, durations, rests, keys, meters, dates, origin, archive, singPlace} = this.state;

    const notesChart = this.getColumnChartConfig('notes', notes);
    const intervalsChart = this.getColumnChartConfig('intervals', intervals);
    const durationsChart = this.getPieChartConfig('durations', durations);
    const restsChart = this.getPieChartConfig('rests', rests);
    const keysChart = this.getColumnChartConfig('keys', keys);
    const metersChart = this.getPieChartConfig('meters', meters);
    const temporalChart = this.getLineChartConfig('temporal', dates);
    const originChart = this.getBarChartConfig('origin', origin);
    const archiveChart = this.getBarChartConfig('archive', archive);

    return (
      <DocumentTitle title={`Übersicht // ${APP_NAME}`}>
        <div>
          <div className="row charts-container">
            <div className="col-xs-12">
              <h1 className="text-center">Übersicht</h1>
              <div className="row">
                <div id="temporal-chart" className="chart zoom col-xs-12">
                  <ReactHighcharts config={temporalChart} ref="temporal" />
                </div>
              </div>
              <div className="row">
                <div id="notes-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={notesChart} ref="notes" />
                </div>
                <div id="intervals-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={intervalsChart} ref="intervals" />
                </div>
              </div>
              <div className="row around-md">
                <div id="durations-chart" className="chart col-xs-12 col-md-4">
                  <ReactHighcharts config={durationsChart} ref="durations" />
                </div>
                <div id="rests-chart" className="chart col-xs-12 col-md-4">
                  <ReactHighcharts config={restsChart} ref="rests" />
                </div>
              </div>
              <div className="row around-md">
                <div id="keys-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={keysChart} ref="keys" />
                </div>
                <div id="meters-chart" className="chart col-xs-12 col-md-4">
                  <ReactHighcharts config={metersChart} ref="meters" />
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
              <div className="row">
                <div className="col-xs-6">
                  <h3>Top 20 Sangesorte</h3>
                  <TagCloud minSize={12} maxSize={28} tags={singPlace} renderer={this.tagRenderer} onClick={this.onMouseOverTag}  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}