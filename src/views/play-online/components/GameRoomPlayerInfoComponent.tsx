import { Button } from 'react-bootstrap';

import { GameRoomPlayerInfoProps } from '../containers/GameRoomPlayerInfoContainer';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';
import { UI_STATE } from '../../../redux/reducers';

const GameRoomPlayerInfoComponent = (props: GameRoomPlayerInfoProps) => {

  console.log(props.gameRoomPlayerInfo);
  const players = props.gameRoomPlayerInfo
    ? props.gameRoomPlayerInfo.clients
    : [];

  const gamePads = players
    .filter((player: any) => player.mappedController !== -1)
    .map((player: any) => {
      return (<GamePadDisplayContainer
        playerId={`P${player.mappedController}`}
        playerName={player.name}
        key={`GamePadDisplayContainer-${player.mappedController}`} />);
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

      <div id="gamepads">
        {gamePads}
      </div>

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
    </div >


  );
};

export default GameRoomPlayerInfoComponent;
