import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import LoadingOverlay from '../components/LoadingOverlay';
import {APP_NAME} from '../constants/AppConstants';
import {statistics} from '../../server/config/api.config.json';
import StatisticsService from '../services/StatisticsService';
import StatisticsStore from '../stores/StatisticsStore';
import SettingsStore from '../stores/SettingsStore';
import vis from 'vis';
import $ from 'jquery';
import '../stylesheets/GraphPage.less';

export default class SimilarityStatistics extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      network: null,
      graphData: StatisticsStore.graph,
      nodeDataset: null,
      edgesDataset: null,
      allNodes: null,
      highlightActive: false
    };

    this.onStoreChange = this.onStoreChange.bind(this);
    this.drawNetwork = this.drawNetwork.bind(this);
    this.autoHeight = this.autoHeight.bind(this);
    this.neighbourhoodHighlight = this.neighbourhoodHighlight.bind(this);
  }

  componentDidMount() {
    StatisticsStore.addChangeListener(this.onStoreChange);
    SettingsStore.addChangeListener(this.onStoreChange);

    StatisticsService.getStatistics('similarity');
    this.drawNetwork();
  }

  componentWillUnmount() {
    StatisticsStore.removeChangeListener(this.onStoreChange);
    SettingsStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    let {
      network
    } = this.state;
    let nextGraphData = StatisticsStore.graph;

    // console.log(nextGraphData, SettingsStore.settings['threshold'].value * 1000);
    network.setData({
      nodes: new vis.DataSet(nextGraphData.nodes),
      edges: new vis.DataSet(nextGraphData.edges)
    });

    this.setState({
      graphData: nextGraphData
    });
  }

  drawNetwork() {
    var nodesDataset = new vis.DataSet([]);
    var edgesDataset = new vis.DataSet([]);

    var container = document.getElementById('songsheet-network');
    var options = {
      width: '100%',
      height: '100%',
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
      physics: true,
      interaction: {
        tooltipDelay: 10,
        hideEdgesOnDrag: true
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
    this.autoHeight();
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

  autoHeight() {
    var $network = $('#songsheet-network');
    var height = $network.height();
    var newHeight = $(window).height() - $('.header').height() - $('.footer').height() - 200;
    if (newHeight !== height) {
      $network.height(newHeight);
    }
  }

  render() {
    let {
      graphData
    } = this.state;
    let ready = graphData.nodes.length > 0
      && graphData.edges.length > 0;

    return (
      <DocumentTitle title={`Melodische Ähnlichkeit // Statistik // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={!ready} />
          <div className="row charts-container">
            <div className="col-sm-10 col-sm-offset-1">
              <h1 className="text-center">Melodische Ähnlichkeit</h1>
              <div id="songsheet-network" />
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}