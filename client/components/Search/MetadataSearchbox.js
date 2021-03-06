import React, { PropTypes } from 'react';
import SolrService from '../../services/SolrService';
import SolrActions from '../../actions/SolrActions';
import SearchStore from '../../stores/SearchStore';
import SearchActions from '../../actions/SearchActions';
import InputField from '../Form/InputField';
import AutoSuggestField from '../Form/AutoSuggestField';
import DateHelper from '../../helpers/DateHelper';
import InputRange from 'react-input-range';
import 'react-input-range-css';
import Switch from 'react-bootstrap-switch';
import $ from 'jquery';
import '../../stylesheets/MetadataSearchbox.less';

export default class MetadataSearchbox extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object),
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      facets: SearchStore.facets,
      values: SearchStore.fields,
      submit: SearchStore.submit,
      operator: false
    };

    this.initValues(props.fields, this.state.values, this.state.facets, false);

    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }

  componentWillMount() {
    SearchStore.addChangeListener(this.onSearchStoreChange);

    this.props.fields.filter(field => {
      return field.facet;
    }).forEach(field => {
      SolrService.getFacets(field.name);
    });
  }


  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onSearchStoreChange);
  }

  onSearchStoreChange() {
    let values = this.initValues(this.props.fields, SearchStore.fields, SearchStore.facets, true)
    this.setState({
      facets: SearchStore.facets,
      values: values,
      operator: SearchStore.operator,
      submit: SearchStore.submit
    });
  }

  initValues(fields, values, facets, update) {
    for (var i = 0; i < fields.length; i++) {
      if (typeof values[fields[i].name] === 'undefined') {
        let value = '';
        switch (fields[i].input) {
          case 'text':
            value = '';
            break;

          case 'date':
            value = {
              min: DateHelper.getDefaultMinYear(),
              max: DateHelper.getDefaultMaxYear()
            };
            facets[fields[i].name] = value;
            if (!update) {
              SolrActions.updateFacets(fields[i].name, value);
            }
            break;
        }

        values[fields[i].name] = value;
        if (!update) {
          SearchActions.updateFieldValue(fields[i].name, value);
        }
      }
    }

    if (typeof values.search === 'undefined') {
      values.search = '';
      if (!update) {
        SearchActions.updateFieldValue('search', '');
      }
    }

    return values;
  }

  getFieldsList(fields, values, facets, group, itemClass) {
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
                  value={values[field.name]}
                  facets={facets[field.name]}
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
                  value={values[field.name]}
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
                  minValue={facets[field.name].min}
                  maxValue={facets[field.name].max}
                  value={values[field.name]}
                  onChange={this.handleChange.bind(this)} />
              </div>
            </div>
          )
      }

    });
  }

  toggleAdvancedSearch() {
    let $element = $('#advanced-search');
    let $btn = $('#toggle-advanced-search');
    let $toggle = $('#toggle-advanced-search > i');
    if ($element.is(':visible')) {
      $element.fadeOut(300);
      $toggle.removeClass('fa-times');
      $toggle.addClass('fa-chevron-down');
      $btn.removeClass('focus');
    } else {
      $element.fadeIn(300);
      $toggle.removeClass('fa-chevron-down');
      $toggle.addClass('fa-times');
      $btn.addClass('focus');
    }
  }

  resetSearch() {
    SearchActions.resetSearch();
  }

  onSearchChange(event) {
    this.handleChange({
      props: {
        name: 'search'
      }
    }, event.target.value);
  }

  onSwitchChange(component, state) {
    SearchActions.updateOperator(state)
  }

  handleChange(field, value) {
    SearchActions.updateFieldValue(field.props.name, value);
    SolrService.generateQuery(
      SearchStore.fields,
      SearchStore.operator,
      SearchStore.start,
      SearchStore.rows
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    // Disable submit button
    this.setState({submit: false});

    this.props.submit();
  }

  render() {
    let {
      fields
    } = this.props;

    let {
      values,
      facets,
      submit,
      operator
    } = this.state;

    let visibility = submit ? '' : 'hidden';

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
                  value={values.search}
                  onChange={this.onSearchChange.bind(this)} />
                <span className="input-group-btn">
                  <button
                    type="submit"
                    disabled={!submit}
                    className="btn btn-default">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="col-xs-3 text-right">
            <div className={`btn btn-shy btn-sm ${visibility}`} id="reset-search" onClick={this.resetSearch}>
              Zurücksetzen <i className="fa fa-refresh" aria-hidden="true"></i>
            </div>
            <div className="btn btn-shy btn-sm" id="toggle-advanced-search" onClick={this.toggleAdvancedSearch}>
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
                offColor="primary"
                state={operator}
                labelText="Suchoperator"
                onChange={this.onSwitchChange.bind(this)} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="row">
                <div className="col-xs-12 text-center"><h3>Grundlegendes</h3></div>
                {this.getFieldsList(fields, values, facets, 'main', 'col-xs-6')}
              </div>
            </div>
            <div className="col-xs-6">
              <div className="row">
                <div className="col-xs-12 text-center"><h3>Persona</h3></div>
                {this.getFieldsList(fields, values, facets, 'persona', 'col-xs-6')}
              </div>
            </div>
          </div>

          <hr/>

          <div className="row">
            <div className="col-xs-12 text-center"><h3>Geographisch</h3></div>
            {this.getFieldsList(fields, values, facets, 'geographic', 'col-xs-3')}
          </div>

          <hr/>

          <div className="row">
            <div className="col-xs-12 text-center"><h3>Chronologisch</h3></div>
            {this.getFieldsList(fields, values, facets, 'temporal', 'col-xs-6')}
          </div>

          <hr/>

          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <div className="row">
                <div className="col-xs-12 text-center"><h3>Erweitert</h3></div>
                {this.getFieldsList(fields, values, facets, 'advanced', 'col-xs-6')}
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
};
