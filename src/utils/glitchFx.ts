// @ts-nocheck
import {getRandomInt} from './common';
import {Promise} from "q";

/**
 * shaking element class (just set css style)
 * @param el
 * @param options
 */
export class GlitchFx {
  private DOM: any;
  private options: any;
  private iteration: number;
  private glitchStateTimeout: number;
  private isInactive: boolean;
  private glitchTimeout: number;

  constructor(el, options) {
    this.DOM = {};
    this.DOM.el = el;
    this.options = {
      glitchStart: {min: 500, max: 1000},//どのくらい間をおいてglitch effect executeするか
      glitchState: {min: 50, max: 100},//何ミリ秒間css styleを保持するか
      glitchTotalIterations: 5,
      glitchStateProperty: 'transform',
      glitchStateValue: () => `translate3d(${getRandomInt(-5, 5)}px, ${getRandomInt(-5, 5)}px, 0px) rotate3d(0,0,1,${getRandomInt(-2, 2)}deg)`,
      glitchStateValueReset: `translate3d(0,0,0,) rotate(1,1,1,0)`
    };
    Object.assign(this.options, options);
  }

  public glitch = (): void => {
    this.isInactive = false;

    clearTimeout(this.glitchTimeout);
    this.glitchTimeout = setTimeout(() => {
      this.iteration = 0;
      this.glitchState().then(() => {
        if (!this.isInactive) {
          this.glitch();
        }
      })
    }, getRandomInt(this.options.glitchStart.min, this.options.glitchStart.max))
  };

  /**
   * set css style
   * TotalIterationsの数だけcssをsetTimeoutの第２引数の時間set
   *
   * setInterval(func, delay)
   *  ・一定時間ごとに処理を繰り返す
   * setTimeOut(func, delay)
   *  ・一定時間後に処理を行う
   *
   *  ↑ それぞれclearTimeOut()の引数に入れると、処理が止まる
   */
  private glitchState = (): Promise<void> => {
    return new Promise((res, rej) => {
      if (this.iteration < this.options.glitchTotalIterations) {
        this.glitchStateTimeout = setTimeout(() => {
          this.DOM.el.style[this.options.glitchStateProperty] = this.options.glitchStateValue();
          this.iteration++;
          if (!this.isInactive) {
            this.glitchState().then(() => res);
          }
        }, getRandomInt(this.options.glitchState.min, this.options.glitchState.max))
      } else {
        this.reset();
        res();
      }
    })
  };

  public stop = (): GlitchFx => {
    this.isInactive = true;
    clearTimeout(this.glitchStateTimeout);
    this.reset();
    return this;
  };

  private reset = (): void => {
    this.DOM.el.style[this.options.glitchStateProperty] = this.options.glitchStateValueReset;
  }
}

