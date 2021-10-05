import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Modal, InputGroup, FormControl, Button } from 'react-bootstrap';
import { createRef, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import LinkButton from '../components/common/LinkButton';

import {
  setAlias,
} from '../redux/actions';
import { RootState } from '../redux/reducers';
import { Dispatch } from 'redux';
import { isFunction } from 'util';

const mapStateToProps = (state: RootState) => ({
  alias: state.alias,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setAlias: (aliasInput: string) => {
    dispatch(setAlias(aliasInput));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

type EditablePlayerAliasProps = ConnectedProps<typeof connector>;
export default connector(EditablePlayerAlias);



function EditablePlayerAlias(props: EditablePlayerAliasProps) {

  const [aliasInput, setAliasInput] = useState('');
  const [showModal, setShowModal] = useState(false);

  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (!props.alias) {
      setShowModal(true);
    }

    if (showModal && inputRef && inputRef.current) {

      inputRef.current.focus();
    }
  }, [props.alias, inputRef]);

  const updateAlias = () => {
    if (aliasInput) {
      props.setAlias(aliasInput);
      setShowModal(false);
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateAlias();
    }
  }

  const tryHide = () => {
    if (props.alias) {
      setShowModal(false);
    }
  }

  return (
    <div>

      <Modal show={showModal}
        onHide={() => { tryHide() }}
        aria-labelledby="contained-modal-title-vcenter"
        centered>

        <Modal.Header closeButton>
          <Modal.Title>What should people call you?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup className="">
            <FormControl
              name="joinCodeInput"
              ref={inputRef}
              className="text-center"
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={10}
              placeholder="Enter your alias...">
            </FormControl>
            <Button name="setAliasButton" onClick={() => { updateAlias() }}
              disabled={!aliasInput}>
              Confirm
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>

      Player Alias
      <div>
        <FontAwesomeIcon icon={faUser} size="2x" />
        <div className="input-device">
          <small>
            {props.alias}

            <div>
              <LinkButton onClick={() => { setShowModal(true) }}>edit</LinkButton>
            </div>
          </small>
        </div>
      </div>
    </div>
  );
}
