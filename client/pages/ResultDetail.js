import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import {
  browserHistory
} from 'react-router';
import LoadingOverlay from '../components/LoadingOverlay';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import QueryBreadcrumb from '../components/Search/QueryBreadcrumb';
import SongsheetView from '../components/SongsheetView';
import SongsheetStore from '../stores/SongsheetStore';
import SongsheetService from '../services/SongsheetService';
import SearchStore from '../stores/SearchStore';

export default class ResultDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      metadataQueryFields: SearchStore.queryFields,
      parsonQuery: SearchStore.parsonQuery,
      intervalQuery: SearchStore.intervalQuery,
      melodyQuery: SearchStore.melodyQuery,
      file: SongsheetStore.songsheets.find(item => {
        return item.signature === props.params.signature;
      }),
      metadata: SongsheetStore.metadata.find(item => {
        return item.signature === props.params.signature;
      }),
      similarityScores: SongsheetStore.similarityScores,
      similarSongsheets: SongsheetStore.similarSongsheets,
      similarMetadata: SongsheetStore.similarMetadata,
      loading: false,
      searchResult: SearchStore.results.find(item => {
        return item.id === props.params.signature;
      })
    };

    this.onSongsheetStoreChange = this.onSongsheetStoreChange.bind(this);
    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }

  componentWillMount() {
    SongsheetStore.addChangeListener(this.onSongsheetStoreChange);

    if (this.state.metadataQueryFields.length === 0
      && this.state.parsonQuery === ''
      && this.state.intervalQuery === ''
      && this.state.melodyQuery.length === 0) {
      browserHistory.push('/search');
    }

    if (!this.state.file) {
      this.setState({
        loading: true
      });
      SongsheetService.loadItem(this.props.params.signature);
    }

    if (this.state.similarSongsheets.length <= 0 || this.state.similarMetadata.length <= 0) {
      SongsheetService.loadSimilar(this.props.params.signature);
    }
  }

  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onSongsheetStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.signature !== nextProps.params.signature) {
      this.setState({
        loading: true
      });
      SongsheetService.loadItem(nextProps.params.signature);
      SongsheetService.loadSimilar(nextProps.params.signature);
    }
  }

  onSongsheetStoreChange() {
    this.setState({
      file: SongsheetStore.songsheets.find(item => {
        return item.signature === this.props.params.signature;
      }),
      metadata: SongsheetStore.metadata.find(item => {
        return item.signature === this.props.params.signature;
      }),
      similarityScores: SongsheetStore.similarityScores,
      similarSongsheets: SongsheetStore.similarSongsheets,
      similarMetadata: SongsheetStore.similarMetadata,
      loading: false
    });
  }

  onSearchStoreChange() {
    this.setState({
      metadataQueryFields: SearchStore.queryFields,
      parsonQuery: SearchStore.parsonQuery,
      intervalQuery: SearchStore.intervalQuery,
      melodyQuery: SearchStore.melodyQuery,
      searchResult: SearchStore.results.find(item => {
        return item.id === this.props.params.signature;
      })
    });
  }

  render() {
    let signature = this.props.params.signature;

    let {
      metadataQueryFields,
      parsonQuery,
      intervalQuery,
      melodyQuery,
      file,
      metadata,
      similarityScores,
      similarSongsheets,
      similarMetadata,
      loading,
      searchResult
    } = this.state;

    let melodicHighlighting = [];
    if (typeof searchResult !== 'undefined') {
      melodicHighlighting = searchResult.melodic.filter(item => {
        return item.similarity >= searchResult.maxSimilarity;
      });
    }

    return (
      <DocumentTitle title={`Suchergebnis - ${signature} // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={loading} />

          <div className="row">
            <div className="col-xs-12">
              <Breadcrumb>
                <LinkContainer to="/search">
                  <Breadcrumb.Item>
                    Suche
                  </Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/search/result">
                  <Breadcrumb.Item>
                    <QueryBreadcrumb
                      metadataQuery={metadataQueryFields}
                      parsonQuery={parsonQuery}
                      intervalQuery={intervalQuery}
                      melodyQuery={melodyQuery}
                    />
                  </Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>
                  {signature}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <SongsheetView
            file={file}
            metadata={metadata}
            similarityScores={similarityScores}
            similarSongsheets={similarSongsheets}
            similarMetadata={similarMetadata}
            melodicHighlighting={melodicHighlighting}
            metadataHighlighting={metadataQueryFields}
          />
        </div>
      </DocumentTitle>
    )
  }
}