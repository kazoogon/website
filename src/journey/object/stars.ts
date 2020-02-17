import * as THREE from 'three';
import * as CONST from '../../utils/const';

export default class Stars extends THREE.Group {
  constructor() {
    super();
    this.createStars();
  }

  public update = (): void => {
    this.rotation.y += 0.0005;
  };

  private createStars = (): void => {
    const geometry = new THREE.Geometry();
    const size = 3000;
    const numOfStars = 200;

    for (let i = 0; i < numOfStars; i++) {
      geometry.vertices.push(
        new THREE.Vector3(
          size * (Math.random() - 0.5),
          size * (Math.random() - 0.5),
          size * (Math.random() - 0.5)
        )
      );
    }

    const material = new THREE.PointsMaterial({
      size: 4,
      color: CONST.COLOR.UNIVERSE_STAR
    });

    this.add(new THREE.Points(geometry, material));
  }
}