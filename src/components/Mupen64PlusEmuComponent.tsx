import { faFileDownload, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, RefObject } from 'react';
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { Mupen64PlusEmuProps } from '../containers/Mupen64PlusEmuContainer';
import { UI_STATE } from '../redux/reducers';
import stats from '../Stats';
import './Mupen64PlusEmuComponent.css';


interface Mupen64PlusEmuComponentState {
  shouldShowSaveDumpConfirmModal: boolean;
  saveDumpResultMessage: string;
  saveDumpErrorMessage: string;
}

class Mupen64PlusEmuComponent extends React.Component<Mupen64PlusEmuProps, Mupen64PlusEmuComponentState> {

  private canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  private statsRef: RefObject<HTMLDivElement> = React.createRef();
  private displayStats = false;
  state: Mupen64PlusEmuComponentState = {
    shouldShowSaveDumpConfirmModal: false,
    saveDumpResultMessage: '',
    saveDumpErrorMessage: '',
  };

  public componentDidMount() {

    if (!this.displayStats) {
      this.statsRef.current!.style.display = 'none';
    }

    stats.dom.style.top = '';
    stats.dom.style.left = '';
    stats.dom.style.position = 'relative';
    stats.dom.style.zIndex = '1';
    console.log(stats.dom);
    this.statsRef.current?.appendChild(stats.dom);
  }

  public render(): ReactNode {

    const makeFullScreen = () => {
      this.canvasRef.current?.requestFullscreen().catch((err) => {
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
          this.setState({ saveDumpErrorMessage: `Failed to dump save files: ${err}` });
        });
      }
    };

    const handleCloseSaveDumpConfirmModal = () => {
      this.setState({ shouldShowSaveDumpConfirmModal: false });
    };

    const showSaveDumpConfirmModal = () => {
      this.setState({ shouldShowSaveDumpConfirmModal: true });
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

        <div id="EmuContainer">
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

            <canvas
              ref={this.canvasRef}
              className="emscripten"
              id="canvas"
              onContextMenu={(event) => event.preventDefault()}></canvas>
          </div>
        </div>

        <div className="row">
          <div className="col">

            {this.props.localPlayerIsHost &&
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
                        onClick={this.props.onResumeNetplayGameClick}>
                        <FontAwesomeIcon icon={faPlay} />
                      </Button>
                      : <Button variant='success'
                        size='sm'
                        className="float-start"
                        onClick={this.props.onPauseNetplayGameClick}>
                        <FontAwesomeIcon icon={faPause} />
                      </Button>
                    }
                  </>
                }
              </>
            }
          </div>
          <Button variant="secondary"
            onClick={makeFullScreen}
            size="sm"
            className="col-md-auto mx-1">
            Fullscreen
          </Button>
          <Button variant="secondary"
            onClick={toggleStats}
            size="sm"
            className="col-md-auto mx-1">
            Toggle Stats
          </Button>

          <div className="col">
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
      </div >
    );
  }

}

export default Mupen64PlusEmuComponent;
