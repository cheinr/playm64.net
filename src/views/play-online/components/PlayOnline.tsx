import { KeyboardEvent, useEffect, useState } from 'react';
import { Button, Card, Form, FormControl, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import LinkButton from '../../../components/common/LinkButton';
import { M64_EMU_CONFIG_OVERRIDES_KEY } from '../../../components/inputs/AdvancedEmulatorConfigOverridesInputComponent';
import RomSelector from '../../../components/inputs/RomSelector';
import GameControlsDisplayContainer from '../../../containers/GameControlsDisplayContainer';
import GameSaveManagementContainer from '../../../containers/GameSaveManagementContainer';
import InputOptionsContainer from '../../../containers/InputOptionsContainer';
import AdvancedEmulatorConfigOverridesContainer from '../../../containers/inputs/AdvancedEmulatorConfigOverridesInputContainer';
import ErrorMessageContainer from '../../../containers/inputs/ErrorMessageContainer';
import Mupen64PlusEmuContainer from '../../../containers/Mupen64PlusEmuContainer';
import { UI_STATE } from '../../../redux/reducers';
import { listPersistedROMs } from '../../../romUtils';
import GameOverviewContainer from '../containers/GameOverviewContainer';
import GameRoomPlayerInfoContainer from '../containers/GameRoomPlayerInfoContainer';
import { PlayOnlineProps } from '../containers/PlayOnlineContainer';
import EditableAlias from './EditablePlayerAliasComponent';

export default function PlayOnline(props: PlayOnlineProps) {

  const [romSelected, setRomSelected] = useState(false);
  const [libraryHasROMSLoaded, setLibraryHasROMSLoaded] = useState(false);
  const [
    shouldDisplayEmulatorConfigOverridesContainer,
    setShouldDisplayEmulatorConfigOverridesContainer
  ] = useState(false);
  const [
    shouldDisplayGameSaveManagementModal,
    setShouldDisplayGameSaveManagementModal
  ] = useState(false);


  useEffect(() => {
    listPersistedROMs().then((romKeys) => {
      setLibraryHasROMSLoaded(romKeys.length > 0);

      if (romKeys.length <= 0) {
        props.setIsAutoSelectROMEnabled(false);
      }
    }).catch((err) => {
      console.error('Unable to check for loaded ROMs: ', err);
    });
  });

  const onLoadedROMsChange = (newROMNames: string[]) => {
    setLibraryHasROMSLoaded(newROMNames.length > 0);
  };

  let regionOptions = null;
  if (props.hostRegionOptions) {
    regionOptions = props.hostRegionOptions.map((o: any, index: number) => {
      const capacityPercent = (o.capacity * 1).toFixed(1);
      return (
        <option value={o.regionValue} key={`regionOption-${index}`} >
          { o.regionName} ({ capacityPercent} % capacity available)
        </option >);
    });
  }

  const onJoinCodeInputKeyDown = (e: KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      joinGame();
    }
  };

  const toggleAutoSelectROMEnabled = () => {
    props.setIsAutoSelectROMEnabled(!props.isAutoSelectROMEnabled);
  };

  const [selectedROMName, setSelectedROMName] = useState('');
  const onROMSelect = (romName: string, romData: ArrayBuffer) => {

    if (selectedROMName !== romName) {
      props.setSelectedROMData(romData);
      setSelectedROMName(romName);

      // TODO - Ideally we wouldn't be writing and reading to this from different components
      const existingPersistedOverrides: any = JSON.parse(localStorage.getItem(M64_EMU_CONFIG_OVERRIDES_KEY) ?? '{}');

      if (existingPersistedOverrides[romName]) {
        props.setEmulatorConfigOverrides(existingPersistedOverrides[romName]);
      }
    }
    setRomSelected(true);
  };

  const joinGame = () => {
    if (props.joinGameRoomInput && props.alias && (romSelected || props.isAutoSelectROMEnabled)) {
      props.joinGame(props.joinGameRoomInput, props.isAutoSelectROMEnabled);
    }
  };

  if (props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
    || props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
    || props.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
    || props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION) {

    return (
      <div className="text-center">

        <GameOverviewContainer />

        <Mupen64PlusEmuContainer />

        <ErrorMessageContainer />

        <GameRoomPlayerInfoContainer />

        <GameControlsDisplayContainer />
      </div>

    );

  } else {


    return (
      <div>
        <div>

          <Modal
            size="lg"
            show={shouldDisplayEmulatorConfigOverridesContainer}
            onHide={() => setShouldDisplayEmulatorConfigOverridesContainer(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Advanced Emulator Config Overrides
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <AdvancedEmulatorConfigOverridesContainer selectedROMGoodName={selectedROMName} />
            </Modal.Body>
          </Modal>

          <Modal
            size="lg"
            show={shouldDisplayGameSaveManagementModal}
            onHide={() => setShouldDisplayGameSaveManagementModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Manage Game Saves
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <GameSaveManagementContainer />
            </Modal.Body>
          </Modal>


          <div className="text-center pt-4">
            <div>
              <Link to="/">
                <Button variant="primary">Main Menu</Button>
              </Link>
            </div>
          </div>

          <div className="row py-4">
            <div className="col text-center mh-100">
              <Card className="h-100">
                <EditableAlias />
              </Card>
            </div>

            <div className="col text-center mh-100">

              <Card className="h-100">
                <div>
                  Input Device
                  <InputOptionsContainer />
                </div>
              </Card>
            </div>
          </div>

          <div>

            {!props.showHostingMenu && libraryHasROMSLoaded &&
              <Form onClick={toggleAutoSelectROMEnabled}>
                <div className="mb-3">
                  <Form.Check type="checkbox" label="Auto select ROM from your library?"
                    checked={props.isAutoSelectROMEnabled}
                    onChange={() => {/* handled by Form Click handler */ }}
                  />
                </div>
              </Form>
            }

            {(props.showHostingMenu || !props.isAutoSelectROMEnabled) &&
              <RomSelector onROMSelect={onROMSelect} onLoadedROMsChange={onLoadedROMsChange} />
            }

            <div className="row pb-3">
              <LinkButton onClick={() => setShouldDisplayGameSaveManagementModal(true)}>Manage Game Saves</LinkButton>
            </div>

            {romSelected &&
              <div className="text-center pb-3">
                <Button onClick={() => setShouldDisplayEmulatorConfigOverridesContainer(true)}>
                  Set Emulator Config Overrides
               </Button>
              </div>
            }


            { /* TODO - HostingFormComponent */
              props.showHostingMenu &&

              <div className="text-center">

                <div className="py-2">
                  <label>select game room region:

                    {regionOptions &&
                      <Form.Select onChange={props.onHostingRegionSelectChange} title={props.hostingRegion}>
                        {regionOptions}
                      </Form.Select>
                    }

                    {!regionOptions && <small>Loading...</small>}
                  </label>
                </div>

                <div>

                  {romSelected
                    ? <Button variant="success"
                      name="createGameButton"
                      onClick={() => props.createGameRoom()}
                      disabled={props.alias === '' || !regionOptions || !romSelected}>
                      Create Game Room
                  </Button>
                    : <OverlayTrigger placement='right'
                      overlay={<Tooltip show={false}>You must select a ROM to play before hosting a game</Tooltip>}>

                      <span className="d-inline-block">

                        <Button variant="success"
                          name="createGameButton"
                          onClick={() => props.createGameRoom()}
                          disabled={props.alias === '' || !regionOptions || !romSelected}
                          style={{ pointerEvents: 'none' }}>
                          Create Game Room

                      </Button>
                      </span>
                    </OverlayTrigger>
                  }
                </div>
                <div>
                  <small>or - &nbsp;
                    <LinkButton onClick={() => props.toggleHostingMenu()} >join an existing game</LinkButton>
                  </small>
                </div>

              </div>
            }

            { /* TODO - GameRoomJoinComponent */
              !props.showHostingMenu &&

              <div className="row justify-content-center py-2">
                <div className="col-8">
                  <InputGroup className="">
                    <FormControl name="joinCodeInput"
                      disabled={props.alias === ''}
                      className="text-center"
                      value={props.joinGameRoomInput}
                      onChange={props.onJoinGameRoomInputChange}
                      onKeyDown={onJoinCodeInputKeyDown}
                      placeholder="Enter a join code...">
                    </FormControl>

                    {(romSelected || props.isAutoSelectROMEnabled)
                      ? <Button
                        variant="success"
                        name="joinGameButton"
                        onClick={joinGame}
                        disabled={
                          props.alias === '' || !props.joinGameRoomInput}>

                        Join Game
                    </Button>
                      : <OverlayTrigger placement='right'
                        overlay={<Tooltip show={false}>You must select a ROM to play before joining a game</Tooltip>}>

                        <span className="d-inline-block">
                          <Button
                            variant="success"
                            name="joinGameButton"
                            disabled
                            style={{ pointerEvents: 'none' }}>
                            Join Game
                        </Button>
                        </span>
                      </OverlayTrigger>
                    }
                  </InputGroup>
                </div>

                <div className="text-center">
                  <small>or - &nbsp;
                    <LinkButton onClick={() => { props.toggleHostingMenu(); }}>
                      host a new game
                    </LinkButton>
                  </small>
                </div>
              </div>
            }

          </div>

          <div className={`connection-state-message text-center ${props.connectionStateMessage.isError ? 'connection-state-error' : ''}`}>
            <small>{props.connectionStateMessage.message}</small>
          </div>

        </div >
      </div >
    );
  }
}
