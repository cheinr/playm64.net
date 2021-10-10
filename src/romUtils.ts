import md5 from 'md5';
import SparkMD5 from 'spark-md5';
import axios from 'axios';

const onUpgradeNeeded = function(event: any) {
  const db = event.target.result;

  if (!db.objectStoreNames.contains('ROMS')) {
    console.log('Creating object store!');
    const objectStore = db.createObjectStore('ROMS');
    objectStore.createIndex('md5Sum', 'md5Sum', { unique: false, multiEntry: false });
  }
};

export async function loadROM(romGoodName: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const connection = indexedDB.open('roms');

    connection.onupgradeneeded = onUpgradeNeeded;

    connection.onerror = function(event) {
      console.error('Error while updating IDBFS store: %o', event);
      reject(event);
    };

    connection.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction('ROMS', 'readonly');
      const store = transaction.objectStore('ROMS');

      const request = store.get(romGoodName);

      request.onerror = function(event: any) {
        console.error('Error while querying keys from IDBFS: %o', event);
        reject();
      };

      request.onsuccess = function(event: any) {

        const contents = event.target.result
          ? event.target.result.romData.buffer
          : null;

        resolve(contents);
      };
    };
  });

}

export async function persistROM(romData: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const connection = indexedDB.open('roms');

    connection.onupgradeneeded = onUpgradeNeeded;

    connection.onerror = function(event) {
      console.error('Error while updating IDBFS store: %o', event);
      reject(event);
    };

    connection.onsuccess = (e: any) => {
      const db = e.target.result;

      let md5: string;
      try {
        md5 = md5Sum(romData);
      } catch (err) {
        reject(err);
        return;
      }

      getRomCfgEntry(md5).then((cfg) => {

        const romGoodName = cfg
          ? cfg.GoodName
          : getRomShortName(romData) + ' (Unknown ROM)';

        const toSave = {
          romGoodName,
          romData: new Uint8Array(romData),
          md5Sum: md5
        };


        const transaction = db.transaction('ROMS', 'readwrite');
        const store = transaction.objectStore('ROMS');

        const request = store.put(toSave, romGoodName);
        request.onerror = function(event: any) {
          console.error('Error while loading file %s from IDBFS: %o', romGoodName, event);
          reject();
        };

        request.onsuccess = function() {
          resolve();
        };
      }).catch((err) => {
        reject(`Exception while getting rom Cfg entry: ${err}`);
      });
    };
  });
}

export async function listPersistedROMs(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    const connection = indexedDB.open('roms');

    connection.onupgradeneeded = onUpgradeNeeded;

    connection.onerror = function(event) {
      console.error('Error while updating IDBFS store: %o', event);
      reject(event);
    };

    connection.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction('ROMS', 'readonly');
      const store = transaction.objectStore('ROMS');

      const request = store.getAllKeys();

      request.onerror = function(event: any) {
        console.error('Error while querying keys from IDBFS: %o', event);
        reject();
      };

      request.onsuccess = function(event: any) {

        const keys = event.target.result;
        resolve(keys);
      };
    };
  });
}

export async function deleteROM(romName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const connection = indexedDB.open('roms');

    connection.onupgradeneeded = onUpgradeNeeded;

    connection.onerror = function(event) {
      console.error('Error while updating IDBFS store: %o', event);
      reject(event);
    };

    connection.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction('ROMS', 'readwrite');
      const store = transaction.objectStore('ROMS');

      const request = store.delete(romName);

      request.onerror = function(event: any) {
        console.error('Error while querying keys from IDBFS: %o', event);
        reject();
      };

      request.onsuccess = function(event: any) {
        resolve();
      };
    };
  });
}


let m64pIni: any = null;
export async function getMupen64PlusIni(): Promise<any> {

  if (m64pIni) {
    return Promise.resolve(m64pIni);
  }

  return axios.get('/dist/mupen64plus.json').then((response) => {
    m64pIni = response.data;
    return response.data;
  });
}

export async function getRomCfgEntry(md5Sum: string): Promise<any> {
  return getMupen64PlusIni().then((ini: any) => {
    if (md5Sum in ini) {
      return ini[md5Sum];
    } else {
      return null;
    }
  });
}


function getRomHeaderFirstWord(romData: ArrayBuffer): number {
  return new DataView(romData).getUint32(0);
}

export function md5Sum(romData: ArrayBuffer): string {
  const romHeaderHex = getRomHeaderFirstWord(romData).toString(16);

  let z64RomData;

  if (romHeaderHex === '80371240') { // big endian (.z64)
    z64RomData = romData;
  } else if (romHeaderHex === '37804012') { // byte swapped (.v64)

    z64RomData = new ArrayBuffer(romData.byteLength);

    // .v64 images have byte-swapped half-words (16-bit)
    const inDataView = new DataView(romData);
    const outDataView = new DataView(z64RomData);

    for (let i = 0; i < romData.byteLength; i += 2) {
      outDataView.setUint16(i, inDataView.getUint16(i, true));
    }

  } else if (romHeaderHex === '40123780') { // little endian (.n64)

    z64RomData = new ArrayBuffer(romData.byteLength);

    // .n64 images have byte-swapped words (32-bit)
    const inDataView = new DataView(romData);
    const outDataView = new DataView(z64RomData);

    for (let i = 0; i < romData.byteLength; i += 4) {

      const toCopy = inDataView.getUint32(i, true);
      outDataView.setUint32(i, toCopy);
    }

  } else {
    throw new Error('Invalid ROM');
  }


  return SparkMD5.ArrayBuffer.hash(new Uint8Array(z64RomData), false).toUpperCase();
}


export function getRomShortName(romData: ArrayBuffer): string {

  const romHeaderHex = getRomHeaderFirstWord(romData).toString(16);

  const view = new Uint8Array(romData);
  const shortNameData = view.slice(32, 48);

  let bigEndianData: ArrayBuffer = new ArrayBuffer(16);

  // See http://n64dev.org/romformats.html
  if (romHeaderHex === '80371240') { // big endian
    bigEndianData = shortNameData;

  } else if (romHeaderHex === '37804012') { // byte swapped

    const inDataView = new DataView(shortNameData.buffer);
    const outDataView = new DataView(bigEndianData);

    for (let i = 0; i < 8; i++) {

      outDataView.setUint16(i * 2, inDataView.getUint16(i * 2, true));
    }

  } else if (romHeaderHex === '40123780') { // little endian

    const inDataView = new DataView(shortNameData.buffer);
    const outDataView = new DataView(bigEndianData);

    for (let i = 0; i < 4; i++) {

      outDataView.setUint32(i * 4, inDataView.getUint32(i * 4, true));
    }
  } else {
    throw new Error('Invalid ROM');
  }

  const bigEndianBytes = new Uint8Array(bigEndianData);

  let shortName = '';
  for (let i = 0; i < bigEndianBytes.length; i++) {
    shortName += String.fromCharCode(bigEndianBytes[i]);
  }

  console.log('after load: %o', getRomHeaderFirstWord(romData).toString(16));

  return shortName;
}
