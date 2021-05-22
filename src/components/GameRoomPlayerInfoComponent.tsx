import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTv } from '@fortawesome/free-solid-svg-icons';

import { GameRoomPlayerInfoProps } from '../containers/GameRoomPlayerInfoContainer';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';

const GameRoomPlayerInfoComponent = (props: GameRoomPlayerInfoProps) => {


  console.log(props.gameRoomPlayerInfo);
  const players = props.gameRoomPlayerInfo
    ? props.gameRoomPlayerInfo.playerNames
    : [];

  const gamePads = players.map((playerName: string, index: number) => {
    return (<GamePadDisplayContainer playerId={`P${index + 1}`} playerName={playerName} key={`GamePadDisplayContainer-${index}`} />);
  });

  return (
    <div>

      <div>
        <small>
          ping: {(props.ping)}
        </small>
      </div>

      <div id="gamepads">
        {gamePads}
      </div>

      { props.gameIsPendingStart && (

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
