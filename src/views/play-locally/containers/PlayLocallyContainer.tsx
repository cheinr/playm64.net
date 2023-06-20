import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import PlayLocally from '../components/PlayLocally';
import { RootState, UI_STATE } from '../../../redux/reducers';
import {
  setEmulatorConfigOverrides,
  setIsDynarecEnabled,
  setSelectedROMData,
  setUiState
} from '../../../redux/actions';


const mapStateToProps = (state: RootState) => ({
  emulatorConfigOverrides: state.emulatorConfigOverrides,
  isPlaying: state.uiState === UI_STATE.PLAYING_LOCAL_SESSION,
  isDynarecEnabled: state.isDynarecEnabled
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setEmulatorConfigOverrides: (configOverrides: any) => {
    dispatch(setEmulatorConfigOverrides(configOverrides));
  },
  setIsDynarecEnabled: (isDynarecEnabled: boolean) => {

    localStorage.setItem('isDynarecEnabled', JSON.stringify(isDynarecEnabled));
    dispatch(setIsDynarecEnabled(isDynarecEnabled));
  },
  setSelectedROMData: (romData: ArrayBuffer) => {
    dispatch(setSelectedROMData(romData));
  },
  startPlaying: () => {
    dispatch(setUiState(UI_STATE.PLAYING_LOCAL_SESSION));
  },
  stopPlaying: () => {
    dispatch(setUiState(UI_STATE.PENDING_MODE_SELECT));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type PlayLocallyProps = ConnectedProps<typeof connector>;
export default connector(PlayLocally);
