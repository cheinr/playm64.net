import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTv } from '@fortawesome/free-solid-svg-icons';

import { GameRoomOverviewProps } from '../containers/GameOverviewContainer';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';

const GameOverviewComponent = (props: GameRoomOverviewProps) => {
  return (
    <div>
      <h4>Playing "{props.romShortName.trim()}"</h4>

      { props.waitingForNetplayGameStart &&
        <h5 id="joinCode">Join Code: {props.gameRoomId}</h5>
      }
    </div >
  );
};

export default GameOverviewComponent;
