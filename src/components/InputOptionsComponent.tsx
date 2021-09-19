import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard, faGamepad } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

import ConfigureGamepadInputsComponent from './inputs/ConfigureGamepadInputsComponent';
import LinkButton from '../components/common/LinkButton';
import { InputOptionsProps } from '../containers/InputOptionsContainer';
import { useState } from 'react'

const InputOptionsComponent = (props: InputOptionsProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (props.connectedGamepad) {
    return (
      <div>

        <Modal
          isOpen={isModalOpen}
          contentLabel="Configure Input Device"
          className="Modal"
          overlayClassName="ModalOverlay"
          onRequestClose={() => setIsModalOpen(false)}>

          <ConfigureGamepadInputsComponent gamepadName={props.connectedGamepad.id} />
        </Modal >

        <FontAwesomeIcon icon={faGamepad} size="2x" />
        <div className="input-device">
          <small>
            {props.connectedGamepad.id}
            <div>
              <LinkButton onClick={() => { setIsModalOpen(true) }}>configure</LinkButton>
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

