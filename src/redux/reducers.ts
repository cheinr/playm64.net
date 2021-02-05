import { SET_SELECTED_ROM_DATA } from './actions';
import { getRomShortName } from '../romUtils';

enum UI_STATES {
  PENDING_ROM_LOAD = 0,
  PENDING_MODE_SELECT = 1,
  PLAYING_LOCAL_SESSION = 2,
  PLAYING_IN_NETPLAY_SESSION = 3
}

const initialState = {
  uiState: UI_STATES.PENDING_ROM_LOAD,
  selectedRomData: null,
  selectedRomShortName: null
};


export default function appReducer(state: any, action: any) {
  if (state === undefined) return initialState;

  switch (action.type) {
    case SET_SELECTED_ROM_DATA:
      
      return Object.assign({}, state, {
        uiState: UI_STATES.PENDING_MODE_SELECT,
        selectedRomData: action.data,
        selectedRomShortName: getRomShortName(action.data)
      });
  }
  
  return initialState;
}


export type RootState = ReturnType<typeof appReducer>;
