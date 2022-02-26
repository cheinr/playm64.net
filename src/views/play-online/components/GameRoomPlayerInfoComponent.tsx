import { Button } from 'react-bootstrap';

import { GameRoomPlayerInfoProps } from '../containers/GameRoomPlayerInfoContainer';
import ControllerPluginSlot from './ControllerPluginSlot';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';
import { UI_STATE } from '../../../redux/reducers';


const GameRoomPlayerInfoComponent = (props: GameRoomPlayerInfoProps) => {

  console.log(props.gameRoomPlayerInfo);
  const players = props.gameRoomPlayerInfo
    ? props.gameRoomPlayerInfo.clients
    : [];

  const gamePads = Array.from({ length: 4 }, (x, i) => i).map((index) => {
    const maybeMappedPlayer = players.find((player: any) => {
      return player.mappedController === index + 1;
    });


    const gamePadDisplay = maybeMappedPlayer ? (
      <GamePadDisplayContainer
        playerId={`P${maybeMappedPlayer.mappedController}`}
        playerName={maybeMappedPlayer.name}
        clientId={maybeMappedPlayer.clientId}
        key={`GamePadDisplayContainer-${maybeMappedPlayer.mappedController}`} />
    ) : undefined;

    const color = ['blue', 'red', 'green', 'yellow'][index];
    return (<ControllerPluginSlot color={color} playerNumber={index + 1}>
      { gamePadDisplay}
    </ControllerPluginSlot >);
  });

  const spectatorPads = players
    .filter((player: any) => player.mappedController === -1)
    .map((player: any, index: number) => {
      return (<div className="col-md-auto"><GamePadDisplayContainer
        playerId=''
        playerName={player.name}
        clientId={player.clientId}
        key={`GamePadSpectator-${index}`} /></div>);
    });


  let pingColor = 'red';
  if (props.ping < 120) {
    pingColor = 'yellow';
  }
  if (props.ping < 60) {
    pingColor = 'green';
  }

  return (
    <div>

      <div>
        <small>
          {(props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION &&
            <small style={{ color: 'red' }}>DISCONNECTED</small>)}

          {(props.uiState !== UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION &&
            <small style={{ color: pingColor }}>ping: {(props.ping)}</small>)}


        </small>
      </div>

      <div id="row gamepads" className="row g-1">
        {gamePads}
      </div>

      {props.localPlayerCanReassignControllers &&
        <p>drag and drop player controllers to reassign</p>
      }

      {spectatorPads.length > 0 &&
        <div>
          <hr />
          <h5>Spectators</h5>
          <div className="row justify-content-md-center">
            {spectatorPads}
          </div>
          <hr />
        </div>}


      {
        props.gameIsPendingStart && (

          <div>
            {
              props.localPlayerIsHost && (
                <div>
                  <Button variant="success" name="startGameButton" onClick={props.onStartGameClick}>
                    Start Game
                  </Button>
                </div>

              )
            }

            {
              !props.localPlayerIsHost && (
                <small>
                  waiting for P1 to start the game
                </small>

              )
            }
          </div>

        )
      }

      {
        !props.gameIsPendingStart && (

          <div>
            {
              props.localPlayerIsHost && (
                <div>
                  {!props.gameIsPaused &&
                    <Button variant="success" name="pauseGameButton" onClick={props.onPauseGameClick}>
                      Pause Game
                   </Button>
                  }

                  {props.gameIsPaused &&
                    <Button variant="success" name="resumeGameButton" onClick={props.onResumeGameClick}>
                      Resume Game
                   </Button>
                  }
                </div>

              )
            }
          </div>
        )
      }

    </div >


  );
};

export default GameRoomPlayerInfoComponent;
