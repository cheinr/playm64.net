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
        <hr />
        Play Locally
      </div>
      <button
        name="playLocalButton"
        onClick={() => props.startLocalGame()}
      >
        Start Emulator
      </button>

      <hr />

      Play Online


      { !props.alias &&
        <div>

          <input name="aliasInput" value={props.aliasInput} onChange={props.onAliasInputChange} onKeyPress={props.onAliasInputKeyPress} placeholder="Enter an alias..."></input>

          <button name="aliasInputEnterButton" onClick={props.onAliasEnterButtonClicked}>Enter</button>
        </div >
      }

      {
        props.alias &&
        <div>

          <div>
            <small>
              player alias: {props.alias} <a href='#' onClick={props.onPlayerAliasEditClick}> edit</a>
            </small>
          </div>

          <br />

          <button
            name="hostGameButton"
            onClick={() => props.createGameRoom()}
            disabled={props.alias == '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT)}
          >
            Host Game
         </button>

          <p>- or -</p>

          <input name="joinCodeInput" disabled={props.alias == ''}
            value={props.joinGameRoomInput}
            onChange={props.onJoinGameRoomInputChange}>
          </input>

          <button name="joinGameButton" onClick={() => props.joinGame(props.joinGameRoomInput)}
            disabled={props.alias == '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT)}>
            Join Game
         </button>

          <br />
          <br />

          <div className={`connection-state-message ${props.connectionStateMessage.isError ? 'connection-state-error' : ''}`}>
            <small>{props.connectionStateMessage.message}</small>
          </div>
        </div>
      }
    </div >
  );
};

export default PlayModeSelectComponent;
