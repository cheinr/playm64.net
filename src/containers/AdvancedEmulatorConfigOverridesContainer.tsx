import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import AdvancedEmulatorConfigOverridesComponent from '../components/AdvancedEmulatorConfigOverridesComponent';
import { setEmulatorConfigOverrides } from '../redux/actions';
import { RootState } from '../redux/reducers';


const mapStateToProps = (state: RootState) => ({
  emulatorConfigOverrides: state.emulatorConfigOverrides
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setEmulatorConfigOverrides: (emulatorConfigOverrides: any) => {
    dispatch(setEmulatorConfigOverrides(emulatorConfigOverrides));
  },

});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

type propsFromRedux = ConnectedProps<typeof connector>;
export interface AdvancedEmulatorConfigOverridesProps extends propsFromRedux {
  selectedROMGoodName: string
}

export default connector(AdvancedEmulatorConfigOverridesComponent);


