import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import {APP_NAME} from '../constants/AppConstants';
import {statistics} from '../../config/api.config.json';
import StatisticsService from '../services/StatisticsService';
import StatisticsStore from '../stores/StatisticsStore';
import ReactHighcharts from 'react-highcharts';
require('highcharts-exporting')(ReactHighcharts.Highcharts);
require('highcharts-more')(ReactHighcharts.Highcharts);
import vis from 'vis';
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
          },
          showInLegend: true
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

    this.boxplotConfig = {
      chart: {
        type: 'boxplot'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: '',
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
      notes: StatisticsStore.notes,
      intervals: StatisticsStore.intervals,
      durations: StatisticsStore.durations,
      rests: StatisticsStore.rests,
      keys: StatisticsStore.keys,
      meters: StatisticsStore.meters,
      counts: StatisticsStore.counts, 
      dates: StatisticsStore.dates,
      origin: StatisticsStore.origin,
      archive: StatisticsStore.archive,
      network: null,
      nodeDataset: null,
      edgesDataset: null,
      allNodes: null,
      highlightActive: false
    };

    this.onStatisticsStoreChange = this.onStatisticsStoreChange.bind(this);
    this.drawNetwork = this.drawNetwork.bind(this);
    this.neighbourhoodHighlight = this.neighbourhoodHighlight.bind(this);
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
    if (StatisticsStore.counts.length <= 0) {
      StatisticsService.getStatistics('counts');
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
  }

  componentWillUnmount() {
    StatisticsStore.removeChangeListener(this.onStatisticsStoreChange);
  }

  onStatisticsStoreChange() {
    let {notes, intervals, durations, rests, keys, meters, counts, dates, origin, archive} = this.state;
    let nextNotes = StatisticsStore.notes;
    let nextIntervals = StatisticsStore.intervals;
    let nextDurations = StatisticsStore.durations;
    let nextRests = StatisticsStore.rests;
    let nextKeys = StatisticsStore.keys;
    let nextMeters = StatisticsStore.meters;
    let nextCounts = StatisticsStore.counts;
    let nextDates = StatisticsStore.dates;
    let nextOrigin = StatisticsStore.origin;
    let nextArchive = StatisticsStore.archive;

    if (_.difference(notes, nextNotes).length > 0) {
      this.updateChart(this.refs.notes, nextNotes);
    }
    if (_.difference(intervals, nextIntervals).length > 0) {
      this.updateChart(this.refs.intervals, nextIntervals);
    }
    if (_.difference(durations, nextDurations).length > 0) {
      this.updateChart(this.refs.durations, nextDurations);
    }
    if (_.difference(rests, nextRests).length > 0) {
      this.updateChart(this.refs.rests, nextRests);
    }
    if (_.difference(keys, nextKeys).length > 0) {
      this.updateChart(this.refs.keys, nextKeys);
    }
    if (_.difference(meters, nextMeters).length > 0) {
      this.updateChart(this.refs.meters, nextMeters);
    }
    if (_.difference(counts, nextCounts).length > 0) {
      let countsChart = this.refs.counts.getChart();
      countsChart.series = nextCounts;
    }
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

    if (network === null) {
      this.drawNetwork();
    }

    this.setState({
      notes: nextNotes,
      intervals: nextIntervals,
      durations: nextDurations,
      rests: nextRests,
      keys: nextKeys,
      meters: nextMeters,
      counts: nextCounts,
      dates: nextDates,
      origin: nextOrigin,
      archive: nextArchive
    });
  }

  updateChart(ref, data) {
    let chart = ref.getChart();
    chart.series[0].setData(data, true);
  }

  drawNetwork() {
    var nodesDataset = new vis.DataSet([
      {id: 'A 59141b', label: 'A 59141b', group: 1},
      {id: 'A 59116', label: 'A 59116', group: 1},
      {id: 'A 59115', label: 'A 59115', group: 1},
      {id: 'A 59142', label: 'A 59142', group: 1},
      {id: 'A 59143', label: 'A 59143', group: 1},
      {id: 'A 59144', label: 'A 59144', group: 1},
      {id: 'A 59114', label: 'A 59114', group: 2},
      {id: 'A 59122', label: 'A 59122', group: 2},
      {id: 'A 59123', label: 'A 59123', group: 2},
      {id: 'A 59124', label: 'A 59124', group: 2}
    ]);
    var edgesDataset = new vis.DataSet([
      {from: 'A 59141b', to: 'A 59116', length: 100},
      {from: 'A 59141b', to: 'A 59115', length: 45},
      {from: 'A 59116', to: 'A 59114', length: 84},
      {from: 'A 59116', to: 'A 59142', length: 84},
      {from: 'A 59116', to: 'A 59143', length: 84},
      {from: 'A 59116', to: 'A 59144', length: 84},
      {from: 'A 59114', to: 'A 59122', length: 86},
      {from: 'A 59114', to: 'A 59123', length: 86},
      {from: 'A 59114', to: 'A 59124', length: 86}
    ]);
    var container = document.getElementById('songsheet-network');
    var options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 30,
          label: {
            min: 8,
            max: 30,
            drawThreshold: 12,
            maxVisible: 20
          }
        },
        font: {
          size: 12,
          face: 'Roboto'
        }
      },
      edges: {
        width: 2,
        color: {inherit: 'from'},
        smooth: {
          type: 'continuous'
        }
      },
      interaction: {
        dragNodes: false
      }
    };
    var data = {
      nodes: nodesDataset,
      edges: edgesDataset
    };

    var network = new vis.Network(container, data, options);
    var allNodes = nodesDataset.get({returnType:'Object'});
    this.setState({
      network: network,
      allNodes: allNodes,
      nodesDataset: nodesDataset,
      edgesDataset: edgesDataset
    });

    network.on('click', this.neighbourhoodHighlight);
  }

  neighbourhoodHighlight(params) {
    let {network, nodesDataset, allNodes, highlightActive} = this.state;

    // if something is selected:
    if (params.nodes.length > 0) {
      highlightActive = true;
      var i,j;
      var selectedNode = params.nodes[0];
      var degrees = 1;

      // mark all nodes as hard to read.
      for (var nodeId in allNodes) {
        allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
        if (allNodes[nodeId].hiddenLabel === undefined) {
          allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
          allNodes[nodeId].label = undefined;
        }
      }
      var connectedNodes = network.getConnectedNodes(selectedNode);
      var allConnectedNodes = [];

      // get the second degree nodes
      for (i = 1; i < degrees; i++) {
        for (j = 0; j < connectedNodes.length; j++) {
          allConnectedNodes = allConnectedNodes.concat(network.getConnectedNodes(connectedNodes[j]));
        }
      }

      // all second degree nodes get a different color and their label back
      for (i = 0; i < allConnectedNodes.length; i++) {
        allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
        if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
          allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
          allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
        }
      }

      // all first degree nodes get their own color and their label back
      for (i = 0; i < connectedNodes.length; i++) {
        allNodes[connectedNodes[i]].color = undefined;
        if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
          allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
          allNodes[connectedNodes[i]].hiddenLabel = undefined;
        }
      }

      // the main node gets its own color and its label back.
      allNodes[selectedNode].color = undefined;
      if (allNodes[selectedNode].hiddenLabel !== undefined) {
        allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
        allNodes[selectedNode].hiddenLabel = undefined;
      }
    }
    else if (highlightActive === true) {
      // reset all nodes
      for (var nodeId in allNodes) {
        allNodes[nodeId].color = undefined;
        if (allNodes[nodeId].hiddenLabel !== undefined) {
          allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
          allNodes[nodeId].hiddenLabel = undefined;
        }
      }
      highlightActive = false;
    }

    // transform the object into an array
    var updateArray = [];
    for (nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodesDataset.update(updateArray);

    this.setState({
      nodeDataset: nodesDataset,
      highlightActive: highlightActive
    });
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
    let {notes, intervals, durations, rests, keys, meters, counts, dates, origin, archive} = this.state;

    const notesChart = this.getColumnChartConfig('notes', notes);
    const intervalsChart = this.getColumnChartConfig('intervals', intervals);
    const durationsChart = this.getPieChartConfig('durations', durations);
    const restsChart = this.getPieChartConfig('rests', rests);
    const keysChart = this.getColumnChartConfig('keys', keys);
    const metersChart = this.getPieChartConfig('meters', meters);
    const countsChart = this.getBoxplotChartConfig('counts', counts);
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
                <div id="meters-chart" className="chart col-xs-12 col-md-4">
                  <ReactHighcharts config={metersChart} ref="meters" />
                </div>
              </div>
              <div className="row around-md">
                <div id="keys-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={keysChart} ref="keys" />
                </div>
                <div id="counts-chart" className="chart col-xs-12 col-md-6">
                  <ReactHighcharts config={countsChart} ref="counts" />
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
                <div className="col-xs-12">
                  <div id="songsheet-network" style={{height: '800px'}}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}