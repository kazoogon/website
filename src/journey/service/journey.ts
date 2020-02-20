// @ts-nocheck
//from node module
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Intersection} from "three/src/core/Raycaster";
import anime from 'animejs/lib/anime.es.js';
import {debounce} from 'lodash';

//from this app
import Earth from '../object/earth';
import Stars from '../object/stars';
import {Country} from '../object/country';
import * as CONST from '../../utils/const';
import * as Common from '../../utils/common';

export default class serviceWorld {

  //three.js parts
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public earth: Earth;
  public stars: Stars;
  public renderer: THREE.WebGLRenderer;
  public controller: OrbitControls;

  //refs
  private appRef: HTMLDivElement;
  private canvasRef: HTMLDivElement;

  //selected country elements
  private currentDescDiv = {};//{HTMLDivElement, HTMLDivElement, ...}
  private currentNameDiv = {};//{HTMLDivElement, HTMLDivElement, ...}
  private currentFlagImg = {};//{HTMLImageElement, HTMLImageElement, ...}
  private currentPicImg  = {};//{HTMLImageElement, HTMLImageElement, ...}

  //class name
  private _picVisible = 'pic-visible';
  private _descVisible = 'desc-visible';
  private _flagVisible = 'flag-visible';
  private _nameVisible = 'name-visible';

  //anime.js
  private animeShowDesc = []; //[anime, anime, ...]
  private animeShowName = []; //[anime, anime, ...]
  private animeShowPic  = []; //[anime, anime, ...]
  private animeShowFlag = []; //[anime, anime, ...]

  private HEIGHT: number;
  private WIDTH: number;

  /**
   * earth is moving or not
   * @type {boolean}
   */
  private isMoveEarth = true;

  /**
   * mouse is on the country point or not
   * @type {boolean}
   */
  private isOnCountryPoint = false;

  /**
   * country info is closed or not
   * @type {boolean}
   */
  private isClosingCountryInfo = false;

  public constructor(
    appRef: HTMLDivElement,
    canvasRef: HTMLDivElement,
  ) {
    this.appRef = appRef;
    this.canvasRef = canvasRef;
  }

  public createScene(): void {
    this.scene = new THREE.Scene();
  }

  public createCam(): void {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  }

  public createLight(): void {
    const ambientLight = new THREE.AmbientLight(CONST.COLOR.AMBIENT_LIGHT);
    this.scene.add(ambientLight);
  }

  public createGeometry(): void {
    this.setCamPosByCountryIndex(0);//set default cam position

    this.canvasRef.addEventListener(CONST.EVENT.MOUSE_MOVE, this.handleMouseMove);
    this.canvasRef.addEventListener(CONST.EVENT.TOUCH_START, this.handleMouseMove);//for smartphone

    this.stars = new Stars();
    this.scene.add(this.stars);
    this.scene.add(this.earth);
  }

  /**
   * set camera position to japan
   * @param {number} countryIndex
   */
  private setCamPosByCountryIndex(countryIndex: number): void {
    this.earth = new Earth();

    const center = new THREE.Vector3();//center position (地核)
    const city = this.earth.countryPoints[countryIndex].position;

    //tokyo - centerのベクトル作成
    let centerVector = city.clone().sub(center);
    //単位ベクトルに変換 (normalize)
    centerVector = centerVector.normalize();
    //逆向きベクトル作成 (pointから宇宙に向かって伸びる)
    // let targetVector = centerVector.clone().negate();
    let targetVector = centerVector.clone();
    //カメラとpointの距離
    const distance = 100;
    targetVector = targetVector.multiplyScalar(distance);
    //camera position set
    const camPos = targetVector.add(this.earth.position);

    this.camera.position.copy(camPos);
  }

  public createRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({alpha: true});//alpha = transparent
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    this.canvasRef.appendChild(this.renderer.domElement);
  }

  public trackControll(): void {
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.controller.minDistance = 170;
    this.controller.maxDistance = 200;
    this.controller.maxPolarAngle = Math.PI / 1.5;

    this.controller.enablePan = false;
    this.controller.enableZoom = false;
    this.controller.enableDamping = true;
    this.controller.minPolarAngle = 0.8;
    this.controller.maxPolarAngle = 2.4;
    this.controller.dampingFactor = .17;
    this.controller.rotateSpeed = .17;
  }

  public setResizeEvent(): void {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;

    window.addEventListener(CONST.EVENT.RESIZE, debounce(() => {
      this.HEIGHT = window.innerHeight;
      this.WIDTH = window.innerWidth;
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      this.camera.aspect = this.WIDTH / this.HEIGHT;
      this.camera.updateProjectionMatrix();
    }, 50));
  }

  public animate(): void {
    requestAnimationFrame(() => {
      this.animate();
    });

    if (this.isMoveEarth) this.earth.update();
    this.stars.update();

    this.controller.update();

    this.renderer.render(this.scene, this.camera);
  }

  private handleMouseMove = (event: MouseEvent): void => {
    if (this.isOnCountryPoint || this.isClosingCountryInfo) return;

    const initializedMousePos = Common.getInitializedMousePosByMouseEvent(event);

    const intersects = this.getObjOnMouse(initializedMousePos);

    if (intersects.length > 0) {
      this.verifyOnCountryPoint(intersects);
    }
  };

  /**
   * get some object which mouse hits by raycaster
   * raycasterを使用し、マウスがぶつかった物体を取得する
   * (refer to https://ics.media/tutorial-three/raycast/)
   *
   * @param {{x: number; y: number}} initializedMousePos
   * @returns {Intersection[]}
   */
  private getObjOnMouse = (initializedMousePos: {x:number, y:number}): Intersection[] => {
    // raycaster = マウス位置からまっすぐに伸びる光線ベクトルを生成
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(initializedMousePos, this.camera);

    // その光線とぶつかったオブジェクトを得る(第２引数recursive=trueで、groupになっているmeshも対応)
    const intersects = raycaster.intersectObjects(this.earth.children, true);

    return intersects;
  }

  /**
   * verify mouse is on country point object or not
   * マウスが国のポイント上にいるかどうか調べる
   *
   * @param {Intersection[]} intersects
   */
  private verifyOnCountryPoint = (intersects: Intersection[]): void => {
    let onCountryPointTmp = false;

    this.earth.countryPoints.map((city) => {
      if (city === intersects[0].object.parent) {
        const {screenX, screenY} = this.calcCenterOfCountryPoint(intersects);
        this.showCountryInfo(city.name, screenY, screenX);
        onCountryPointTmp = true;
        this.isMoveEarth = false;
      }

      this.isOnCountryPoint = onCountryPointTmp;
    });
  };

  /**
   * get center coordinate of object which mouse hits
   * mouse on した pointのobject中心部分座標取得
   *
   * @param {Intersection[]} intersects
   * @returns {{screenX: number; screenY: number}}
   */
  private calcCenterOfCountryPoint = (intersects: Intersection[]): {screenX: number; screenY: number} => {
    const box3 = new THREE.Box3().setFromObject(intersects[0].object);
    const centerOfObj = box3.getCenter(new THREE.Vector3());
    const objVector3 = centerOfObj.project(this.camera).clone();//-1〜+1の範囲でscreen上の値を取得

    //screen上の実際の数値を算出 (画面上x, y軸 -1~1の範囲がparameter)
    const screenX = (this.WIDTH / 2) * (objVector3.x + 1.0);
    const screenY = (this.HEIGHT / 2) * (-objVector3.y + 1.0);

    return {screenX, screenY};
  }

  private showCountryInfo = (cityName: string, screenY: number, screenX: number): void => {
    const contry = new Country;
    const countryInfo = contry.getCountryInfoByName(cityName);

    this.showPic(countryInfo, screenY, screenX);
    this.showFlag(countryInfo, screenY, screenX);
    this.showName(countryInfo, screenY, screenX);
    this.showDesc(countryInfo, screenY, screenX);
  }

  private showPic = (countryInfo: Country, screenY: number, screenX: number): void => {
    const picImg = this.currentPicImg[countryInfo.index] = document.createElement('img');

    picImg.classList.add(this._picVisible + countryInfo.index);
    picImg.src = `${CONST.PATH.IMG_JOURNEY_COUNTRY}${countryInfo.name}.png`;
    picImg.height = 150;
    picImg.width = 150;
    picImg.style.position = 'absolute';
    picImg.style.top = `calc(${screenY}px - ${picImg.height / 2}px)`;
    picImg.style.left = `calc(${screenX}px - ${picImg.width / 2}px)`;
    this.appRef.appendChild(picImg);

    this.animeShowPic[countryInfo.index] = anime({
      targets: `.${this._picVisible}${countryInfo.index}`,
      scale: [0, 1],
      duration: 900,
      easing: CONST.EASE.OUT_ELASTIC,
      begin: () => {
        picImg.addEventListener(CONST.EVENT.MOUSE_LEAVE, () => this.handleMouseLeaveInfo(countryInfo));
        //for smartphone. 「once」1回event実行されたら、event削除される
        this.canvasRef.addEventListener(CONST.EVENT.TOUCH_START, () => this.handleMouseLeaveInfo(countryInfo), {once: true});
      },
    });
  };

  private showFlag = (countryInfo, screenY: number, screenX: number): void => {
    const flagImg = this.currentFlagImg[countryInfo.index] = document.createElement('img');

    flagImg.classList.add(this._flagVisible + countryInfo.index);
    flagImg.src = `${CONST.PATH.IMG_JOURNEY_FLAG}${countryInfo.name}.svg`;
    flagImg.height = 30;
    flagImg.width = 30;
    flagImg.style.position = 'absolute';
    flagImg.style.top = `calc(${screenY}px - ${flagImg.offsetHeight / 2}px - 65px)`;
    flagImg.style.left = `calc(${screenX}px - ${flagImg.offsetWidth / 2}px - 65px)`;
    this.appRef.appendChild(flagImg);

    this.animeShowFlag[countryInfo.index] = anime({
      targets: `.${this._flagVisible}${countryInfo.index}`,
      delay: 100,
      scale: [0, 1],
      rotate: [15, -5],
      duration: 900,
      easing: CONST.EASE.OUT_ELASTIC,
    });
  };

  private showName = (countryInfo, screenY: number, screenX: number): void => {
    const nameDiv = this.currentNameDiv[countryInfo.index] = document.createElement('div');

    nameDiv.classList.add(this._nameVisible + countryInfo.index);
    nameDiv.innerHTML = countryInfo.name.toUpperCase();
    nameDiv.style.position = 'absolute';
    nameDiv.style.top = `calc(${screenY}px - ${nameDiv.offsetHeight / 2}px - 50px)`;
    nameDiv.style.left = `calc(${screenX}px - ${nameDiv.offsetWidth / 2}px + 50px)`;
    this.appRef.appendChild(nameDiv);

    this.animeShowName[countryInfo.index] = anime({
      targets: `.${this._nameVisible}${countryInfo.index}`,
      delay: 100,
      scale: [0, 1],
      duration: 900,
      easing: CONST.EASE.OUT_ELASTIC,
    });
  };

  private showDesc = (countryInfo, screenY: number, screenX: number): void => {
    const descDiv = this.currentDescDiv[countryInfo.index] = document.createElement('div');

    descDiv.classList.add(this._descVisible + countryInfo.index);
    descDiv.innerHTML = countryInfo.desc;
    descDiv.style.position = 'absolute';
    this.appRef.appendChild(descDiv);
    descDiv.style.top = `calc(${screenY}px - ${descDiv.offsetHeight / 2}px + 80px)`;
    descDiv.style.left = `calc(${screenX}px - ${descDiv.offsetWidth / 2}px + 70px)`;

    this.animeShowDesc[countryInfo.index] = anime({
      targets: `.${this._descVisible}${countryInfo.index}`,
      delay: 300,
      scale: [0, 1],
      rotate: [15, -5],
      duration: 900,
      easing: CONST.EASE.OUT_ELASTIC,
    })
  };

  private handleMouseLeaveInfo = (countryInfo): void => {
    if (!this.isClosingCountryInfo) {
      this.isClosingCountryInfo = true;
      this.isOnCountryPoint = false;
      this.isMoveEarth = true;

      Promise.all([
        this.closePic(countryInfo),
        this.closeName(countryInfo),
        this.closeFlag(countryInfo),
        this.closeDesc(countryInfo)
      ])
        .then(result => {
          this.isClosingCountryInfo = false;
        })
        .catch(reject => {

        })
    }
  };

  private closePic = async (countryInfo): Promise<void> => {
    await anime({
      targets: [`.${this._picVisible}${countryInfo.index}`],
      scale: [1, 0],
      duration: 500,
      easing: CONST.EASE.IN_OUT_CUBIC,
      // delay: 100,
      // easing: 'spring(1, 80, 10, 0)',
      begin: () => {
        this.animeShowPic[countryInfo.index].pause();
      },
      complete: () => {
        Common.removeElementItself(this.currentPicImg[countryInfo.index]);
      }
    }).finished;
  };

  private closeName = async (countryInfo): Promise<void> => {
    await anime({
      targets: [`.${this._nameVisible}${countryInfo.index}`],
      scale: [1, 0],
      duration: 500,
      easing: CONST.EASE.IN_OUT_CUBIC,
      begin: () => {
        this.animeShowName[countryInfo.index].pause();
      },
      complete: () => {
        Common.removeElementItself(this.currentNameDiv[countryInfo.index]);
      }
    }).finished;
  };

  private closeFlag = async (countryInfo): Promise<void> => {
    await anime({
      targets: [`.${this._flagVisible}${countryInfo.index}`],
      scale: [1, 0],
      duration: 500,
      easing: CONST.EASE.IN_OUT_CUBIC,
      begin: () => {
        this.animeShowFlag[countryInfo.index].pause();
      },
      complete: () => {
        Common.removeElementItself(this.currentFlagImg[countryInfo.index]);
      }
    }).finished;
  };

  private closeDesc = async (countryInfo): Promise<void> => {
    await anime({
      targets: [`.${this._descVisible}${countryInfo.index}`],
      scale: [1, 0],
      duration: 500,
      easing: CONST.EASE.IN_OUT_CUBIC,
      begin: () => {
        this.animeShowDesc[countryInfo.index].pause();
      },
      complete: () => {
        Common.removeElementItself(this.currentDescDiv[countryInfo.index]);
      }
    }).finished;
  };
}