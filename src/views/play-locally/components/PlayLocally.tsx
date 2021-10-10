import createMupen64PlusWeb from 'mupen64plus-web';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import RomSelector from '../../../components/inputs/RomSelector';
import Mupen64PlusEmuComponent from '../../../components/Mupen64PlusEmuComponent';
import GameControlsDisplay from '../../../containers/GameControlsDisplayContainer';
import { loadROM } from '../../../romUtils';
import stats from '../../../Stats';


export default function PlayLocally() {

  const [selectedROMName, setSelectedROMName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {

    if (isPlaying) {
      loadROM(selectedROMName).then((romData: ArrayBuffer) => {
        setTimeout(() => {
          createMupen64PlusWeb({
            canvas: document.getElementById('canvas'),
            romData,
            beginStats: stats.begin,
            endStats: stats.end,
            romPath: '/roms/tmp_rom_path',
            coreConfig: {
              emuMode: 0
            },
            locateFile: (path: string, prefix: string) => {

              console.log('path: %o', path);
              console.log('env: %o', process.env.PUBLIC_URL);

              const publicURL = process.env.PUBLIC_URL;

              if (path.endsWith('.wasm') || path.endsWith('.data')) {
                return publicURL + '/dist/' + path;
              }

              return prefix + path;
            },
            setErrorStatus: (errorMessage: string) => {
              console.log('errorMessage: %s', errorMessage);
              // TODO dispatch(setEmulatorErrorMessage(errorMessage));
            }
          });

        });
      }).catch((err) => {
        console.error('Exception during emulator initialization: %o', err);
      });
    }
  }, [selectedROMName, isPlaying]);


  if (isPlaying) {

    return (
      <div>
        <h4 className="text-center">Playing {selectedROMName}</h4>

        <div className="text-center">
          <Mupen64PlusEmuComponent />

          <GameControlsDisplay />
        </div>
      </div>
    );
  } else {

    return (
      <div>

        <div className="text-center my-3">
          <Link to="/">
            <Button variant="primary">Main Menu</Button>
          </Link>
        </div>

        <div className="row">

          <RomSelector onROMSelect={(romName) => setSelectedROMName(romName)} />
        </div>
        <div className="text-center">

          <Button variant="success"
            size="lg"
            disabled={selectedROMName === ''}
            onClick={() => setIsPlaying(true)}>
            Play Locally
          </Button>
        </div>
      </div >
    );
  }
}

