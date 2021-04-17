import createMupen64PlusWeb from 'mupen64plus-web';

import React, { ReactNode, Ref, RefObject } from 'react';

import { Mupen64PlusEmuProps } from '../containers/Mupen64PlusEmuContainer';


class Mupen64PlusEmuComponent extends React.Component {

  private canvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  public shouldComponentUpdate(nextProps: any, nextState: any) {
    return false;
  }

  public render(): ReactNode {


    const makeFullScreen = () => {
      this.canvasRef.current?.requestFullscreen();
    }


    return (
      <div>
        <canvas ref={this.canvasRef} className="emscripten" id="canvas" onContextMenu={(event) => event.preventDefault()}></canvas>

        <div>
          <button onClick={makeFullScreen}>Fullscreen</button>
        </div>
      </div >
    );
  }

};

export default Mupen64PlusEmuComponent;
