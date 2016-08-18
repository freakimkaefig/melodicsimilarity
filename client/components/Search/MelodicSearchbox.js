import React, {PropTypes} from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { MODES } from '../../constants/MelodyConstants';
import MelodyActions from '../../actions/MelodyActions';
import SearchStore from '../../stores/SearchStore';
import Melody from './MelodicSearchbox/Melody';
import Intervals from './MelodicSearchbox/Intervals';
import ParsonsCode from './MelodicSearchbox/ParsonsCode';
import '../../stylesheets/MelodicSearchbox.less';

export default class MelodicSearchbox extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      mode: SearchStore.melodyMode
    };

    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    SearchStore.addChangeListener(this.onSearchStoreChange);
  }

  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onSearchStoreChange);
  }

  onSearchStoreChange() {
    this.setState({
      mode: SearchStore.melodyMode
    });
  }

  handleSubmit() {
    this.props.submit();
  }

  handleSelect(key) {
    MelodyActions.updateMode(key);
  }

  render() {
    return (
      <Tabs activeKey={this.state.mode} id="melodicsearchbox" onSelect={this.handleSelect}>
        <Tab eventKey={MODES.indexOf('MELODY')} title="Melodie">
          <Melody submit={this.handleSubmit} />
        </Tab>
        <Tab eventKey={MODES.indexOf('INTERVALS')} title="Intervalle">
          <Intervals submit={this.handleSubmit} />
        </Tab>
        <Tab eventKey={MODES.indexOf('PARSONS')} title="Parsons Code">
          <ParsonsCode submit={this.handleSubmit} />
        </Tab>
      </Tabs>
    );
  }
}