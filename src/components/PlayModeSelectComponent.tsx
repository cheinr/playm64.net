import { KeyboardEvent } from 'react';
import { PlayModeSelectProps } from '../containers/PlayModeSelectContainer';
import { UI_STATE } from '../redux/reducers';

import LinkButton from './common/LinkButton';

const PlayModeSelectComponent = (props: PlayModeSelectProps) => {

  let regionOptions = null;
  if (props.hostRegionOptions) {
    regionOptions = props.hostRegionOptions.map((o: any, index: number) => {
      const capacityPercent = (o.capacity * 1).toFixed(1);
      return (
        <option value={o.regionValue} key={`regionOption-${index}`}>
          { o.regionName} &nbsp; ({capacityPercent}% capacity available)
        </option >);
    });
  }

  const onJoinCodeInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.joinGame(props.joinGameRoomInput);
    }
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
              player alias: {props.alias} &nbsp;
              <LinkButton onClick={props.onPlayerAliasEditClick} >edit</LinkButton>

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
                  disabled={props.alias === '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT) || !regionOptions}>
                  Create Game Room
                </button>

              </div>
              <div>
                <small>or - &nbsp;

                  {
                    props.uiState === UI_STATE.PENDING_MODE_SELECT
                      ? <LinkButton onClick={() => props.toggleHostingMenu()} >join an existing game</LinkButton>
                      : <LinkButton onClick={() => props.toggleHostingMenu()} disabled={true}>join an exiting game</LinkButton>
                  }
                </small>
              </div>

            </div>
          }

          {
            !props.showHostingMenu &&

            <div>

              <input name="joinCodeInput" disabled={props.alias === ''}
                value={props.joinGameRoomInput}
                onChange={props.onJoinGameRoomInputChange}
                onKeyDown={onJoinCodeInputKeyDown}
                placeholder="Enter a join code...">
              </input>

              <button name="joinGameButton" onClick={() => props.joinGame(props.joinGameRoomInput)}
                disabled={props.alias === '' || !(props.uiState === UI_STATE.PENDING_MODE_SELECT)}>
                Join Game
              </button>

              <div>
                <small>or - &nbsp;

                  {
                    props.uiState === UI_STATE.PENDING_MODE_SELECT
                      ? <LinkButton onClick={() => props.toggleHostingMenu()} >host a new game</LinkButton>
                      : <LinkButton onClick={() => props.toggleHostingMenu()} disabled={true}>host a new game</LinkButton>
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
          <hr />
        </div>
      }
    </div >
  );
};

export default PlayModeSelectComponent;
