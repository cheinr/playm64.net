import { faFileDownload, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, RefObject } from 'react';
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { Mupen64PlusEmuProps } from '../containers/Mupen64PlusEmuContainer';
import { UI_STATE } from '../redux/reducers';
import stats from '../Stats';
import './Mupen64PlusEmuComponent.css';
import TouchControlsOverlay from './inputs/TouchControlsOverlay';
import createMupen64PlusWeb from 'mupen64plus-web';

interface Mupen64PlusEmuComponentState {
  emulatorRunning: boolean;
  emulatorPauseCounts?: number[];
  emulatorControls?: any;
  pauseButtonDisabled: boolean;
  shouldShowSaveDumpConfirmModal: boolean;
  saveDumpResultMessage: string;
  saveDumpErrorMessage: string;
}

function pauseCountsEqual(pauseCounts1: number[], pauseCounts2: number[]) {
  return (pauseCounts1.length === pauseCounts2.length) && pauseCounts1.every((pauseCount, index) => {
    return pauseCounts2[index] === pauseCount;
  });
}

class Mupen64PlusEmuComponent extends React.Component<Mupen64PlusEmuProps, Mupen64PlusEmuComponentState> {

  private canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  private emuContainerRef: RefObject<HTMLDivElement> = React.createRef();
  private emuDisplayColumnRef: RefObject<HTMLDivElement> = React.createRef();
  private statsRef: RefObject<HTMLDivElement> = React.createRef();
  private joystickZoneRef: RefObject<HTMLDivElement> = React.createRef();
  private displayStats = false;
  state: Mupen64PlusEmuComponentState = {
    emulatorRunning: false,
    emulatorPauseCounts: undefined,
    emulatorControls: undefined,
    pauseButtonDisabled: false,
    shouldShowSaveDumpConfirmModal: false,
    saveDumpResultMessage: '',
    saveDumpErrorMessage: '',
  };

  public componentDidMount() {

    if (!this.displayStats) {
      this.statsRef.current!.style.display = 'none';
    }

    this.resizeCanvas();

    window.addEventListener('resize', (e) => {
      this.resizeCanvas();
    });

    stats.dom.style.top = '';
    stats.dom.style.left = '';
    stats.dom.style.position = 'relative';
    stats.dom.style.zIndex = '1';
    this.statsRef.current?.appendChild(stats.dom);

    this.checkEmulatorStart();
  }

  public componentDidUpdate() {
    this.checkEmulatorStart();
    this.checkEmulatorPause();
  }

  public componentWillUnmount() {
    if (this.state.emulatorControls) {
      this.state.emulatorControls.stop();
    }
  }

  private resizeCanvas() {
    if (this.canvasRef.current && this.emuDisplayColumnRef.current && this.emuDisplayColumnRef.current.parentElement) {

      const isFullscreen = !!document.fullscreenElement;

      const containerWidth = isFullscreen
        ? window.innerWidth
        : Math.min(this.emuDisplayColumnRef.current.parentElement.offsetWidth, 640);
      const containerHeight = isFullscreen
        ? window.innerHeight
        : Math.min(this.emuDisplayColumnRef.current.parentElement.offsetHeight, 480);

      const neededContainerHeightForWidth = containerWidth * (3 / 4);

      const widthToUse = containerWidth;
      const heightToUse = (neededContainerHeightForWidth > containerHeight)
        ? containerHeight
        : neededContainerHeightForWidth;

      this.emuDisplayColumnRef.current.style.width = `${widthToUse}px`;
      this.canvasRef.current.width = widthToUse;
      this.canvasRef.current.height = heightToUse;
    }
  }

  private checkEmulatorPause() {


    if (this.props.netplayPauseCounts) {

      if (!this.state.emulatorPauseCounts
        || !pauseCountsEqual(this.state.emulatorPauseCounts, this.props.netplayPauseCounts)) {

        if (this.state.emulatorControls) {
          this.state.emulatorControls.pause(this.props.netplayPauseCounts)
            .then((actualPauseCounts: number[]) => {
              this.props.confirmNetplayPause(actualPauseCounts);
            });
          this.setState({ emulatorPauseCounts: this.props.netplayPauseCounts });
        }
      }
    }

    if (this.state.emulatorPauseCounts && !this.props.netplayPauseCounts) {

      if (this.state.emulatorControls) {
        this.state.emulatorControls.resume();
        this.setState({ emulatorPauseCounts: undefined });
      }
    }
  }

  private checkEmulatorStart() {
    if (!this.state.emulatorRunning && (this.props.uiState === UI_STATE.PLAYING_LOCAL_SESSION
      || this.props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION
      || this.props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
      || this.props.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION)) {

      this.setState({ emulatorRunning: true });

      createMupen64PlusWeb({
        canvas: document.getElementById('canvas'),
        romData: this.props.selectedRomData,
        beginStats: stats.begin,
        endStats: stats.end,
        romConfigOptionOverrides: this.props.emulatorConfigOverrides,
        coreConfig: {
          emuMode: this.props.emuMode
        },
        netplayConfig: this.props.netplayConfig,
        locateFile: (path: string, prefix: string) => {

          console.log('path: %o', path);
          console.log('env: %o', process.env.PUBLIC_URL);

          const publicURL = process.env.PUBLIC_URL;

          if (path.endsWith('.wasm') || path.endsWith('.data') || (path.includes('index') && path.endsWith('worker.js'))) {
            return publicURL + '/dist/' + path;
          }

          return prefix + path;
        },
        setErrorStatus: (errorMessage: string) => {
          console.log('errorMessage: %s', errorMessage);
          // TODO dispatch(setEmulatorErrorMessage(errorMessage));
        }
      }).then(async (controls) => {

        this.setState({ emulatorControls: controls });
        return controls.start();

      }).catch((err) => {
        console.error('Exception during emulator initialization: %o', err);
      });
    }
  }

  public render(): ReactNode {

    const makeFullScreen = () => {
      this.emuContainerRef.current?.requestFullscreen().catch((err) => {
        console.error('Error while requesting full screen: ', err);
      });
    };

    const toggleStats = () => {

      this.displayStats = this.displayStats ? false : true;
      if (this.displayStats) {

        this.statsRef.current!.style.display = '';
      } else {
        this.statsRef.current!.style.display = 'none';
      }
    };

    const dumpNetplaySaveFiles = () => {

      if (this.props.gameServerConnection) {

        this.setState({
          saveDumpResultMessage: '',
          saveDumpErrorMessage: ''
        });

        this.props.gameServerConnection.forceDumpSaveFiles().then(() => {
          this.setState({ saveDumpResultMessage: 'Successfully dumped save files!' });
        }).catch((err: any) => {
          this.setState({ saveDumpErrorMessage: `Failed to dump save files: ${err} ` });
        });
      }
    };

    const handleCloseSaveDumpConfirmModal = () => {
      this.setState({ shouldShowSaveDumpConfirmModal: false });
    };

    const showSaveDumpConfirmModal = () => {
      this.setState({ shouldShowSaveDumpConfirmModal: true });
    };

    const onResumeNetplayGameClick = () => {
      this.props.onResumeNetplayGameClick();

      this.setState({ pauseButtonDisabled: true });
      setTimeout(() => {
        this.setState({ pauseButtonDisabled: false });
      }, 3000);

    };

    return (
      <div>

        <Modal show={this.state.shouldShowSaveDumpConfirmModal} onHide={handleCloseSaveDumpConfirmModal}>
          <Modal.Header closeButton>
            Are you sure?
          </Modal.Header>

          <Modal.Body>
            This will force a dump of any save data for this netplay session to your browsers persisted storage, making it available for future play sessions. There's a small chance of data corruption, and any existing save data may be overwritten for this game.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={dumpNetplaySaveFiles} variant="primary">
              Yes, overwrite my saves with the current netplay saves
            </Button>

            <p className="text-success">
              {this.state.saveDumpResultMessage && this.state.saveDumpResultMessage}
            </p>
            <p className="text-danger">
              {this.state.saveDumpErrorMessage && this.state.saveDumpErrorMessage}
            </p>
          </Modal.Footer>
        </Modal>

        <div id="EmuDisplayColumn" ref={this.emuDisplayColumnRef}>

          <div id="EmuContainer" ref={this.emuContainerRef}>
            <div>

              <div id="stats" ref={this.statsRef} className="EmuOverlay"></div>

              {this.props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION &&
                <div className="EmuOverlayCenter">

                  {this.props.localPlayerIsHost
                    ? <Button variant="success" onClick={this.props.onStartNetplayGameClick}>Start Game</Button>
                    : <>waiting for host to start the game</>
                  }
                </div>
              }

              {this.props.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION &&
                <div className="EmuOverlayCenter">
                  <h5 className="text-warning">PAUSED</h5>
                </div>
              }

              {this.props.isUsingTouchControls &&
                <TouchControlsOverlay />}

              <canvas
                ref={this.canvasRef}
                className="emscripten"
                id="canvas"
                onContextMenu={(event) => event.preventDefault()}></canvas>
            </div>
          </div>

          <div className="row">
            <div className="col-auto mr-auto">

              {this.props.isInNetplaySession && this.props.localPlayerIsHost &&
                <>
                  {this.props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
                    ? <Button variant='success'
                      size='sm'
                      className="float-start"
                      onClick={this.props.onStartNetplayGameClick}>
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                    : <>
                      {this.props.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
                        ? <Button variant='success'
                          size='sm'
                          className="float-start"
                          onClick={onResumeNetplayGameClick}>
                          <FontAwesomeIcon icon={faPlay} />
                        </Button>
                        : <Button variant='success'
                          size='sm'
                          className="float-start"
                          onClick={this.props.onPauseNetplayGameClick}
                          disabled={this.state.pauseButtonDisabled}>
                          <FontAwesomeIcon icon={faPause} />
                        </Button>
                      }
                    </>
                  }
                </>
              }
            </div>
            <div className="col-auto mx-auto">
              <Button variant="secondary"
                disabled={this.props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION}
                onClick={makeFullScreen}
                size="sm"
                className="mx-1">
                Fullscreen
              </Button>
              <Button variant="secondary"
                onClick={toggleStats}
                size="sm"
                className="mx-1">
                Toggle Stats
              </Button>
            </div>

            <div className="col-auto ml-auto">
              {this.props.isInNetplaySession && !this.props.localPlayerIsHost &&
                <DropdownButton size='sm'
                  title={(<FontAwesomeIcon icon={faFileDownload} />)}
                  className="float-end">
                  <Dropdown.Item onClick={showSaveDumpConfirmModal}>
                    Sync Netplay Saves
                 </Dropdown.Item>
                </DropdownButton>
              }
            </div>
          </div>
          <div className="row">
            {this.props.children}
          </div>
        </div>
      </div >
    );
  }

}

export default Mupen64PlusEmuComponent;
