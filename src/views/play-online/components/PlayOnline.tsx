import { KeyboardEvent, useEffect, useState } from 'react';
import { Button, Card, InputGroup, Dropdown, Form, FormControl } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";

import { PlayOnlineProps } from '../containers/PlayOnlineContainer';
import InputOptionsContainer from '../../../containers/InputOptionsContainer';
import { UI_STATE } from '../../../redux/reducers';
import LinkButton from '../../../components/common/LinkButton';
import RomSelector from '../../../components/inputs/RomSelector';
import EditableAlias from './EditablePlayerAliasComponent';

import ErrorMessageContainer from '../../../containers/inputs/ErrorMessageContainer';
import GameControlsDisplayContainer from '../../../containers/GameControlsDisplayContainer';
import GameOverviewContainer from '../containers/GameOverviewContainer';
import GameRoomPlayerInfoContainer from '../GameRoomPlayerInfoContainer';
import Mupen64PlusEmuContainer from '../../../containers/Mupen64PlusEmuContainer';



export default function PlayOnline(props: PlayOnlineProps) {

  const [romSelected, setRomSelected] = useState(false);

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

  console.log(regionOptions);

  const onJoinCodeInputKeyDown = (e: KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      props.joinGame(props.joinGameRoomInput);
    }
  }

  const onROMSelect = (romName: string, romData: ArrayBuffer) => {
    console.log(romName);
    props.setSelectedROMData(romData);
    setRomSelected(true);
  }

  if (props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
    || props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
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

            <RomSelector onROMSelect={onROMSelect} />

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
                  <Button variant="success"
                    name="createGameButton"
                    onClick={() => props.createGameRoom()}
                    disabled={props.alias === '' || !regionOptions || !romSelected}>
                    Create Game Room
                  </Button>

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
                    <FormControl name="joinCodeInput" disabled={props.alias === ''}
                      className="text-center"
                      value={props.joinGameRoomInput}
                      onChange={props.onJoinGameRoomInputChange}
                      onKeyDown={onJoinCodeInputKeyDown}
                      placeholder="Enter a join code...">
                    </FormControl>
                    <Button
                      variant="success"
                      name="joinGameButton"
                      onClick={() => props.joinGame(props.joinGameRoomInput)}
                      disabled={props.alias === '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT) || !romSelected}>
                      Join Game
                    </Button>
                  </InputGroup>
                </div>

                <div className="text-center">
                  <small>or - &nbsp;
                    <LinkButton onClick={() => { props.toggleHostingMenu() }}>
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
