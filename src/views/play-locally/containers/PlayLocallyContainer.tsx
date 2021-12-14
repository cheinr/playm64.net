import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import PlayLocally from '../components/PlayLocally';
import { RootState } from '../../../redux/reducers';


const mapStateToProps = (state: RootState) => ({
  emulatorConfigOverrides: state.emulatorConfigOverrides
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type PlayLocallyProps = ConnectedProps<typeof connector>;
export default connector(PlayLocally);
