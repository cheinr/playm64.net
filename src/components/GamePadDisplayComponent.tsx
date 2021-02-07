import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

import { GamePadDisplayProps } from '../containers/GamePadDisplayContainer';

const GamePadDisplayComponent = (props: GamePadDisplayProps) => {

  const displayName = props.playerName !== null ? props.playerName : "<no input>";

  return (
    <div className="gamepad-display">
      <div>
        <FontAwesomeIcon icon={faGamepad} size="4x" />
      </div>
      <div>
        <small>{displayName}</small>
      </div>
    </div>
  );
};

export default GamePadDisplayComponent;
