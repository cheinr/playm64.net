import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import GameControlsDisplayComponent from '../components/GameControlsDisplayComponent';
import { RootState, UI_STATE } from '../redux/reducers';


const mapStateToProps = (state: RootState) => ({
  inNetplaySession: state.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
    || state.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION
    || state.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GameControlsDisplayProps = ConnectedProps<typeof connector>;
export default connector(GameControlsDisplayComponent);

