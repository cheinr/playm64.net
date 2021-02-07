import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import GamePadDisplayComponent from '../components/GamePadDisplayComponent';
import { RootState } from '../redux/reducers';


const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GamePadDisplayProps = { playerName: string };
export default connector(GamePadDisplayComponent);
