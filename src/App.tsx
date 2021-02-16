import './App.css';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import RomUploadContainer from './containers/RomUploadContainer';
import PlayModeSelectContainer from './containers/PlayModeSelectContainer';
import GameRoomOverviewContainer from './containers/GameRoomOverviewContainer';
import GameRoomPlayerInfoContainer from './containers/GameRoomPlayerInfoContainer';
import Mupen64PlusEmuContainer from './containers/Mupen64PlusEmuContainer';

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

        {(props.uiState === 0) &&
          < RomUploadContainer />}

        {(props.uiState === 1 || props.uiState === 2)
          && <PlayModeSelectContainer />}

        {(props.uiState === 4 || props.uiState === 5)
          && <GameRoomOverviewContainer />}


        {(props.uiState === 3 || props.uiState === 5)
          && <Mupen64PlusEmuContainer />}


        {(props.uiState === 4 || props.uiState === 5)
          && <GameRoomPlayerInfoContainer />}

      </header>
    </div >
  );
}

