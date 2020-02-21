import * as React from 'react';
import * as CONST from '../utils/const';

export class Work extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="work section">
        <div className="pic">
          <img src={`${CONST.PATH.IMG_ABOUT}work.png`} alt="working picture"/>
        </div>
        <div className="content">
          <div className="detail">
            <div className="detail-child">
              <div className="year">2018-2020  Co.Mfro</div>
              <a href="https://www.quicca.com/" target="_blank">website</a> created domain registry system<br/>
              <img src="https://cdn.svgporn.com/logos/laravel.svg" alt="laravel logo"/>
              <img src="https://cdn.svgporn.com/logos/riot.svg" alt="riot.js logo"/>
              <img src="https://cdn.svgporn.com/logos/react.svg" alt="react.js logo"/>
              <img src="https://cdn.svgporn.com/logos/sass.svg" alt="sass logo"/>
              <img src="https://cdn.svgporn.com/logos/webpack.svg" alt="webpack logo"/>
              <img src="https://cdn.svgporn.com/logos/git-icon.svg" alt="git logo"/>
            </div>

            <div className="detail-child">
              <div className="year">2017-2018  Co.S-cubism</div>
              <a href="https://www.familiar.co.jp/" target="_blank">website</a> created, modified EC-site<br/>
              <img src="https://cdn.svgporn.com/logos/php.svg" alt="php logo"/>
              <img src="https://cdn.svgporn.com/logos/jquery-mobile.svg" alt="php logo"/>
              <img src="https://cdn.svgporn.com/logos/git-icon.svg" alt="git logo"/>
            </div>

            <div className="detail-child">
              <div className="year">Before 2016 Chef, Backpacker</div>
              <img src={`${CONST.PATH.IMG_ABOUT}chef.svg`} alt="chef icon"/>
              <img src={`${CONST.PATH.IMG_ABOUT}pan.svg`} alt="chef icon"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
