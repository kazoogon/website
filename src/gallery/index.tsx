// @ts-nocheck
import * as React from 'react';
import * as THREE from "three";
import {debounce} from 'lodash';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Vector3} from "three";
import * as CONST from "../utils/const";
import * as Common from "../utils/common";
import * as pictures from "./picturesData";
import {Promise} from "q";

export class Gallery extends React.Component {

  //refs
  private canvasRef = React.createRef<HTMLDivElement>();
  private HEIGHT: number;
  private WIDTH: number;

  //three.js parts
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controller: OrbitControls;

  private isMoving = true;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setBasicThreeComponents();
    this.setPictures();
    this.trackControll();
    this.animate();
    this.setResizeEvent();
  }

  private setBasicThreeComponents() {
    //scene
    this.scene = new THREE.Scene();

    //camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30);
    const camPos = new THREE.Vector3(0, 0, 13);
    this.camera.position.copy(camPos);

    //light
    const ambientLight = new THREE.AmbientLight(CONST.COLOR.WHITE);
    this.scene.add(ambientLight);

    this.setRenderer();
  }

  private setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({alpha: true});//alpha = transparent
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.canvasRef.appendChild(this.renderer.domElement);
  }

  private async setPictures(): Promise {
    for(let i = 0; i < pictures.name.length; i++) {
      const meshPic = await this.setMeshOfPic(pictures.name[i]);
      this.organizePicPos(i, meshPic);
      this.scene.add(meshPic);
    }
  }

  private setMeshOfPic(name: string): Promise<THREE.Mesh> {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 60, 60);
    const loader = new THREE.TextureLoader();

    return Promise(resolve => {
      loader.load(`${CONST.PATH.IMG_GALLERY}${name}.png`, (texture) => {
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          bumpScale: 1.0,
          transparent: true,
          side: THREE.DoubleSide, //裏からも見える
        });

        const mesh =  new THREE.Mesh(geometry, material);
        mesh.scale.x = texture.image.width / 100;
        mesh.scale.y = texture.image.height / 100;

        return resolve(mesh);
      });
    })
  }

  private organizePicPos(index: number, pictureMesh: THREE.Mesh): void {
    const radius = 7;
    // 角度をラジアンに変換
    // (const rad = degree * Math.PI / 180)
    const rad = (Math.PI * 2 / pictures.name.length) * index;
    // X座標 = 半径 x Cosθ
    const x = radius * Math.cos(rad);
    // Y座標 = 半径 x Sinθ
    const z = radius * Math.sin(rad);
    pictureMesh.position.set(x, 0, z);

    // 全写真を中心に向かせて、Y軸180°回転、外側に向かせる
    pictureMesh.lookAt(new Vector3(0, 0, 0));
    pictureMesh.rotateY(Math.PI);
  }

  private verifyHitObject(event: MouseEvent | TouchEvent): void {
    const initializedMousePos = Common.getInitializedMousePosByMouseEvent(event);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(initializedMousePos, this.camera);
    const intersects = raycaster.intersectObjects(this.scene.children, false);

    if (intersects.length > 0) {
      this.isMoving = !this.isMoving;
    }
  }

  private trackControll(): void {
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);

    //Y軸にしか動かせないようにする
    this.controller.maxPolarAngle = Math.PI / 2;
    this.controller.minPolarAngle = Math.PI / 2;

    this.controller.enablePan = false;
    this.controller.enableZoom = false;
    this.controller.enableDamping = true;
    this.controller.dampingFactor = .17;
    this.controller.rotateSpeed = .17;
  }

  private setResizeEvent(): void {
    window.addEventListener(CONST.EVENT.RESIZE, debounce(() => {
      this.HEIGHT = window.innerHeight;
      this.WIDTH = window.innerWidth;
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      this.camera.aspect = this.WIDTH / this.HEIGHT;
      this.camera.updateProjectionMatrix();
    }, 50));
  }

  private animate(): void {
    requestAnimationFrame(() => {
      this.animate();
    });

    if (this.isMoving) {
      this.scene.rotation.y += 0.002;
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div className="pictureStore" ref={ref => (this.appRef = ref)}>
        <div ref={ref => (this.canvasRef = ref)}
             onClick={(e)=>this.verifyHitObject(e)}
             onTouchStart={(e)=>this.verifyHitObject(e)}
        />
      </div>
    );
  }
}