import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import ErrorMessageComponent from '../components/ErrorMessageComponent';
import { RootState, UI_STATE } from '../redux/reducers';


const mapStateToProps = (state: RootState) => ({
  emulatorErrorMessage: state.emulatorErrorMessage
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type ErrorMessageProps = ConnectedProps<typeof connector>;
export default connector(ErrorMessageComponent);


