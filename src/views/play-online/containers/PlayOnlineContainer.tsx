import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import PlayOnline from '../components/PlayOnline';
import {
  setAlias,
  setAliasInput,
  setEmulatorConfigOverrides,
  setIsAutoSelectROMEnabled,
  createGameRoom, joinGameRoom, setJoinGameRoomInput,
  setHostingRegion,
  requestHostingRegionOptionsIfNotLoaded,
  setSelectedROMData,
  setUiState,
  netplayReset
} from '../../../redux/actions';

import MatchmakerClient from '../../../service/MatchmakerClient';
import { RootState, UI_STATE } from '../../../redux/reducers';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

interface OwnProps {
  isHostingInitially?: boolean;
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  alias: state.alias,
  aliasInput: state.aliasInput,
  isAutoSelectROMEnabled: state.isAutoSelectROMEnabled,
  romShortName: state.selectedRomShortName,
  uiState: state.uiState,
  joinGameRoomInput: state.joinGameRoomInput,
  connectionStateMessage: state.connectionStateMessage,
  showHostingMenu: state.displayHostNewGameMenu,
  hostRegionOptions: state.hostRegionOptions,
  hostingRegion: state.hostingRegion,

  isHostingInitially: ownProps.isHostingInitially ?? false,
  isPlaying: state.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION
    || state.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
    || state.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  createGameRoom: () => {
    dispatch(createGameRoom());
  },
  joinGame: (gameRoomId: string, autoSelectROMEnabled?: boolean) => {
    dispatch(joinGameRoom(gameRoomId, autoSelectROMEnabled));
  },
  onJoinGameRoomInputChange: (event: ChangeEvent<HTMLInputElement>) => {
    const joinCode = event.target.value.replace(/[^a-zA-Z]/, '').toUpperCase();

    dispatch(setJoinGameRoomInput(joinCode));
  },
  onAliasInputChange: (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAliasInput(event.target.value));
  },
  setEmulatorConfigOverrides: (configOverrides: any) => {
    dispatch(setEmulatorConfigOverrides(configOverrides));
  },
  setIsAutoSelectROMEnabled: (isEnabled: boolean) => {

    localStorage.setItem('isAutoSelectROMEnabled', JSON.stringify(isEnabled));
    dispatch(setIsAutoSelectROMEnabled(isEnabled));
  },
  onAliasInputKeyPress: (event: KeyboardEvent<HTMLInputElement>, aliasInput: string) => {
    if (event.key === 'Enter') {
      dispatch(setAlias(aliasInput));
    }
  },
  onAliasEnterButtonClicked: (aliasInput: string) => {
    dispatch(setAlias(aliasInput));
  },
  onPlayerAliasEditClick: (event: MouseEvent) => {
    event.preventDefault();
    dispatch(setAlias(''));
  },
  requestHostingRegionOptionsIfNotLoaded: () => {
    dispatch(requestHostingRegionOptionsIfNotLoaded());
  },
  onHostingRegionSelectChange: (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setHostingRegion(event.target.value));
  },
  setSelectedROMData: (romData: ArrayBuffer) => {
    dispatch(setSelectedROMData(romData));
  },
  stopPlaying: () => {
    dispatch(setUiState(UI_STATE.PENDING_MODE_SELECT));
    dispatch(netplayReset());
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type PlayOnlineProps = ConnectedProps<typeof connector>;
export default connector(PlayOnline);
