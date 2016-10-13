import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import LoadingOverlay from '../components/LoadingOverlay';
import {APP_NAME} from '../constants/AppConstants';
import {statistics} from '../../server/config/api.config.json';
import StatisticsService from '../services/StatisticsService';
import StatisticsStore from '../stores/StatisticsStore';
import SettingsStore from '../stores/SettingsStore';
import {
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import vis from 'vis';
import $ from 'jquery';
import '../stylesheets/GraphPage.less';

export default class SimilarityStatistics extends React.Component {
  static displayName = 'SimilarityStatistics';
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      threshold: SettingsStore.settings['threshold'].value,
      network: null,
      nodeCount: StatisticsStore.nodeCount,
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
    let nextThreshold = SettingsStore.settings['threshold'].value;
    let nextGraphNodeIds = StatisticsStore.graph.nodes.map(item => {
      return item.id;
    });

    if (StatisticsStore.nodeCount === nextGraphNodeIds.length || this.state.threshold != nextThreshold) {
      this.drawNetwork();
    }
  }

  drawNetwork() {
    let threshold = SettingsStore.settings['threshold'].value;
    let graphData = StatisticsStore.graph;

    let nodesDataset = new vis.DataSet(graphData.nodes);
    let edgesDataset = new vis.DataSet(graphData.edges.filter(item => {
      return item.length > threshold * 1000;
    }));
    let allNodes = nodesDataset.get({returnType: 'Object'});

    var container = document.getElementById('songsheet-network');
    var options = {
      width: '100%',
      height: '100%',
      nodes: {
        shape: 'dot',
        size: 15,
        mass: 5,
        scaling: {
          label: {
            min: 8,
            max: 30,
            drawThreshold: 12,
            maxVisible: 20
          }
        },
        font: {
          size: 12,
          face: '"Source Sans Pro", Calibri, Candara, Arial, sans-serif'
        }
      },
      edges: {
        color: {inherit: 'from'},
        smooth: {
          type: 'continuous'
        },
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
          face: '"Source Sans Pro", Calibri, Candara, Arial, sans-serif'
        }
      },
      layout: {
        randomSeed: 1,
        improvedLayout: true
      },
      physics: false,
      interaction: {
        tooltipDelay: 100,
        hideEdgesOnDrag: true,
        navigationButtons: true
      }
    };
    var data = {
      nodes: nodesDataset,
      edges: edgesDataset
    };

    let network = new vis.Network(container, data, options);
    network.setData({
      nodes: nodesDataset,
      edges: edgesDataset
    });

    this.setState({
      threshold: threshold,
      network: network,
      nodeCount: StatisticsStore.nodeCount,
      graphData: graphData,
      nodesDataset: nodesDataset,
      edgesDataset: edgesDataset,
      allNodes: allNodes
    });

    network.on('click', this.neighbourhoodHighlight);
    this.autoHeight();
  }

  neighbourhoodHighlight(params) {
    let {network, nodesDataset, allNodes, highlightActive} = this.state;

    // if something is selected:
    if (params.nodes.length > 0) {
      highlightActive = true;
      var i, nodeId;
      var selectedNode = params.nodes[0];

      // mark all nodes as hard to read.
      for (nodeId in allNodes) {
        if (!allNodes.hasOwnProperty(nodeId)) continue;
        allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
        if (allNodes[nodeId].hiddenLabel === undefined) {
          allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
          allNodes[nodeId].label = undefined;
        }
      }
      var connectedNodes = network.getConnectedNodes(selectedNode);

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
      for (nodeId in allNodes) {
        if (!allNodes.hasOwnProperty(nodeId)) continue;
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
      network: network,
      nodeDataset: nodesDataset,
      allNodes: allNodes,
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

    let tutorial = (
      <Popover title="Melodic Similarity Netzwerkdiagramm" id="network-tutorial">
        <p>
          Das Netzwerkdiagramm zeigt Ähnlichkeitsbeziehungen zwischen den Liedblättern.
          Die Kanten spiegeln dabei die Melodic Similarity wider.
          Die Farben signalisieren die unterschiedliche Herkunft (Landschaftsarchiv).
        </p>
        <p>Durch Bewegung des Mausrads, oder durch Pinch-Gesten kann der Diagrammausschnitt verkleinert bzw. vergrößert werden.</p>
        <p>Durch Mausbewegung über einen Knoten werden zusätzliche Informationen eingeblendet.</p>
        <p>Durch Mausbewegung über eine Verbindungslinie wird der Ähnlichkeitswert eingeblendet.</p>
        <p>Die Knoten lassen sich mit gedrückter Maustaste beliebig verschieben.</p>
        <p>Durch einen Klick auf einen Knoten, werden lediglich dessen direkte Beziehungen hervorgehoben. Ein Klick in den leeren Bereich beendet diesen Modus.</p>
      </Popover>
    );

    return (
      <DocumentTitle title={`Melodische Ähnlichkeit // Statistik // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={!ready} />
          <div className="row charts-container">
            <div className="col-sm-10 col-sm-offset-1 network-container">
              <h1 className="text-center">Melodische Ähnlichkeit</h1>
              <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={tutorial}>
                <span className="network-help"><span className="fa fa-question-circle"></span></span>
              </OverlayTrigger>
              <div id="songsheet-network" />
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}