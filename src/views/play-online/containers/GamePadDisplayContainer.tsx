import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import GamePadDisplayComponent from '../components/GamePadDisplayComponent';
import { RootState, UI_STATE } from '../../../redux/reducers';


const mapStateToProps = (state: RootState) => ({
  uiState: state.uiState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GamePadDisplayProps = { playerName: string, playerId: string, uiState: UI_STATE };
export default connector(GamePadDisplayComponent);
