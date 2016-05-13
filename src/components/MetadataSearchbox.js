import React, { PropTypes } from 'react';
import SolrService from '../services/SolrService';
import SolrStore from '../stores/SolrStore';
import InputField from './Form/InputField';
import SelectField from './Form/SelectField';
import RangeField from './Form/RangeField';
import $ from 'jquery';
import '../stylesheets/MetadataSearchbox.less';


export default class MetadataSearchbox extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);

    this.state = {};
    for (var i = 0; i < props.fields.length; i++) {
      this.state[props.fields[i]] = '';
    }

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    SolrStore.addChangeListener(this.onStoreChange);

    for (var i = 0; i < this.props.fields.length; i++) {
      SolrService.getFacets(this.props.fields[i].name);
    }
  }

  componentWillUnmount() {
    SolrStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    let facets = SolrStore.facets;
    this.setState(facets);
  }

  getSelectOptions(field) {
    if (typeof this.state[field] !== 'undefined') {
      if (this.state[field].length > 0) {
        return this.state[field];
      }
    }
    return [];
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
          return (
            <div className={itemClass} key={field.sort}>
              <InputField name={field.name} title={field.display} input={field.input} />
            </div>
          );

        case 'select':
          return (
            <div className={itemClass} key={field.sort}>
              <SelectField name={field.name} title={field.display} options={this.getSelectOptions(field.name)} />
            </div>
          );
        
        case 'date':
          return (
            <div className={itemClass} key={field.sort}>
              <RangeField name={field.name} title={field.display} />
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

  handleChange(field, value) {
    console.log(field, value);
  }

  handleSubmit(e) {
    e.preventDefault();

    let $target = $(e.target);
    $target.find('button[type="submit"]').attr('disabled', 'disabled');
    let queryFields = $target.serializeArray().filter(field => {
      return field.value !== "";
    });

    SolrService.search(queryFields);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row" id="search-box">
          <div className="col-xs-12 text-center"><h3>Freie Suche</h3></div>

          <div className="col-xs-offset-3 col-xs-6">
            <div className="form-group">
              <div className="input-group">
                <input type="text" name="search" className="form-control" placeholder="Freie Suche" />
                <span className="input-group-btn">
                  <button type="submit" className="btn btn-default"><i className="fa fa-search" aria-hidden="true"></i></button>
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
            {this.getFieldsList(this.props.fields, 'temporal', 'col-xs-3')}
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
