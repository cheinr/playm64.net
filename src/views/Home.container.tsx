import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Home from './Home';
import {
  toggleHostNewGameMenu,
  requestHostingRegionOptionsIfNotLoaded
} from '../redux/actions';
import MatchmakerClient from '../service/MatchmakerClient';
import { RootState } from '../redux/reducers';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

interface OwnProps {
  isHostingInitially?: boolean;
}

const mapStateToProps = (state: RootState) => ({
  showHostingMenu: state.displayHostNewGameMenu,
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  toggleHostingMenu: () => {
    console.log("toggleHostingMenu");
    dispatch(toggleHostNewGameMenu());
    dispatch(requestHostingRegionOptionsIfNotLoaded());
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type HomeProps = ConnectedProps<typeof connector>;
export default connector(Home);
