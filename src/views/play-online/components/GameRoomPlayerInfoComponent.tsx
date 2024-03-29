import { GameRoomPlayerInfoProps } from '../containers/GameRoomPlayerInfoContainer';
import ControllerPluginSlot from './ControllerPluginSlot';
import GamePadDisplayContainer from '../containers/GamePadDisplayContainer';
import { UI_STATE } from '../../../redux/reducers';
import { ReactElement } from 'react';


const GameRoomPlayerInfoComponent = (props: GameRoomPlayerInfoProps): ReactElement => {

  console.log(props.gameRoomPlayerInfo);
  const players = props.gameRoomPlayerInfo
    ? props.gameRoomPlayerInfo.clients
    : [];

  const gamePads = Array.from({ length: 4 }, (x, i) => i).map((index) => {
    const maybeMappedPlayer = players.find((player: any) => {
      return player.mappedController === index + 1;
    });


    const gamePadDisplay = maybeMappedPlayer ? (
      <GamePadDisplayContainer
        playerId={`P${maybeMappedPlayer.mappedController}`}
        playerName={maybeMappedPlayer.name}
        clientId={maybeMappedPlayer.clientId}
        isGamepadConnected={maybeMappedPlayer.isGamepadConnected}
        key={`GamePadDisplayContainer-${maybeMappedPlayer.mappedController}`} />
    ) : undefined;

    const color = ['blue', 'red', 'green', 'yellow'][index];
    return (<ControllerPluginSlot key={`ControllerPluginSlot-${index}`}
      color={color} playerNumber={index + 1}>
      { gamePadDisplay}
    </ControllerPluginSlot >);
  });

  const spectatorPads = players
    .filter((player: any) => player.mappedController === -1)
    .map((player: any, index: number) => {
      return (<div className="col-md-auto"><GamePadDisplayContainer
        playerId=''
        playerName={player.name}
        clientId={player.clientId}
        isGamepadConnected={player.isGamepadConnected}
        key={`GamePadSpectator-${index}`} /></div>);
    });


  let pingColor = 'red';
  if (props.ping < 120) {
    pingColor = 'yellow';
  }
  if (props.ping < 60) {
    pingColor = 'green';
  }

  return (
    <div>

      <div>
        <small>
          {(props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION &&
            <small style={{ color: 'red' }}>DISCONNECTED</small>)}

          {(props.uiState !== UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION &&
            <small style={{ color: pingColor }}>ping: {(props.ping)}</small>)}


        </small>
      </div>

      <div id="row gamepads" className="row g-1">
        {gamePads}
      </div>

      {props.localPlayerCanReassignControllers &&
        <p>drag and drop player controllers to reassign</p>
      }

      {spectatorPads.length > 0 &&
        <div>
          <hr />
          <h5>Spectators</h5>
          <div className="row justify-content-md-center">
            {spectatorPads}
          </div>
          <hr />
        </div>}
    </div >
  );
};

export default GameRoomPlayerInfoComponent;
