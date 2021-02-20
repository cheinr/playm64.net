import { requestGameStart } from '../redux/actions';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import GameRoomPlayerInfoComponent from '../components/GameRoomPlayerInfoComponent';
import { RootState } from '../redux/reducers';
import MatchmakerClient from '../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => ({
  gameRoomPlayerInfo: state.roomPlayerInfo,
  // TODO - Remove assumption player 0 is the host
  localPlayerIsHost: state.roomPlayerInfo?.clientPlayerId === 0,
  ping: state.ping
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  onStartGameClick: () => {
    dispatch(requestGameStart());
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GameRoomPlayerInfoProps = ConnectedProps<typeof connector>;
export default connector(GameRoomPlayerInfoComponent);
