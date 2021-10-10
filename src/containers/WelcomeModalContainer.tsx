import { setDisplayWelcomeModal } from '../redux/actions';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import WelcomeModalComponent from '../components/WelcomeModalComponent';
import { RootState } from '../redux/reducers';

const mapStateToProps = (state: RootState) => ({
  shouldDisplayModal: state.displayWelcomeModal
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dismissModal: (disableWelcomeModal: boolean) => {

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

