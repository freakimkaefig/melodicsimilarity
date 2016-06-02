import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Melody from './MelodicSearchbox/Melody';
import Intervals from './MelodicSearchbox/Intervals';
import ParsonsCode from './MelodicSearchbox/ParsonsCode';
import '../../stylesheets/MelodicSearchbox.less';

export default class MelodicSearchbox extends React.Component {
  constructor(props) {
    super(props);

  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("MelodySearchbox Submit");
  }

  render() {
    return (
      <Tabs defaultActiveKey={1} id="melodicsearchbox">
        <Tab eventKey={1} title="Melodie">
          <Melody />
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="row">

            </div>
          </form>
        </Tab>
        <Tab eventKey={2} title="Intervalle">
          <Intervals />
        </Tab>
        <Tab eventKey={3} title="Parsons Code">
          <ParsonsCode />
        </Tab>
      </Tabs>
    );
  }
}