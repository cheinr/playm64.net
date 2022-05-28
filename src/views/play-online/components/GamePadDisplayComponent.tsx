import { useDrag } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faKeyboard } from '@fortawesome/free-solid-svg-icons';

import { GamePadDisplayProps } from '../containers/GamePadDisplayContainer';
import { UI_STATE } from '../../../redux/reducers';

interface DropResult {
  playerNumber: number;
}

const GamePadDisplayComponent = (props: GamePadDisplayProps) => {

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'gamepad',
    item: { clientId: props.clientId },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();

      if (item && dropResult) {
        props.requestClientControllerReassign(item.clientId, dropResult.playerNumber - 1);
      }

      if (item && !dropResult) {
        props.requestClientControllerReassign(item.clientId, -1);
      }
    },
    canDrag: (monitor) => {
      return props.localClientCanReassignPlayers;
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging
    })
  }), [props.clientId, props.localClientCanReassignPlayers]);

  const displayName = (props.uiState !== UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION
    && props.playerName !== null)
    ? props.playerName
    : '<no input>';

  const icon = props.isGamepadConnected
    ? <FontAwesomeIcon icon={faGamepad} size="4x" />
    : <FontAwesomeIcon icon={faKeyboard} size="4x" />;

  return (
    <div ref={drag} className="gamepad-display py-2">

      <div>
        {icon}
      </div>
      <div>
        <small>{displayName}</small>
      </div>
    </div>
  );
};

export default GamePadDisplayComponent;
