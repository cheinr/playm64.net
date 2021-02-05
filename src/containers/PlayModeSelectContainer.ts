import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import PlayModeSelectComponent from '../components/PlayModeSelectComponent';
import { RootState } from '../redux/reducers';
import { setSelectedROMData } from '../redux/actions';

const mapStateToProps = (state: RootState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type PlayModeSelectProps = ConnectedProps<typeof connector>;
export default connector(PlayModeSelectComponent);
