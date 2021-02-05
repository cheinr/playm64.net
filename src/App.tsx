import './App.css';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import RomUploadContainer from './containers/RomUploadContainer';
import PlayModeSelectContainer from './containers/PlayModeSelectContainer';
import { RootState } from './redux/reducers';

const mapStateToProps = (state: RootState) => ({
  uiState: state.uiState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({

});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type AppProps = ConnectedProps<typeof connector>;
export default connector(App);


function App(props: AppProps) {

  console.log("props: %o", props.uiState);
  return (
    <div className="App">
      <i className="fa fa-upload" aria-hidden="true" />
      <header className="App-header">


        <RomUploadContainer />

        {props.uiState === 1 && <PlayModeSelectContainer />}

      </header>
    </div>
  );
}

