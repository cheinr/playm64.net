import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

import MatchmakerClient from '../../../service/MatchmakerClient';
import GamePadDisplayComponent from '../components/GamePadDisplayComponent';
import { RootState, UI_STATE } from '../../../redux/reducers';

import { requestClientControllerReassign } from '../../../redux/actions';

type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;


const mapStateToProps = (state: RootState) => ({
  uiState: state.uiState
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  requestClientControllerReassign: (clientId: number, controllerNumber: number) => {
    dispatch(requestClientControllerReassign(clientId, controllerNumber));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);


type OwnProps = {
  playerName: string,
  playerId: string,
  clientId: number,
  uiState: UI_STATE
};

export type GamePadDisplayProps = OwnProps & ConnectedProps<typeof connector>;

export default connector(GamePadDisplayComponent);
