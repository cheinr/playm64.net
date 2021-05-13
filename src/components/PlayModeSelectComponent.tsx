import { PlayModeSelectProps } from '../containers/PlayModeSelectContainer';
import { UI_STATE } from '../redux/reducers';

const PlayModeSelectComponent = (props: PlayModeSelectProps) => {

  let regionOptions = null;
  if (props.hostRegionOptions) {
    regionOptions = props.hostRegionOptions.map((o: any, index: number) => {
      return (
        <option value={o.regionValue} key={`regionOption-${index}`}>
          { o.regionName}
        </option >);
    });
  }

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

          <input name="aliasInput" value={props.aliasInput} onChange={props.onAliasInputChange}
            onKeyPress={(e) => props.onAliasInputKeyPress(e, props.aliasInput)}
            placeholder="Enter a player alias..."></input>

          <button name="aliasInputEnterButton" onClick={(e) => props.onAliasEnterButtonClicked(props.aliasInput)}>Enter</button>
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

          {
            props.showHostingMenu &&

            <div>

              <label>select game room region: &nbsp;

                {regionOptions &&
                  <select onChange={props.onHostingRegionSelectChange} value={props.hostingRegion}>
                    {regionOptions}
                  </select>
                }

                {!regionOptions && <small>Loading...</small>}
              </label>

              <div>
                <button name="createGameButton" onClick={() => props.createGameRoom()}
                  disabled={props.alias == '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT) || !regionOptions}>
                  Create Game Room
                </button>

              </div>
              <div>
                <small>or - &nbsp;

                  {
                    props.uiState === UI_STATE.PENDING_MODE_SELECT
                      ? <a href="#" onClick={() => props.toggleHostingMenu()} >join an existing game</a>
                      : <a href="#" style={{ pointerEvents: 'none' }}>join an existing game</a>
                  }
                </small>
              </div>

            </div>
          }

          {
            !props.showHostingMenu &&

            <div>

              <input name="joinCodeInput" disabled={props.alias == ''}
                value={props.joinGameRoomInput}
                onChange={props.onJoinGameRoomInputChange}
                placeholder="Enter a join code...">
              </input>

              <button name="joinGameButton" onClick={() => props.joinGame(props.joinGameRoomInput)}
                disabled={props.alias == '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT)}>
                Join Game
              </button>

              <div>
                <small>or - &nbsp;

                  {
                    props.uiState === UI_STATE.PENDING_MODE_SELECT
                      ? <a href="#" onClick={() => props.toggleHostingMenu()} >host a new game</a>
                      : <a href="#" style={{ pointerEvents: 'none' }}>host a new game</a>
                  }
                </small>
              </div>
            </div>
          }

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
