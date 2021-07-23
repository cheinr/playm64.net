
function getRomHeaderFirstWord(romData: ArrayBuffer): number {
  return new DataView(romData).getUint32(0);
}

export function getRomShortName(romData: ArrayBuffer): string {

  const romHeaderHex = getRomHeaderFirstWord(romData).toString(16);

  const view = new Uint8Array(romData);
  const shortNameData = view.slice(32, 48);

  let bigEndianData: ArrayBuffer = new ArrayBuffer(16);

  // See http://n64dev.org/romformats.html
  if (romHeaderHex === "80371240") { // big endian
    bigEndianData = shortNameData;

  } else if (romHeaderHex === "37804012") { // byte swapped

    const inDataView = new DataView(shortNameData.buffer);
    const outDataView = new DataView(bigEndianData);

    for (let i = 0; i < 8; i++) {

      outDataView.setUint16(i * 2, inDataView.getUint16(i * 2, true));
    }

  } else if (romHeaderHex === "40123780") { // little endian

    const inDataView = new DataView(shortNameData.buffer);
    const outDataView = new DataView(bigEndianData);

    for (let i = 0; i < 4; i++) {

      outDataView.setUint32(i * 4, inDataView.getUint32(i * 4, true));
    }
  } else {
    throw new Error("Invalid ROM");
  }

  const bigEndianBytes = new Uint8Array(bigEndianData);

  let shortName = '';
  for (let i = 0; i < bigEndianBytes.length; i++) {
    shortName += String.fromCharCode(bigEndianBytes[i]);
  }

  console.log("after load: %o", getRomHeaderFirstWord(romData).toString(16));

  return shortName;
}
