import createMupen64PlusWeb from 'mupen64plus-web';
import { useEffect, useState } from 'react';
import { Button, Card, Modal, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import LinkButton from '../../../components/common/LinkButton';
import { M64_EMU_CONFIG_OVERRIDES_KEY } from '../../../components/inputs/AdvancedEmulatorConfigOverridesInputComponent';
import RomSelector from '../../../components/inputs/RomSelector';
import Mupen64PlusEmuContainer from '../../../containers/Mupen64PlusEmuContainer';
import GameControlsDisplay from '../../../containers/GameControlsDisplayContainer';
import GameSaveManagementContainer from '../../../containers/GameSaveManagementContainer';
import InputOptionsContainer from '../../../containers/InputOptionsContainer';
import AdvancedEmulatorConfigOverridesContainer from '../../../containers/inputs/AdvancedEmulatorConfigOverridesInputContainer';
import { PlayLocallyProps } from '../containers/PlayLocallyContainer';

export default function PlayLocally(props: PlayLocallyProps) {

  const [selectedROMName, setSelectedROMName] = useState('');

  const doSetSelectedROM = (newSelectedROMName: string, romData: ArrayBuffer) => {
    if (newSelectedROMName !== selectedROMName) {
      props.setSelectedROMData(romData);

      // TODO - Ideally we wouldn't be writing and reading to this from different components
      const existingPersistedOverrides: any = JSON.parse(localStorage.getItem(M64_EMU_CONFIG_OVERRIDES_KEY) ?? '{}');

      if (existingPersistedOverrides[newSelectedROMName]) {
        props.setEmulatorConfigOverrides(existingPersistedOverrides[newSelectedROMName]);
      }
    }

    setSelectedROMName(newSelectedROMName);
  };

  const [
    shouldDisplayEmulatorConfigOverridesContainer,
    setShouldDisplayEmulatorConfigOverridesContainer
  ] = useState(false);
  const [
    shouldDisplayGameSaveManagementModal,
    setShouldDisplayGameSaveManagementModal
  ] = useState(false);

  const start = () => {
    props.startPlaying();
  };

  useEffect(() => {

    return function cleanup() {
      if (props.isPlaying) {
        props.stopPlaying();
      }
    };
  }, [selectedROMName, props.isPlaying]);


  if (props.isPlaying) {

    return (
      <div>
        <h4 className="text-center">Playing {selectedROMName}</h4>

        <div className="text-center">
          <Mupen64PlusEmuContainer emuMode={props.isDynarecEnabled ? 2 : 1} />

          <GameControlsDisplay />
        </div>
      </div>
    );
  } else {

    return (
      <div>

        <Modal
          size="lg"
          show={shouldDisplayEmulatorConfigOverridesContainer}
          onHide={() => setShouldDisplayEmulatorConfigOverridesContainer(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Advanced Emulator Config Overrides
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <AdvancedEmulatorConfigOverridesContainer selectedROMGoodName={selectedROMName} />
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={shouldDisplayGameSaveManagementModal}
          onHide={() => setShouldDisplayGameSaveManagementModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Game Saves
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <GameSaveManagementContainer />
          </Modal.Body>
        </Modal>


        <div className="text-center my-3">
          <Link to="/">
            <Button variant="primary">Main Menu</Button>
          </Link>
        </div>

        <div className="row py-4">
          <div className="col text-center mh-100">

            <Card className="h-100">
              <div>
                Input Device
                <InputOptionsContainer />
              </div>
            </Card>
          </div>
        </div>

        <div className="row">
          <RomSelector onROMSelect={doSetSelectedROM} />
        </div>

        <div className="row pb-3">
          <LinkButton onClick={() => setShouldDisplayGameSaveManagementModal(true)}>Manage Game Saves</LinkButton>
        </div>

        { selectedROMName !== '' &&
          <div className="text-center pb-3">
            <Button onClick={() => setShouldDisplayEmulatorConfigOverridesContainer(true)}>
              Set Emulator Config Overrides
            </Button>
          </div>
        }

        <div className="row pb-3">
          <div className="col-4 d-flex" />
          <div className="col-4 d-flex justify-content-center">
            <Form.Check type="checkbox"
              id="dynarec-enable-checkbox"
              label="enable dynarec (experimental)"
              checked={props.isDynarecEnabled}
              onChange={(e) => props.setIsDynarecEnabled(e.target.checked)}
            />
          </div>
          <div className="col-4 d-flex" />
        </div>

        <div className="text-center">
          {selectedROMName !== ''
            ? <Button variant="success"
              size="lg"
              disabled={selectedROMName === ''}
              onClick={() => start()}>
              Play Locally
          </Button>

            : <OverlayTrigger placement='right'
              overlay={<Tooltip show={false}>You must select a ROM to play first!</Tooltip>}>

              <span className="d-inline-block">

                <Button variant="success"
                  size="lg"
                  disabled={selectedROMName === ''}
                  onClick={() => start()}
                  style={{ pointerEvents: 'none' }}>
                  Play Locally
              </Button>
              </span>
            </OverlayTrigger>
          }

        </div>
      </div >
    );
  }
}

