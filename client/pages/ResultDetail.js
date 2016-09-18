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
  static displayName = 'ResultDetail';

  constructor(props) {
    super(props);

    this.state = {
      metadataQueryFields: SearchStore.queryFields,
      melodyMode: SearchStore.melodyMode,
      parsonQuery: SearchStore.parsonQuery,
      intervalQuery: SearchStore.intervalQuery,
      melodyQuery: SearchStore.melodyQuery,
      songsheets: SongsheetStore.songsheets,
      similarityScores: SongsheetStore.similarityScores,
      loading: false,
      searchResult: SearchStore.results.find(item => {
        return item.id === props.params.signature;
      })
    };

    this.onSongsheetStoreChange = this.onSongsheetStoreChange.bind(this);
    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }

  componentDidMount() {
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
      songsheets: SongsheetStore.songsheets,
      similarityScores: SongsheetStore.similarityScores,
      loading: false
    });
  }

  onSearchStoreChange() {
    this.setState({
      metadataQueryFields: SearchStore.queryFields,
      melodyMode: SearchStore.melodyMode,
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
      melodyMode,
      parsonQuery,
      intervalQuery,
      melodyQuery,
      songsheets,
      similarityScores,
      loading,
      searchResult
    } = this.state;

    let currentSongsheet = songsheets.find((item) => {
      return item.signature === signature;
    });

    let melodicHighlighting = [];
    if (typeof searchResult !== 'undefined') {
      if (typeof searchResult.melodic !== 'undefined') {
        melodicHighlighting = searchResult.melodic.filter(item => {
          return item.similarity >= searchResult.maxSimilarity;
        });
      }
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
                      melodyMode={melodyMode}
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
            songsheet={currentSongsheet}
            songsheets={songsheets}
            similarityScores={similarityScores}
            melodicHighlighting={melodicHighlighting}
            metadataHighlighting={metadataQueryFields}
          />
        </div>
      </DocumentTitle>
    )
  }
}