import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { UI_STATE } from '../redux/reducers';

import GameSaveManagementComponent from '../components/GameSaveManagementComponent';
import { RootState } from '../redux/reducers';
import MatchmakerClient from '../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GameSaveManagementComponentProps = ConnectedProps<typeof connector>;
export default connector(GameSaveManagementComponent);

