import * as React from 'react';
import * as CONST from '../utils/const';

export class Hobby extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="hobby section">
        <div className="pic">
          <img src={`${CONST.PATH.IMG_ABOUT}hobby.png`} alt="hobby picture"/>
        </div>
        <div className="content">
            <div className="detail">
              <img src={`${CONST.PATH.IMG_ABOUT}baseball.svg`} width="50px" alt="baseball icon"/>
              <div className="desc"><div className="name">Baseball</div> Elementary school, shortstop</div>
            </div>
          <div className="detail">
            <img src={`${CONST.PATH.IMG_ABOUT}karate.svg`} width="50px" alt="karate icon"/>
            <div className="desc"><div className="name">Karate</div> Elementary school</div>
          </div>
            <div className="detail">
              <img src={`${CONST.PATH.IMG_ABOUT}badminton.svg`} width="50px" alt="badminton icon"/>
              <div className="desc"><div className="name">Badminton</div> I've played for 6years from jr high school</div>
            </div>
            <div className="detail">
              <img src={`${CONST.PATH.IMG_ABOUT}football.svg`} width="50px" alt="football icon"/>
              <div className="desc"><div className="name">Football</div> When I was in south america, I often played</div>
            </div>
            <div className="detail">
              <img src={`${CONST.PATH.IMG_ABOUT}pingpong.svg`} width="50px" alt="ping pong icon"/>
              <div className="desc"><div className="name">Ping pong</div> From 2018, just for fun</div>
            </div>
        </div>
      </div>
    );
  }
}