import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import LoadingOverlay from '../components/LoadingOverlay';
import {APP_NAME} from '../constants/AppConstants';
import {statistics} from '../../server/config/api.config.json';
import {COLORS} from '../constants/StatisticsConstants';
import StatisticsService from '../services/StatisticsService';
import StatisticsStore from '../stores/StatisticsStore';
import ReactHighcharts from 'react-highcharts';
import deepcopy from 'deepcopy';
import _ from 'lodash';
import '../stylesheets/GraphPage.less';

export default class MelodyStatistics extends React.Component {
  static displayName = 'MelodyStatistics';
  static propTypes = {};

  constructor(props) {
    super(props);

    this.columnChartConfig = {
      chart: {
        type: 'column'
      },
      colors: COLORS,
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

    this.polarColumnConfig = {
      chart: {
        polar: true,
        type: 'column'
      },
      colors: COLORS,
      title: {
        text: ''
      },
      xAxis: {
        tickmarkPlacement: 'on',
        categories: []
      },
      yAxis: {
        gridLineInterpolation: 'circle',
        min: 0
      },
      tooltip: {
        pointFormat: '{point.y} ({point.percentage})'
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
        data: [],
        pointPlacement: 'on'
      }],
      exporting: {
        enabled: true,
        filename: 'chart'
      }
    };

    this.boxplotConfig = {
      chart: {
        type: 'boxplot'
      },
      colors: COLORS,
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      series: [],
      exporting: {
        enabled: true,
        filename: 'chart'
      }
    };

    this.state = {
      songsheetsCount: StatisticsStore.songsheetsCount,
      notes: StatisticsStore.notes,
      intervals: StatisticsStore.intervals,
      durations: StatisticsStore.durations,
      rests: StatisticsStore.rests,
      keys: StatisticsStore.keys,
      meters: StatisticsStore.meters,
      counts: StatisticsStore.counts,
    };

    this.onStatisticsStoreChange = this.onStatisticsStoreChange.bind(this);
  }

  componentDidMount() {
    StatisticsStore.addChangeListener(this.onStatisticsStoreChange);

    if (StatisticsStore.notes.values.length <= 0) {
      StatisticsService.getStatistics('notes');
    }
    if (StatisticsStore.intervals.values.length <= 0) {
      StatisticsService.getStatistics('intervals');
    }
    if (StatisticsStore.durations.values.length <= 0) {
      StatisticsService.getStatistics('durations');
    }
    if (StatisticsStore.rests.values.length <= 0) {
      StatisticsService.getStatistics('rests');
    }
    if (StatisticsStore.keys.values.length <= 0) {
      StatisticsService.getStatistics('keys');
    }
    if (StatisticsStore.meters.values.length <= 0) {
      StatisticsService.getStatistics('meters');
    }
    if (StatisticsStore.counts.length <= 0) {
      StatisticsService.getStatistics('counts');
    }
  }

  componentWillUnmount() {
    StatisticsStore.removeChangeListener(this.onStatisticsStoreChange);
  }

  onStatisticsStoreChange() {
    let {
      notes,
      intervals,
      durations,
      rests,
      keys,
      meters,
      counts
    } = this.state;
    let nextNotes = StatisticsStore.notes;
    let nextIntervals = StatisticsStore.intervals;
    let nextDurations = StatisticsStore.durations;
    let nextRests = StatisticsStore.rests;
    let nextKeys = StatisticsStore.keys;
    let nextMeters = StatisticsStore.meters;
    let nextCounts = StatisticsStore.counts;

    if (_.difference(notes.values, nextNotes.values).length > 0) {
      this.updateChart(this.refs.notes, nextNotes.labels, nextNotes.values);
    }
    if (_.difference(intervals.values, nextIntervals.values).length > 0) {
      this.updateChart(this.refs.intervals, nextIntervals.labels, nextIntervals.values);
    }
    if (_.difference(durations.values, nextDurations.values).length > 0) {
      this.updateChart(this.refs.durations, nextDurations.labels, nextDurations.values);
    }
    if (_.difference(rests.values, nextRests.values).length > 0) {
      this.updateChart(this.refs.rests, nextRests.labels, nextRests.values);
    }
    if (_.difference(keys.values, nextKeys.values).length > 0) {
      this.updateChart(this.refs.keys, nextKeys.labels, nextKeys.values);
    }
    if (_.difference(meters.values, nextMeters.values).length > 0) {
      this.updateChart(this.refs.meters, nextMeters.labels, nextMeters.values);
    }
    if (_.difference(counts, nextCounts).length > 0) {
      let countsChart = this.refs.counts.getChart();
      countsChart.series = nextCounts;
    }

    this.setState({
      songsheetsCount: StatisticsStore.songsheetsCount,
      notes: nextNotes,
      intervals: nextIntervals,
      durations: nextDurations,
      rests: nextRests,
      keys: nextKeys,
      meters: nextMeters,
      counts: nextCounts
    });
  }

  /**
   * Rerender chart when new data received
   * @param {object} ref - React reference to component
   * @param {Array} labels - The new labels
   * @param {Array} data - The new data
   */
  updateChart(ref, labels, data) {
    console.log("updateChart", ref);
    let chart = ref.getChart();
    chart.xAxis.categories = labels;
    chart.series[0].setData(data, true);
  }

  /**
   * Create a new config object for highcharts column chart
   * @param {String} mode - The selected mode (for lookup in api config)
   * @param {Array} labels - The chart labels
   * @param {Array} data - The chart data
   * @returns {object} react-highcharts config object
   */
  getColumnChartConfig(mode, labels, data) {
    let chartConfig = deepcopy(this.columnChartConfig);
    let sum = data.reduce((pv, cv) => pv + cv, 0);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.exporting.filename = statistics[mode].title;
    if (data !== false) {
      chartConfig.xAxis.categories = labels;
    }
    chartConfig.yAxis.title.text = statistics[mode].yAxis;
    chartConfig.tooltip.formatter = function() {
      return '<strong>' + this.key + ': ' + (this.y / sum * 100).toFixed(2) + '%</strong>';
    };
    chartConfig.series[0].data = data;

    return chartConfig;
  }

  /**
   * Create a new config object for highcharts polar column chart
   * @param {String} mode - The selected mode (for lookup in api config)
   * @param {Array} labels - The chart labels
   * @param {Array} data - The chart data
   * @returns {object} react-highcharts config object
   */
  getPolarColumnChartConfig(mode, labels, data) {
    let chartConfig = deepcopy(this.polarColumnConfig);
    let sum = data.reduce((pv, cv) => pv + cv, 0);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.exporting.filename = statistics[mode].title;
    if (data !== false) {
      chartConfig.xAxis.categories = labels;
    }
    chartConfig.tooltip.formatter = function() {
      return '<strong>' + this.key + ': ' + (this.y / sum * 100).toFixed(2) + '%</strong>';
    };
    chartConfig.series[0].data = data;

    return chartConfig;
  }

  /**
   * Create a new config object for highcharts boxplot chart
   * @param {String} mode - The selected mode (for lookup in api config)
   * @param {object} data - The chart data
   * @returns {object} react-highcharts config object
   */
  getBoxplotChartConfig(mode, data) {
    let chartConfig = deepcopy(this.boxplotConfig);
    chartConfig.title.text = statistics[mode].title;
    chartConfig.exporting.filename = statistics[mode].title;
    chartConfig.subtitle.text = statistics[mode].subtitle;
    chartConfig.xAxis.categories = statistics[mode].labels;
    chartConfig.series = data;

    return chartConfig;
  }

  render() {
    let {
      songsheetsCount,
      notes,
      intervals,
      durations,
      rests,
      keys,
      meters,
      counts
    } = this.state;

    let ready = notes.values.length > 0
      && intervals.values.length > 0
      && durations.values.length > 0
      && rests.values.length > 0
      && keys.values.length > 0
      && meters.values.length > 0
      && counts.length > 0;

    const notesChart = this.getColumnChartConfig('notes', notes.labels, notes.values);
    const intervalsChart = this.getColumnChartConfig('intervals', intervals.labels, intervals.values);
    const durationsChart = this.getColumnChartConfig('durations', durations.labels, durations.values);
    const restsChart = this.getColumnChartConfig('rests', rests.labels, rests.values);
    const keysChart = this.getPolarColumnChartConfig('keys', keys.labels, keys.values);
    const metersChart = this.getColumnChartConfig('meters', meters.labels, meters.values);
    const countsChart = this.getBoxplotChartConfig('counts', counts);

    return (
      <DocumentTitle title={`Melodieinformationen // Statistik // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={!ready} />
          <div className="row charts-container">
            <div className="col-xs-12">
              <div className="row text-center">
                <div className="col-xs-12 col-sm-8 col-sm-offset-2">
                  <h1>Melodieinformationen</h1>
                  <p>
                    Die hier aufgeführten Graphen geben Aufschluss über verschiedene melodische Dimensionen. Dabei
                    beziehen sich die berechneten Werte der Analyse auf das gesamte Liedblatt-Korpus. Aktuell
                    sind <strong>{songsheetsCount}</strong> Liedblätter im Korpus enthalten.
                  </p>
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
                <div id="durations-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={durationsChart} ref="durations" />
                </div>
                <div id="rests-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={restsChart} ref="rests" />
                </div>
              </div>
              <div className="row around-md">
                <div id="meters-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={metersChart} ref="meters" />
                </div>
                <div id="counts-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={countsChart} ref="counts" />
                </div>
              </div>
              <div className="row around-md">
                <div id="keys-chart" className="chart col-xs-12">
                  <ReactHighcharts config={keysChart} ref="keys" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}