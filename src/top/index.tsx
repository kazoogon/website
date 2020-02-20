// @ts-nocheck
import * as React from 'react';
import {DualImageLayout} from './dil';
import TitleSvg from '../img/kaziu.svg';
import anime from 'animejs/lib/anime.es.js';
import {GlitchFx} from '../utils/glitchFx';
import * as Common from '../utils/common';
import {PAGE_NAME} from '../utils/const';
import * as CONST from "../utils/const";

interface IProps {
  changePage: void
}

export class Top extends React.Component<IProps, {}> {
  private slicesRef = React.createRef<HTMLDivElement>();
  private slideRef = React.createRef<HTMLDivElement>();
  private titleRef = React.createRef<HTMLDivElement>();
  private gfxArr: GlitchFx[];

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setRefs();
    this.setBg();
    this.setTitleEffect();
    this.setGlitch();
  }

  private setRefs = (): void => {
    this.slicesRef.current!.focus();
    this.slideRef.current!.focus();
  };

  private setBg = (): void => {
    const imgs = {even: [], odd: []};
    imgs.even.push(this.slideRef.current.dataset.imageEven);
    imgs.odd.push(this.slideRef.current.dataset.imageOdd);

    //画像のslicesを作成(細い線たち)
    const dil = new DualImageLayout(this.slicesRef.current, {
      images: {even: imgs.even[0], odd: imgs.odd[0]},
      slices: 179,
      orientation: 'horizontal'
    });
  }

  private setTitleEffect = (): void => {
    const paths = Common.getSvgPaths(this.titleRef);
    const vals = Object.values(paths);
    vals.map(val => {
      if (val.id == 'i') {
        anime({
          targets: val,
          easing: 'easeInBounce',
          duration: 2500,
          direction: 'alternate',
          translateY: [0,15],
          loop: true,
        })
      } else if (val.id == 'u') {
        anime({
          targets: val,
          easing: 'easeInBack',
          duration: 2500,
          direction: 'alternate',
          translateX: [0,-5],
          loop: true,
        })
      }
    })
  };

  private setGlitch = () => {
    this.gfxArr = [];
    this.slicesRef.current.childNodes.forEach(slice => {
      const dim = slice.offsetHeight;
      this.gfxArr.push(new GlitchFx(slice, {
        glitchStart: {min: 100, max: 2500},
        glitchState: {min: 50, max: 100},
        glitchTotalIterations: 15,
        glitchStateProperty: 'top',
        glitchStateValue: () => Common.getRandomInt(-1 * dim * 0.5, dim * 0.5) + 'px',
        glitchStateValueReset: '0px'
      }))
    })
  };

  private changePage = (pageName): void => {
    this.toggleGlitch();

    setTimeout(() => {
      this.props.changePage(pageName);
      window.history.pushState(null, null, `#/${pageName}`);
    }, 500);

    setTimeout(() => {
      this.toggleGlitch('stop');
    }, 1000);
  };

  private toggleGlitch = (action = 'start') => {
    for (const gfx of this.gfxArr) {
      gfx[action === 'start' ? 'glitch' : 'stop']();
    }
  };


  render() {
    return (
      <div className="top">
        {/* １つ１つの細い画像 */}
        <div className="slices" ref={this.slicesRef}></div>
        <div className="slides">
          <div ref={this.slideRef}
               className="slide grid slide--current"
               id="slide-1"
               data-image-even={`${CONST.PATH.IMG_TOP}top_bg1.png`}
               data-image-odd={`${CONST.PATH.IMG_TOP}top_bg2.png`}>
            <div className="content">
              <div className="grid__item top__title" ref={this.titleRef}><TitleSvg/></div>
              <nav className="grid__item nav">
                <div className="nav-item" onClick={() => this.changePage(PAGE_NAME.ABOUT)}>about me</div>
                <div className="nav-item" onClick={() => this.changePage(PAGE_NAME.JOURNEY)}>journey</div>
                <div className="nav-item" onClick={() => this.changePage(PAGE_NAME.GALLERY)}>gallery</div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}