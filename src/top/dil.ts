// @ts-nocheck
declare global {
  interface Window {
    DualImageLayout: {},
  }
}

export class DualImageLayout {
  private DOM: any;
  private options: any;
  private visibleSlices: string;
  private totalSlices: number;

  constructor(el, options) {
    this.DOM = {};
    this.DOM.el = el;
    this.options = {
      images: {
        even: 'img/even.png',
        odd: 'img/odd.png'
      },
      orientation: 'vertical',
      slices: 10,
      width: '100vw',
      height: '100vh',
      gap: 0,
      layout: 'full',
      visible: 'both'
    };
    Object.assign(this.options, options);
    this.visibleSlices = this.options.visible;
    this.totalSlices = this.options.slices < 2 ? 2 : this.options.slices;
    this.layout();
  }

  private layout = (): void => {
    const width = typeof this.options.width === 'number' ? `${this.options.width}px` : this.options.width;
    const height = typeof this.options.height === 'number' ? `${this.options.height}px` : this.options.height;
    const gap = `${this.options.gap}px`;
    let innerHTML = '';

    for(let i=0; i<this.totalSlices; i++) {
      innerHTML += `<div class="slice slice--${i % 2 === 0 ? 'even' : 'odd'}">`;//偶数・奇数でeven, oddを割り当て
      innerHTML += `<div class="slice__inner">`;
      const left = `calc(-${width} / ${this.totalSlices} * ${i})`;
      const top = `calc(-${height} / ${this.totalSlices} * ${i})`;//horizontalの場合使用

      //polygon使用して画像を切り出す, 必要部分だけを切り出すことができる
      const bgimage = i % 2 === 0 ? `url(${this.options.images.even})` : `url(${this.options.images.odd})`;
      innerHTML += this.options.orientation === 'vertical' ?
        `<div class="slice__bg" style="background-image: ${bgimage}; left: ${left};"></div>` :
        `<div class="slice__bg" style="background-image: ${bgimage}; top: ${top};"></div>`;
      innerHTML += `</div></div>`;//sliceとslice__innerの閉じタグ
    }

    this.DOM.el.innerHTML = innerHTML;
    this.DOM.slices = {
      all: Array.from(this.DOM.el.querySelector('.slice')),
      get even() {return this.all.filter(slice => slice.classList.contains('slice--even'))},
      get odd() {return this.all.filter(slice => slice.classList.contains('slice--odd'))},
    };
    this.DOM.el.classList.add(`slices--${this.options.orientation}`);

    this.DOM.el.style.setProperty(`--slices-width`, width);
    this.DOM.el.style.setProperty(`slices-height`, height);
    this.DOM.el.style.setProperty(`--slices`, this.options.slices);//grid-template-rows: repeat(var(--slices), 1fr); の値となって画面を分ける
    this.DOM.el.style.setProperty(`--gap`, gap);

    if ( this.options.layout === 'offset' ) {
      this.DOM.el.classList.add('slices--layout-offset');
    }
  }
}

window.DualImageLayout = DualImageLayout;