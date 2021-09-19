import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import InputOptionsComponent from '../components/InputOptionsComponent';
import { RootState } from '../redux/reducers';


const mapStateToProps = (state: RootState) => ({
  connectedGamepad: state.connectedGamepad
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type InputOptionsProps = ConnectedProps<typeof connector>;
export default connector(InputOptionsComponent);

