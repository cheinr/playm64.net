import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Home from '../components/Home';
import MatchmakerClient from '../../../service/MatchmakerClient';
import { RootState } from '../../../redux/reducers';


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

export type HomeProps = ConnectedProps<typeof connector>;
export default connector(Home);
