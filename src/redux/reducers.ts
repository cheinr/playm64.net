import { SET_SELECTED_ROM_DATA } from './actions';
import { getRomShortName } from '../romUtils';

  const initialState = {
  selectedRomData: null,
  selectedRomShortName: null
};



export default function appReducer(state: any, action: any) {
  if (state === undefined) return initialState;

  switch (action.type) {
    case SET_SELECTED_ROM_DATA:
      
      console.log("romData updated to: %o", action.data);
      return Object.assign({}, state, {
        selectedRomData: action.data,
        selectedRomShortName: getRomShortName(action.data)
      });
  }
  
  return initialState;
}


export type RootState = ReturnType<typeof appReducer>;
