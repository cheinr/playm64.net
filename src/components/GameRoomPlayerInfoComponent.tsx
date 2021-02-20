import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTv } from '@fortawesome/free-solid-svg-icons';

import { GameRoomPlayerInfoProps } from '../containers/GameRoomPlayerInfoContainer';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';

const GameRoomPlayerInfoComponent = (props: GameRoomPlayerInfoProps) => {

  const players = props.gameRoomPlayerInfo
    ? props.gameRoomPlayerInfo.playerNames
    : [];

  const gamePads = players.map((playerName: string, index: number) => {
    return (<GamePadDisplayContainer playerName={playerName} key={`GamePadDisplayContainer-${index}`} />);
  });

  return (
    <div>

      <div>
        <small>
          ping: {(props.ping)}
        </small>
      </div>

      {gamePads}

      {
        props.localPlayerIsHost && (
          <div>
            <button onClick={props.onStartGameClick}>
              Start Game
            </button>
          </div>
        )
      }

    </div >


  );
};

export default GameRoomPlayerInfoComponent;
