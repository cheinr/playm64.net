import { PlayModeSelectProps } from '../containers/PlayModeSelectContainer';
import { UI_STATE } from '../redux/reducers';

const PlayModeSelectComponent = (props: PlayModeSelectProps) => {

  return (
    <div>
      Loaded: { props.romShortName}
      <hr />
      <div>
      </div>

      <div>
        <input value={props.alias} onChange={props.onAliasInputChange} placeholder="Enter an alias..."></input>
      </div>

      <button
        onClick={() => props.createGameRoom()}
        disabled={props.alias == '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT)}
      >
        Host Game
      </button>

      <p>- or -</p>

      <input disabled={props.alias == ''}
        value={props.joinGameRoomInput}
        onChange={props.onJoinGameRoomInputChange}>
      </input>

      <button onClick={() => props.joinGame(props.joinGameRoomInput)}
        disabled={props.alias == '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT)}>
        Join Game
      </button>
    </div >
  );
};

export default PlayModeSelectComponent;
