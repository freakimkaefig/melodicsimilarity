import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import StatisticsActions from '../../actions/StatisticsActions';
import MelodyStatistics from '../MelodyStatistics';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../../constants/AppConstants';

describe('<MelodyStatistics/>', () => {

  var wrapper;

  var updateMelodyResponse = {
    mode: '',
    data: {
      labels: ['label 1', 'label 2'],
      values: [1, 2]
    }
  };

  beforeEach(() => {
    jest.resetModules();
    wrapper = mount(<MelodyStatistics/>);
  });

  it('should initialize with empty state', () => {
    expect(wrapper.state('notes').labels.length).toBe(0);
    expect(wrapper.state('notes').values.length).toBe(0);
    expect(wrapper.state('intervals').labels.length).toBe(0);
    expect(wrapper.state('intervals').values.length).toBe(0);
    expect(wrapper.state('durations').labels.length).toBe(0);
    expect(wrapper.state('durations').values.length).toBe(0);
    expect(wrapper.state('rests').labels.length).toBe(0);
    expect(wrapper.state('rests').values.length).toBe(0);
    expect(wrapper.state('keys').labels.length).toBe(0);
    expect(wrapper.state('keys').values.length).toBe(0);
    expect(wrapper.state('meters').labels.length).toBe(0);
    expect(wrapper.state('meters').values.length).toBe(0);
    expect(wrapper.state('counts').length).toBe(0);
  });

  it('should render <DocumentTitle/>', () => {
    expect(wrapper.find(DocumentTitle).length).toBe(1);
    expect(wrapper.find(DocumentTitle).props().title).toEqual(`Melodieinformationen // Statistik // ${APP_NAME}`);
  });

  it('should load statistics on mount', () => {
    sinon.spy(MelodyStatistics.prototype, 'componentDidMount');
    jest.resetModules();
    wrapper = mount(<MelodyStatistics/>);

    expect(MelodyStatistics.prototype.componentDidMount.callCount).toBe(1);
    MelodyStatistics.prototype.componentDidMount.restore();
  });

  it('should handle store changes', () => {
    sinon.spy(MelodyStatistics.prototype, 'onStatisticsStoreChange');
    // sinon.spy(MelodyStatistics.prototype, 'updateChart');
    jest.resetModules();
    wrapper = mount(<MelodyStatistics/>);

    var callCounter = 0;

    updateMelodyResponse.mode = 'notes';
    StatisticsActions.updateMelodicStatistics(updateMelodyResponse);
    callCounter++;
    expect(MelodyStatistics.prototype.onStatisticsStoreChange.callCount).toBe(callCounter);
    expect(wrapper.state(updateMelodyResponse.mode).labels.length).toBe(2);
    expect(wrapper.state(updateMelodyResponse.mode).values.length).toBe(2);

    updateMelodyResponse.mode = 'intervals';
    StatisticsActions.updateMelodicStatistics(updateMelodyResponse);
    callCounter++;
    expect(MelodyStatistics.prototype.onStatisticsStoreChange.callCount).toBe(callCounter);
    expect(wrapper.state(updateMelodyResponse.mode).labels.length).toBe(2);
    expect(wrapper.state(updateMelodyResponse.mode).values.length).toBe(2);

    updateMelodyResponse.mode = 'durations';
    StatisticsActions.updateMelodicStatistics(updateMelodyResponse);
    callCounter++;
    expect(MelodyStatistics.prototype.onStatisticsStoreChange.callCount).toBe(callCounter);
    expect(wrapper.state(updateMelodyResponse.mode).labels.length).toBe(2);
    expect(wrapper.state(updateMelodyResponse.mode).values.length).toBe(2);

    updateMelodyResponse.mode = 'rests';
    StatisticsActions.updateMelodicStatistics(updateMelodyResponse);
    callCounter++;
    expect(MelodyStatistics.prototype.onStatisticsStoreChange.callCount).toBe(callCounter);
    expect(wrapper.state(updateMelodyResponse.mode).labels.length).toBe(2);
    expect(wrapper.state(updateMelodyResponse.mode).values.length).toBe(2);

    updateMelodyResponse.mode = 'keys';
    StatisticsActions.updateMelodicStatistics(updateMelodyResponse);
    callCounter++;
    expect(MelodyStatistics.prototype.onStatisticsStoreChange.callCount).toBe(callCounter);
    expect(wrapper.state(updateMelodyResponse.mode).labels.length).toBe(2);
    expect(wrapper.state(updateMelodyResponse.mode).values.length).toBe(2);

    updateMelodyResponse.mode = 'meters';
    StatisticsActions.updateMelodicStatistics(updateMelodyResponse);
    callCounter++;
    expect(MelodyStatistics.prototype.onStatisticsStoreChange.callCount).toBe(callCounter);
    expect(wrapper.state(updateMelodyResponse.mode).labels.length).toBe(2);
    expect(wrapper.state(updateMelodyResponse.mode).values.length).toBe(2);

    updateMelodyResponse.mode = 'counts';
    StatisticsActions.updateMelodicStatistics(updateMelodyResponse);
    callCounter++;
    expect(MelodyStatistics.prototype.onStatisticsStoreChange.callCount).toBe(callCounter);
    expect(wrapper.state(updateMelodyResponse.mode).labels.length).toBe(2);
    expect(wrapper.state(updateMelodyResponse.mode).values.length).toBe(2);

    MelodyStatistics.prototype.onStatisticsStoreChange.restore();
    // MelodyStatistics.prototype.updateChart.restore();
  });

});