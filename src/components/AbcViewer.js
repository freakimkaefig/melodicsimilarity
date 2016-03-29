import React from 'react';
import AbcStore from '../stores/AbcStore';
import { convert2Abc } from 'musicjson2abc';

require('script!../../lib/abcjs_basic_2.3-min.js');

export default class AbcViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      json: {},
      parserParams: {},
      renderParams: {},
      engraverParams: {
        add_classes: true,
        listener: {
          highlight: this._onHighlight,
          modelChanged: this._modelChanged
        }
      }
    };
  }

  componentDidMount() {
    AbcStore.addChangeListener(this._onJsonChange);
  }

  componentWillUnmount() {
    AbcStore.removeChangeListener(this._onJsonChange);
  }

  _onHighlight() {}

  _modelChanged() {}

  _onJsonChange = () => {
    this.setState({json: AbcStore.json});
    var notation = document.getElementById('notation');
    ABCJS.renderAbc('notation', convert2Abc(JSON.stringify(AbcStore.json)), this.state.parserParams, this.state.engraverParams, this.state.renderParams);
  }

  render() {
    return (
      <div id="notation"></div>
    )
  }
}