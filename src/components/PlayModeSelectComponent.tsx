import { PlayModeSelectProps } from '../containers/PlayModeSelectContainer';
import { UI_STATE } from '../redux/reducers';

const PlayModeSelectComponent = (props: PlayModeSelectProps) => {

  return (
    <div>
      Loaded: { props.romShortName}
      <hr />
      <div>
      </div>

      <button
        onClick={() => props.createGameRoom()}
        disabled={!(props.uiState === UI_STATE.PENDING_MODE_SELECT)}
      >
        Host Game
      </button>

      <p>- or -</p>

      <input value={props.joinGameRoomInput} onChange={props.onJoinGameRoomInputChange}></input>
      <button onClick={() => props.joinGame(props.joinGameRoomInput)}
        disabled={!(props.uiState === UI_STATE.PENDING_MODE_SELECT)}>

        Join Game
      </button>
    </div >
  );
};

export default PlayModeSelectComponent;
