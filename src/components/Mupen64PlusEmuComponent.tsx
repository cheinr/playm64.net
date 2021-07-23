import React, { ReactNode, RefObject } from 'react';

import stats from '../Stats';


class Mupen64PlusEmuComponent extends React.Component {

  private canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  private statsRef: RefObject<HTMLDivElement> = React.createRef();
  private displayStats: boolean = false;


  public componentDidMount() {

    if (!this.displayStats) {
      this.statsRef.current!.style.display = 'none';
    }

    this.statsRef.current?.appendChild(stats.dom);
  }

  public shouldComponentUpdate(nextProps: any, nextState: any) {
    return false;
  }

  public render(): ReactNode {


    const makeFullScreen = () => {
      this.canvasRef.current?.requestFullscreen();
    }

    const toggleStats = () => {

      this.displayStats = this.displayStats ? false : true;
      if (this.displayStats) {

        this.statsRef.current!.style.display = "";
      } else {
        this.statsRef.current!.style.display = "none";
      }
    }


    return (
      <div>
        <div id="stats" ref={this.statsRef} />
        <canvas ref={this.canvasRef} className="emscripten" id="canvas" onContextMenu={(event) => event.preventDefault()}></canvas>

        <div>
          <button onClick={makeFullScreen}>Fullscreen</button>
          <button onClick={toggleStats}>Toggle Stats</button>
        </div>
      </div >
    );
  }

};

export default Mupen64PlusEmuComponent;
