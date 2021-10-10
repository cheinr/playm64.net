import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import PlayOnline from '../components/PlayOnline';
import {
  setAlias,
  setAliasInput,
  createGameRoom, joinGameRoom, setJoinGameRoomInput,
  toggleHostNewGameMenu,
  startLocalGame,
  setHostingRegion,
  requestHostingRegionOptionsIfNotLoaded,
  setSelectedROMData
} from '../../../redux/actions';
import MatchmakerClient from '../../../service/MatchmakerClient';
import { RootState } from '../../../redux/reducers';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

interface OwnProps {
  isHostingInitially?: boolean;
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  alias: state.alias,
  aliasInput: state.aliasInput,
  romShortName: state.selectedRomShortName,
  uiState: state.uiState,
  joinGameRoomInput: state.joinGameRoomInput,
  connectionStateMessage: state.connectionStateMessage,
  showHostingMenu: state.displayHostNewGameMenu,
  hostRegionOptions: state.hostRegionOptions,
  hostingRegion: state.hostingRegion,

  isHostingInitially: ownProps.isHostingInitially ?? false
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  createGameRoom: () => {
    dispatch(createGameRoom());
  },
  joinGame: (gameRoomId: string) => {
    dispatch(joinGameRoom(gameRoomId));
  },
  onJoinGameRoomInputChange: (event: ChangeEvent<HTMLInputElement>) => {
    const joinCode = event.target.value.replace(/[^a-zA-Z]/, "").toUpperCase();

    dispatch(setJoinGameRoomInput(joinCode));
  },
  onAliasInputChange: (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAliasInput(event.target.value));
  },
  startLocalGame: () => {
    dispatch(startLocalGame());
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
  toggleHostingMenu: () => {
    dispatch(toggleHostNewGameMenu());
    dispatch(requestHostingRegionOptionsIfNotLoaded());
  },
  onHostingRegionSelectChange: (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setHostingRegion(event.target.value));
  },
  setSelectedROMData: (romData: ArrayBuffer) => {
    dispatch(setSelectedROMData(romData));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type PlayOnlineProps = ConnectedProps<typeof connector>;
export default connector(PlayOnline);
