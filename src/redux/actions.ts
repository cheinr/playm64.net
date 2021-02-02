export const SET_SELECTED_ROM_DATA = 'SET_SELECTED_ROM_DATA';

export function setSelectedROMData(romData: ArrayBuffer) {
  return { type: 'SET_SELECTED_ROM_DATA', data: romData };
}
