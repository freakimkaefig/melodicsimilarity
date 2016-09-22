import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import { Link } from 'react-router';
import '../stylesheets/HomePage.less';

export default class HomePage extends React.Component {
  static displayName = 'HomePage';
  static propTypes = {};

  render() {
    return (
      <DocumentTitle title={`Home // ${APP_NAME}`}>
        <div className="offset-container home-page">

          <div className="row text-center">
            <div className="col-xs-12 col-sm-8 col-sm-offset-2">
              <h1>{APP_NAME}</h1>
            </div>
          </div>

          <div className="row text-center teaser-items">

            <div className="col-xs-4 item">
              <Link to="/search">
                <h2>Suche</h2>
                <span className="icon fa fa-search" aria-hidden="true"></span>
                <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                    <h4>Erforschen Sie den Korpus in einer explorativen Suche</h4>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xs-4 item">
              <Link to="/songsheets">
                <h2>Liedblätter</h2>
                <span className="icon fa fa-file-text" aria-hidden="true"></span>
                <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                    <h4>Stöbern Sie im Datenbestand des Regensburger Volksmusikportals</h4>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xs-4 item">
              <Link to="/statistics/melody">
                <h2>Statistik</h2>
                <span className="icon fa fa-bar-chart" aria-hidden="true"></span>
                <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                    <h4>Gewinnen Sie Einblicke in Analysen und Zusammenhänge</h4>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="row about">
            <div className="col-xs-12 text-center">
              <h2>Über das Projekt</h2>
              <hr/>
            </div>

            <div className="col-xs-12 col-sm-5">
              <h4>Kontext & Zielsetzung</h4>
              <p>
                Ziel des Informationssystems ist der webbasierte Zugang zu den digital erschlossenen Liedblättern aus
                den, der Universitätsbibliothek Regensburg übertragenen, Quellen zur Volksmusikforschung.
                Die Liedblattsammlung in Regensburg umfasst etwa 140.000 Blätter aus dem gesamten deutschsprachigen
                Raum und ist, was Abdeckung und Umfang angeht, in dieser Form einzigartig.
              </p>
              <p>Ansprechpartner: <a target="_blank" href="http://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/sekretariat-team/manuel-burghardt/index.html">Dr. Manuel Burghardt</a></p>
            </div>
            <div className="col-xs-12 col-sm-5 col-sm-offset-2">
              <h4>Informationssystem</h4>
              <p>
                Das Informationssystem wurde im Rahmen der Masterarbeit von <a target="_blank" href="http://lukaslamm.com">Lukas Lamm</a>
                am <a target="_blank" href="http://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/">Lehrstuhl für Medieninformatik</a>
                der Universität Regensburg erstellt.
                Das Projekt, sowie die dafür entworfenen Bibliotheken sind unter der MIT Lizenz veröffentlicht.
              </p>
              <p>
                Für weitere Informationen finden Sie die einzelnen Komponenten auf GitHub:
              </p>
              <ul className="nolist github">
                <li><span><a href="https://github.com/freakimkaefig/melodicsimilarity">Informationssystem</a></span></li>
                <li><span><a href="https://github.com/freakimkaefig/musicjson-toolbox">MusicJson-Werkzeugkasten</a></span></li>
                <li><span><a href="https://github.com/freakimkaefig/musicjson2abc">MusicJson-Konverter</a></span></li>
              </ul>
            </div>
          </div>

        </div>
      </DocumentTitle>
    )
  }
}