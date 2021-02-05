import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import RomUploadComponent from '../components/RomUploadComponent';

import { RootState } from '../redux/reducers';
import { setSelectedROMData } from '../redux/actions';

const mapStateToProps = (state: RootState) => ({
  loadedRomName: state.selectedRomShortName
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onFileChange: (files: File[]) => {

    console.log(files);
    if (files.length === 1) {

      files[0].arrayBuffer().then((romData: ArrayBuffer) => {
        dispatch(setSelectedROMData(romData));
      });
    } else {

      throw "TODO - tell the wily user to only select one rom at a time";
    }
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type RomUploadProps = ConnectedProps<typeof connector>;
export default connector(RomUploadComponent);
