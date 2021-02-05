import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faTv } from '@fortawesome/free-solid-svg-icons';

import { GameRoomOverviewProps } from '../containers/GameRoomOverviewContainer';

const GameRoomOverviewComponent = (props: GameRoomOverviewProps) => {

  return (
    <div>

      <h4>Playing "{props.romShortName}"</h4>
      <h5>Join Code: {props.gameRoomId}</h5>

      <div>
        <FontAwesomeIcon icon={faTv} size="10x" />
      </div>
      <FontAwesomeIcon icon={faGamepad} size="4x" />
    &nbsp;
      <FontAwesomeIcon icon={faGamepad} size="4x" />
    &nbsp;
      <FontAwesomeIcon icon={faGamepad} size="4x" />
    &nbsp;
      <FontAwesomeIcon icon={faGamepad} size="4x" />
    </div>
  );
};

export default GameRoomOverviewComponent;
