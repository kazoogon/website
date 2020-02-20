// @ts-nocheck
import * as React from 'react';
import ServiceWorld from './service/journey';

export class Journey extends React.Component {

  private appRef = React.createRef<HTMLDivElement>();
  private canvasRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const service = new ServiceWorld(this.appRef, this.canvasRef);
    service.createScene();
    service.createCam();
    service.createLight();
    service.createGeometry();
    service.createRenderer();

    service.trackControll();//** lookAt使えなくなる
    service.setResizeEvent();
    service.animate();
  }

  render() {
    return (
      <div className="worldMap" ref={ref => (this.appRef = ref)}>
        <div ref={ref => (this.canvasRef = ref)} />
      </div>
    );
  }
}