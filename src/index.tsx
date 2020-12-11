// @ts-nocheck
//todo @ts-nocheckでエラーをとりあえず回避
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Route, Link, HashRouter} from "react-router-dom";
import {About} from './about';
import {Journey} from './journey';
import {Gallery} from './gallery';
import {Top} from "./top";
import {PAGE_NAME} from "./utils/const";
import TitleSvg from './img/kaziu.svg';

interface IState {
  page: string,
  tmpPageName: string,
  isHide: boolean,
}

class App extends React.Component<{}, IState> {

  private titleRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    this.state = {
      page: PAGE_NAME.TOP,
      tmpPageName: '',
      isHide: false,
    };

    //deal with reloading (maybe there is better way tho)
    //(tmp)reload時にはtopページに戻り、urlを / に。
    window.history.pushState(null, null, `#/`);
  }

  private changePage = (page: string): void => {
    this.setState({
      tmpPageName: page,
      isHide: true,
    });
  };

  private handleTransitionEnd = (): void => {
    this.setState({
      isHide: false,
      page: this.state.tmpPageName,
    });
  };

  private handleClickNav = (page: string): void => {
    this.setState({page});
  };

  render() {
    let display;

    if (this.state.page === PAGE_NAME.TOP) {
      display = <Top changePage={this.changePage}/>;
    } else {
      display =
        <HashRouter>
          <div className="title" ref={this.titleRef}><TitleSvg /></div>
          <div className="navigation">
            <div className={`navigation-item ${this.state.page === PAGE_NAME.ABOUT? 'active' : ''}`} onClick={() => this.handleClickNav(PAGE_NAME.ABOUT)}>
              <Link to="/about">about me</Link>
            </div>
            <div className={`navigation-item ${this.state.page === PAGE_NAME.JOURNEY? 'active' : ''}`} onClick={() => this.handleClickNav(PAGE_NAME.JOURNEY)}>
              <Link to="/journey">journey</Link>
            </div>
            {/*<div className={`navigation-item ${this.state.page === PAGE_NAME.GALLERY? 'active' : ''}`} onClick={() => this.handleClickNav(PAGE_NAME.GALLERY)}>*/}
            {/*  <Link to="/gallery">gallery</Link>*/}
            {/*</div>*/}
          </div>
          <div>
            <Route path="/about" component={About}/>
            <Route path="/journey" component={Journey}/>
            {/*<Route path="/gallery" component={Gallery}/>*/}
          </div>
        </HashRouter>
    }

    return (
      <div onTransitionEnd={this.handleTransitionEnd} className={this.state.isHide ? 'hide' : 'show'}>
        {display}
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'));