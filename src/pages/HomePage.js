import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';

export default class HomePage extends React.Component {
  static propTypes = {};

  render() {
    return (
      <DocumentTitle title={`Home // ${APP_NAME}`}>
        <div>
          <div className="row">
            <div className="col-xs-12">
              <h1>{APP_NAME}</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <h3>Oans</h3>
              <p>Bavaria ipsum dolor sit amet Semmlkneedl es Guglhupf so schee oa? A bissal wos gehd ollaweil hallelujah sog i, luja Resi, großherzig a ganze in da greana Au a fescha Bua Ohrwaschl luja. Hallelujah sog i, luja baddscher hob i an Suri Semmlkneedl i hob di narrisch gean damischa Schbozal, hogg di hera! Großherzig Schdeckalfisch obandeln Zwedschgndadschi griaß God beinand Biagadn an Habedehre, barfuaßat! Woibbadinga is des liab des, di Lewakaas is des liab heid resch? Mongdratzal naa mim Radl foahn, griaß God beinand oba des basd scho? Zua Enzian umma Spezi. Ramasuri Fingahaggln trihöleridi dijidiholleri Goaßmaß, i von anbandeln Ramasuri luja. Wo hi kloan auf der Oim, da gibt’s koa Sünd da Kini Kneedl Meidromml vasteh Wiesn Goaßmaß. Gwiss auf’d Schellnsau Auffisteign, in da greana Au aba des basd scho ozapfa des wia. Damischa Guglhupf Wurscht, .</p>
            </div>
            <div className="col-xs-4">
              <h3>Zwoa</h3>
              <p>A ganze Hoiwe i bin a woschechta Bayer Prosd pfundig no ned midanand Gschicht Sauwedda, nix jo leck mi. Maibam und moand scheans Gams Biazelt Almrausch an an Breihaus Stubn. Auf gehds beim Schichtl dei dahoam Marterl gwiss i ham woaß, da, hog di hi. Steckerleis san no, du dadst ma scho daugn Vergeltsgott Spuiratz: Obazda geh wos sei so hoam wos gscheid Biawambn. Nix sammawiedaguad wia da Buachbinda Wanninger noch da Giasinga Heiwog i moan scho aa Obazda hallelujah sog i, luja, Bradwurschtsemmal großherzig obandeln! Dringma aweng a liabs Deandl etza, Gams. A Hoiwe eam resch Landla dahoam sauba: Gwiss Watschnbaam etza naa sodala sei de Sonn, ebba trihöleridi dijidiholleri. Almrausch nimma Engelgwand Landla, glei?</p>
            </div>
            <div className="col-xs-4">
              <h3>Drei</h3>
              <p>Schaung kost nix Sauakraud Edlweiss damischa nia need Griasnoggalsubbm, resch wui! Geh Edlweiss Heimatland dahoam, obandeln. Da auf’d Schellnsau scheans mim Schbozal. Liberalitas Bavariae Weibaleid Buam Biaschlegl, Klampfn imma: Blärrd Wiesn gfreit mi Schdarmbeaga See mogsd a Bussal Maibam zua i waar soweid measi mehra Mongdratzal. Haferl naa singan, d’. I bin a woschechta Bayer i sog ja nix, i red ja bloß do Biakriagal a ganze Schdeckalfisch sodala, heid oans, zwoa, gsuffa a und. I daad middn glacht wia im Beidl fias Schneid Brezn? Watschnbaam Gstanzl hoam oamoi g’hupft wia gsprunga Radi Diandldrahn Ramasuri auf gehds beim Schichtl owe. Glacht bitt wolln mechad i waar soweid, i sog ja nix, i red ja bloß. Vui huift vui i bin a woschechta Bayer gfreit mi Steckerleis, Buam Namidog.</p>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}