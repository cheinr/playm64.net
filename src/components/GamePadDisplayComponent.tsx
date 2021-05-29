import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

import { GamePadDisplayProps } from '../containers/GamePadDisplayContainer';
import { UI_STATE } from '../redux/reducers';

const GamePadDisplayComponent = (props: GamePadDisplayProps) => {

  const displayName = (props.uiState !== UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION
    && props.playerName !== null)
    ? props.playerName
    : "<no input>";

  return (
    <div className="gamepad-display">
      <div>
        <small>{props.playerId}</small>
      </div>
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
