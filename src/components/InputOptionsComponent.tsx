import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';

import ConfigureGamepadInputsComponent from './inputs/ConfigureGamepadInputsComponent';
import LinkButton from '../components/common/LinkButton';
import { InputOptionsProps } from '../containers/InputOptionsContainer';
import { useState } from 'react';
import { gamepadSimulator } from '../GamepadSimulator';

const InputOptionsComponent = (props: InputOptionsProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (props.connectedGamepad) {
    return (
      <div>

        <Modal
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)} centered>

          <Modal.Header closeButton>
            <Modal.Title>Configure Inputs</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ConfigureGamepadInputsComponent gamepadName={props.connectedGamepad.id} />
          </Modal.Body>
        </Modal >

        <FontAwesomeIcon icon={faGamepad} size="2x" />
        <div className="input-device">
          <small>
            {props.connectedGamepad.id}
            <div>
              {props.connectedGamepad.id !== gamepadSimulator.fakeController.id &&
                <LinkButton onClick={() => { setIsModalOpen(true); }}>configure</LinkButton>
              }
            </div>
          </small>
        </div>
      </div >
    );
  } else {
    return (
      <div>
        <FontAwesomeIcon icon={faKeyboard} size="2x" />
        <div>
          <small className="input-device">
            Keyboard
          </small>
        </div>
      </div>
    );
  }
};

export default InputOptionsComponent;

