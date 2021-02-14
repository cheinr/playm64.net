import { setJoinGameRoomInput } from '../redux/actions';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import Mupen64PlusEmuComponent from '../components/Mupen64PlusEmuComponent';
import { RootState } from '../redux/reducers';


const mapStateToProps = (state: RootState) => {
  return {
    playerId: state.roomPlayerInfo.clientPlayerId,
    gameServerConnection: state.gameServerConnection,
    selectedRomData: state.selectedRomData
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type Mupen64PlusEmuProps = ConnectedProps<typeof connector>;
export default connector(Mupen64PlusEmuComponent);