import React, { PropTypes } from 'react';
import SolrService from '../services/SolrService';
import SolrStore from '../stores/SolrStore';
import SolrActions from '../actions/SolrActions';
import SearchStore from '../stores/SearchStore';
import SearchActions from '../actions/SearchActions';
import InputField from './Form/InputField';
import AutoSuggestField from './Form/AutoSuggestField';
import DateHelper from '../helpers/DateHelper';
import InputRange from 'react-input-range';
import 'react-input-range-css';
import Switch from 'react-bootstrap-switch';
import $ from 'jquery';
import '../stylesheets/MetadataSearchbox.less';


export default class MetadataSearchbox extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);

    this.state = {
      facets: {},
      values: {},
      submit: true,
      operator: false
    };
    for (var i = 0; i < props.fields.length; i++) {
      let value = '';
      switch (props.fields[i].input) {
        case 'text':
          value = '';
          break;

        case 'date':
          value = {
            min: DateHelper.getDefaultMinYear(),
            max: DateHelper.getDefaultMaxYear()
          };
          this.state.facets[props.fields[i].name] = value;
          SolrActions.updateFacets(props.fields[i].name, value);
          break;
      }

      this.state.values[props.fields[i].name] = value;
      SearchActions.updateFieldValue(props.fields[i].name, value);
    }

    this.state.values.search = '';
    SearchActions.updateFieldValue('search', '');

    this.onSolrStoreChange = this.onSolrStoreChange.bind(this);
    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }

  componentWillMount() {
    SolrStore.addChangeListener(this.onSolrStoreChange);
    SearchStore.addChangeListener(this.onSearchStoreChange);

    this.props.fields.filter(field => {
      return field.facet;
    }).forEach(field => {
      SolrService.getFacets(field.name);
    });
  }


  componentWillUnmount() {
    SolrStore.removeChangeListener(this.onSolrStoreChange);
    SearchStore.removeChangeListener(this.onSearchStoreChange);
  }

  onSolrStoreChange() {
    this.setState({facets: SolrStore.facets});
  }

  onSearchStoreChange() {
    this.setState({
      values: SearchStore.fields,
      submit: true
    });
  }



  getFieldsList(fields, group, itemClass) {
    return fields.filter(field => {
      return field.group === group;
    })
    .sort((a, b) => {
      return a.sort - b.sort;
    })
    .map(field => {
      switch (field.input) {
        case 'text':
          if (field.facet) {
            return (
              <div className={itemClass} key={field.sort}>
                <AutoSuggestField
                  name={field.name}
                  title={field.display}
                  input={field.input}
                  facets={this.state.facets[field.name]}
                  onChange={this.handleChange.bind(this)}/>
              </div>
            );
          } else {
            return (
              <div className={itemClass} key={field.sort}>
                <InputField
                  name={field.name}
                  title={field.display}
                  input={field.input}
                  onChange={this.handleChange.bind(this)}/>
              </div>
            );
          }
        
        case 'date':
          return (
            <div className={itemClass} key={field.sort}>
              <label htmlFor={field.name}>{field.display}</label>
              <div className="range-slider">
                <InputRange
                  name={field.name}
                  minValue={this.state.facets[field.name].min}
                  maxValue={this.state.facets[field.name].max}
                  value={this.state.values[field.name]}
                  onChange={this.handleChange.bind(this)} />
              </div>
            </div>
          )
      }

    });
  }

  toggleAdvancedSearch() {
    let $element = $('#advanced-search');
    let $toggle = $('#toggle-advanced-search > i');
    if ($element.is(':visible')) {
      $element.fadeOut(300);
      $toggle.removeClass('fa-times');
      $toggle.addClass('fa-chevron-down');
    } else {
      $element.fadeIn(300);
      $toggle.removeClass('fa-chevron-down');
      $toggle.addClass('fa-times');
    }
  }

  onSearchChange(event) {
    this.handleChange({
      props: {
        name: 'search'
      }
    }, event.target.value);
  }

  onSwitchChange(component, state) {

    this.setState({operator: state});
  }

  handleChange(field, value) {
    this.setState({submit: false});
    SearchActions.updateFieldValue(field.props.name, value);
  }

  handleSubmit(e) {
    e.preventDefault();

    // Disable submit button
    this.setState({submit: false});

    let operator = this.state.operator ? 'AND' : 'OR';
    SolrService.search(SearchStore.fields, operator);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="row" id="search-box">
          <div className="col-xs-12 text-center"><h3>Freie Suche</h3></div>

          <div className="col-xs-offset-3 col-xs-6">
            <div className="form-group">
              <div className="input-group">
                <input
                  type="text"
                  name="search"
                  className="form-control"
                  placeholder="Freie Suche"
                  onChange={this.onSearchChange.bind(this)} />
                <span className="input-group-btn">
                  <button
                    type="submit"
                    disabled={!this.state.submit}
                    className="btn btn-default">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="col-xs-3 text-right">
            <div className="btn btn-link" id="toggle-advanced-search" onClick={this.toggleAdvancedSearch}>
              Erweiterte Suche <i className="fa fa-chevron-down" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <div id="advanced-search" style={{display: 'none'}}>
          <div className="row">
            <div className="col-xs-6 col-xs-offset-3 text-center">
              <Switch
                onText="UND"
                onColor="info"
                offText="ODER"
                offColor="success"
                state={this.state.operator}
                labelText="Suchoperator"
                onChange={this.onSwitchChange.bind(this)} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="row">
                <div className="col-xs-12 text-center"><h3>Grundlegendes</h3></div>
                {this.getFieldsList(this.props.fields, 'main', 'col-xs-6')}
              </div>
            </div>
            <div className="col-xs-6">
              <div className="row">
                <div className="col-xs-12 text-center"><h3>Persona</h3></div>
                {this.getFieldsList(this.props.fields, 'persona', 'col-xs-6')}
              </div>
            </div>
          </div>

          <hr/>

          <div className="row">
            <div className="col-xs-12 text-center"><h3>Geographisch</h3></div>
            {this.getFieldsList(this.props.fields, 'geographic', 'col-xs-3')}
          </div>

          <hr/>

          <div className="row">
            <div className="col-xs-12 text-center"><h3>Chronologisch</h3></div>
            {this.getFieldsList(this.props.fields, 'temporal', 'col-xs-6')}
          </div>

          <hr/>

          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <div className="row">
                <div className="col-xs-12 text-center"><h3>Erweitert</h3></div>
                {this.getFieldsList(this.props.fields, 'advanced', 'col-xs-6')}
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
};
