import * as React from 'react';
import * as CONST from '../utils/const';

export class Language extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="language section row-reverse">
        <div className="pic">
          <img src={`${CONST.PATH.IMG_ABOUT}language.png`} alt="language picture"/>
        </div>

        <div className="content">
          <div className="detail">
            <img src={`${CONST.PATH.IMG_JOURNEY_FLAG}japan.svg`} width="50px" alt="japan flag"/>
            <div className="desc"><div className="name">Japanese</div>Native</div>
          </div>
          <div className="detail">
            <img src={`${CONST.PATH.IMG_JOURNEY_FLAG}poland.svg`} width="50px" alt="poland flag"/>
            <div className="desc"><div className="name">Polish</div> Intermediate</div>
          </div>
          <div className="detail">
            <img src={`${CONST.PATH.IMG_JOURNEY_FLAG}uk.svg`} width="50px" alt="uk flag"/>
            <div className="desc"><div className="name">English</div> Intermediate</div>
          </div>
          <div className="detail">
            <img src={`${CONST.PATH.IMG_JOURNEY_FLAG}spain.svg`} width="50px" alt="spain flag"/>
            <div className="desc"><div className="name">Spanish</div> Used to be Intermediate, but I don't use it recently</div>
          </div>
        </div>
      </div>
    );
  }
}
