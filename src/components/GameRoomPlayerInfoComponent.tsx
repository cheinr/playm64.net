import { GameRoomPlayerInfoProps } from '../containers/GameRoomPlayerInfoContainer';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';
import { UI_STATE } from '../redux/reducers';

const GameRoomPlayerInfoComponent = (props: GameRoomPlayerInfoProps) => {


  console.log(props.gameRoomPlayerInfo);
  const players = props.gameRoomPlayerInfo
    ? props.gameRoomPlayerInfo.playerNames
    : [];

  const gamePads = players.map((playerName: string, index: number) => {
    return (<GamePadDisplayContainer playerId={`P${index + 1}`} playerName={playerName} key={`GamePadDisplayContainer-${index}`} />);
  });

  let pingColor = "red";
  if (props.ping < 120) {
    pingColor = "yellow";
  }
  if (props.ping < 60) {
    pingColor = "green";
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
                  <button name="startGameButton" onClick={props.onStartGameClick}>
                    Start Game
                  </button>
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
