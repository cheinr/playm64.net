import { setDisplayWelcomeModal } from '../redux/actions';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import WelcomeModalComponent from '../components/WelcomeModalComponent';
import { RootState, UI_STATE } from '../redux/reducers';

const mapStateToProps = (state: RootState) => ({
  shouldDisplayModal: state.displayWelcomeModal
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dismissModal: (disableWelcomeModal: boolean) => {
    console.log("Disable welcome modal: %o", disableWelcomeModal);

    if (disableWelcomeModal) {
      localStorage.setItem('disableWelcomeModal', 'true');
    }

    dispatch(setDisplayWelcomeModal(false));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type WelcomeModalProps = ConnectedProps<typeof connector>;
export default connector(WelcomeModalComponent);

