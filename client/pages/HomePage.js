import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
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
              <h2>Suche</h2>
              <span className="icon fa fa-search" aria-hidden="true"></span>
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1">
                  <h4>Erforschen Sie den Korpus in einer explorativen Suche</h4>
                </div>
              </div>
            </div>
            <div className="col-xs-4 item">
              <h2>Liedblätter</h2>
              <span className="icon fa fa-file-text" aria-hidden="true"></span>
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1">
                  <h4>Stöbern Sie im Datenbestand des Regensburger Volksmusikportals</h4>
                </div>
              </div>
            </div>
            <div className="col-xs-4 item">
              <h2>Statistik</h2>
              <span className="icon fa fa-bar-chart" aria-hidden="true"></span>
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1">
                  <h4>Gewinnen Sie Einblicke in Analysen und Zusammenhänge</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row about">
            <div className="col-xs-12 text-center">
              <h2>Über das Projekt</h2>
              <hr/>
            </div>
            <div className="col-xs-12 col-sm-5">
              <h4>Regensburger Volksmusikportal</h4>
              <p>
                Der Universitätsbibliothek Regensburg wurden im Jahr 2001 die umfangreichen Kernbestände mehrerer
                Sammlungen größtenteils einmaliger Schrift-, Ton- und Bilddokumente zur Volksmusikforschung übergeben.
                Teile der ursprünglichen Bestände waren in den vorangegangenen Jahrzehnten aus unterschiedlichen
                Gründen über verschiedene Institutionen und mehrere Länder zerstreut worden.
              </p>
              <p>
                Von März 2009 bis August 2013 wurden die Sammlungen der Universitätsbibliothek Regensburg mit
                finanzieller Förderung durch die Deutsche Forschungsgemeinschaft im Rahmen eines interdisziplinär
                angelegten Projekts unter Federführung der Universitätsbibliothek geordnet, digitalisiert und
                erschlossen. Die digitalisierten Sammlungen sollten auf diese Weise umfassend recherchierbar und
                allgemein zugänglich gemacht werden. Im Mittelpunkt des „Regensburger Volksmusik-Portals“ stehen drei
                große Sammlungen:
              </p>
              <ul>
                <li>
                  Die fast vollständig erhaltenen Sammlungen von Volksliedaufzeichnungen, Bild- und Tonaufnahmen sowie
                  das Registraturgut der Abteilung Volksmusik des ehemaligen Staatlichen Instituts für Deutsche
                  Musikforschung, Berlin.
                </li>
                <li>
                  Die durch die Gruppe „Volksmusik“ in der „Deutschen Kulturkommission in Südtirol“ in den Jahren 1940
                  bis 1942 flächendeckend gemachten Volksliedaufnahmen, ergänzt um weitere in diesem Zusammenhang
                  gesammelte Materialien und um entsprechende Akten der Forschungsstätte für indogermanisch-deutsche
                  Musik, Abt. Germanische Musik, im SS-Ahnenerbe, 1940 bis 1945.
                </li>
                <li>
                  Der wissenschaftliche Nachlass des Musikethnologen und Volkstanzforschers Prof. Dr. Felix Hoerburger
                  (1916 bis 1997), der u. a. eine umfassende Sammlung von Volkstänzen aus Bayern und umfangreiche Ton-
                  und Bilddokumentationen seiner Forschungsreisen auf dem Balkan und in asiatischen Ländern
                  (Afghanistan, Nepal, Taiwan, China) beinhaltet.
                </li>
              </ul>
              <p>
                Zu diesen drei großen Sammlungen treten einige kleinere Bestände, von denen wissenschaftliche
                Korrespondenz des Musikwissenschaftlers Prof. Dr. Bruno Stäblein (1895 bis 1978) aus den Jahren 1936
                bis 1945 und die Akten des Instituts für Musikforschung an der ehemaligen Philosophisch-Theologischen
                Hochschule Regensburg hervorzuheben sind. Das Institut für Musikforschung war von Bruno Stäblein 1945
                gegründet und bis zu dessen Eingliederung in die neugegründete Universität Regensburg 1968 auch
                geleitet worden. Die Sammlungen der Abteilung Volksmusik und das Südtirol-Material des SS-Ahnenerbes
                barg er persönlich im Januar 1946 in Waischenfeld (Oberfranken) und baute mit ihnen die Volksmusik-
                Abteilung des Instituts auf.
              </p>
            </div>

            <div className="col-xs-12 col-sm-5 col-sm-offset-2">
              <h4>Projektleitung</h4>
              <h5>Universitätsbibliothek Regensburg</h5>
              <p>
                <strong>Dr. Rafael Ball</strong><br/>
                Direktor der <a target="_blank" href="http://www.uni-regensburg.de/bibliothek/">Universitätsbibliothek Regensburg</a>
              </p>
              <h5>Projektteilnehmer</h5>
              <p>
                <strong>Prof. Dr. Daniel Drascek</strong><br/>
                <a target="_blank" href="http://www.uni-regensburg.de/sprache-literatur-kultur/vergleichende-kulturwissenschaft/mitarbeiter/drascek/index.html">Lehrstuhl für Vergleichende Kulturwissenschaft</a> am Institut für Information und Medien, Sprache und Kultur (I:IMSK) der Universität Regensburg
              </p>
              <p>
                <strong>Prof. Dr. Wolfgang Horn</strong><br/>
                <a target="_blank" href="http://www.uni-regensburg.de/Fakultaeten/phil_Fak_I/Musikwissenschaft/index.htm">Lehrstuhl für Musikwissenschaft</a> an der Universität Regensburg
              </p>
              <p>
                <strong>Ao. Univ.-Prof. Dr. Thomas Nußbaumer</strong><br/>
                Universität Mozarteum Salzburg, Abteilung für Musikwissenschaft, <a target="_blank" href="http://www.moz.ac.at/people.php?p=50860">Abteilungsbereich Musikalische Volkskunde</a>
              </p>
              <p>
                <strong>Prof. Dr. Christian Wolff</strong><br/>
                <a target="_blank" href="http://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/sekretariat-team/christian-wolff/index.html">Lehrstuhl für Medieninformatik</a> am Institut für Information und Medien, Sprache und Kultur (I:IMSK) der Universität Regensburg
              </p>
              <p>
                Weitere Informationen finden Sie auf den Seiten der <a target="_blank" href="http://www.uni-regensburg.de/bibliothek/projekte/rvp/index.html">Universität Regensburg</a>.
              </p>

              <p>&nbsp;</p>

              <h4>Informationssystem</h4>
              <p>
                Das Informationssystem wurde im Rahmen der Masterarbeit von <a target="_blank" href="http://lukaslamm.com">Lukas Lamm</a> erstellt.
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