import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTv } from '@fortawesome/free-solid-svg-icons';

import { GameRoomOverviewProps } from '../containers/GameRoomOverviewContainer';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';

const GameRoomOverviewComponent = (props: GameRoomOverviewProps) => {
  return (
    <div>
      <h4>Playing "{props.romShortName}"</h4>
      <h5>Join Code: {props.gameRoomId}</h5>
    </div >
  );
};

export default GameRoomOverviewComponent;
