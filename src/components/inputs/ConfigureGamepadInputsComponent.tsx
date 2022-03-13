import { Table, Button, FormControl } from 'react-bootstrap';
import { findAutoInputConfig, writeAutoInputConfig } from 'mupen64plus-web';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class GamepadPoller {
  lastGamepadState: { buttons: Array<boolean>, axes: Array<number> } = {
    buttons: [],
    axes: []
  };
  pollingInterval: any = null;
  inputListener: Function | null = null;
  changeListener: Function | null = null;

  public startPolling(): void {
    this.pollingInterval = setInterval(() => this.pollButtons(), 100);
  }

  public stopPolling(): void {
    clearInterval(this.pollingInterval);
  }

  // Fires when a single input is pressed, returning the pressed input
  public setInputListener(inputListener: Function | null) {
    this.inputListener = inputListener;
  }

  // Fires whenever the state of any input changes
  public setChangeListener(changeListener: Function | null) {
    this.changeListener = changeListener;
  }

  private pollButtons(): void {
    const gamepad = navigator.getGamepads()[0];

    if (gamepad) {

      gamepad.axes.forEach((axis, index) => {
        if (axis > .5) {
          if (this.lastGamepadState.axes[index] < .5) {
            this.emitAxisInput(`${index}+`);
            this.emitChange(gamepad);
          }
        } else if (axis < -.5) {
          if (this.lastGamepadState.axes[index] > -.5) {
            this.emitAxisInput(`${index}-`);
            this.emitChange(gamepad);
          }
        } else {
          const lastAxisState = this.lastGamepadState.axes[index];
          if (lastAxisState > .5 || lastAxisState < -.5) {
            this.emitChange(gamepad);
          }
        }
        this.lastGamepadState.axes[index] = axis;
      });

      gamepad.buttons.forEach((button, index) => {
        if (button.pressed) {
          if (!this.lastGamepadState.buttons[index]) {
            this.emitButtonInput(index);
            this.emitChange(gamepad);
          }
        } else {
          if (this.lastGamepadState.buttons[index]) {
            this.emitChange(gamepad);
          }
        }
        this.lastGamepadState.buttons[index] = button.pressed;
      });
    }
  }

  private emitChange(gamepad: Gamepad): void {
    const pressedInputs = new Set();

    gamepad.axes.forEach((axis, index) => {
      if (axis > .5) {
        pressedInputs.add(`axis(${index}+)`);
        pressedInputs.add(`axis(${index}-,${index}+)`);
      } else if (axis < -.5) {
        pressedInputs.add(`axis(${index}-)`);
        pressedInputs.add(`axis(${index}-,${index}+)`);
      }
    });

    gamepad.buttons.forEach((button, index) => {
      if (button.pressed) {
        pressedInputs.add(`button(${index})`);
      }
    });

    if (this.changeListener) {
      this.changeListener(pressedInputs);
    }
  }

  private emitAxisInput(index: string) {
    if (this.inputListener) {
      this.inputListener(`axis(${index})`);
    }
  }

  private emitButtonInput(index: number) {
    if (this.inputListener) {
      this.inputListener(`button(${index})`);
    }
  }
}

const gamepadPoller = new GamepadPoller();
const ConfigureGamepadInputsComponent = (props: any) => {

  const [loading, setIsLoading] = useState(true);

  const inputMappings = [
    {
      key: 'A Button',
      label: 'A Button',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'B Button',
      label: 'B Button',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'Start',
      label: 'Start',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'Z Trig',
      label: 'Z Trigger',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'L Trig',
      label: 'L Trigger',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'R Trig',
      label: 'R Trigger',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'X Axis',
      label: 'X Axis',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'Y Axis',
      label: 'Y Axis',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'DPad U',
      label: 'DPad U',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'DPad D',
      label: 'DPad D',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'DPad L',
      label: 'DPad L',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'DPad R',
      label: 'DPad R',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 1,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'C Button U',
      label: 'C Button U',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 2,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'C Button D',
      label: 'C Button D',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 2,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'C Button L',
      label: 'C Button L',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 2,
      inputRef: useRef<HTMLInputElement>(null)
    },
    {
      key: 'C Button R',
      label: 'C Button R',
      value: useState(''),
      isPressed: useState(false),
      maxMappings: 2,
      inputRef: useRef<HTMLInputElement>(null)
    }
  ];

  useEffect(() => {

    gamepadPoller.startPolling();
    findAutoInputConfig(props.gamepadName.slice(0, 63)).then((result: any) => {
      console.log('Found autoInputConfig: ', result);

      if (result) {
        inputMappings.forEach((inputMapping) => {
          if (inputMapping.key in result.config) {
            const updateInput = inputMapping.value[1];
            updateInput(result.config[inputMapping.key]);
          }
        });
      }

    }).catch((err: any) => {
      console.error('Error while attempting to find InputAutoCfg Entry for controller [%s]: ', props.gamepadName.slice(0, 63), err);
    }).finally(() => {
      setIsLoading(false);
    });

    return () => {
      gamepadPoller.stopPolling();
    };
  }, [props.gamepadName]);

  gamepadPoller.setInputListener(null);

  const focusedInputMapping = useState('');
  const [nextCursorIndex, setNextCursorIndex] = useState(-1);
  const [configWriteSuccessMessage, setConfigWriteSuccessMessage] = useState('');
  const [configWriteFailureMessage, setConfigWriteFailureMessage] = useState('');

  const saveConfiguration = () => {
    const config = inputMappings.map((inputMapping) => {
      const key = inputMapping.key;
      const value = inputMapping.value[0];

      return { [key]: value };
    }).reduce((acc, newValue) => {
      return Object.assign({}, acc, newValue);
    });

    config['plugged'] = 'True';
    config['plugin'] = '2';
    config['mouse'] = 'False';

    writeAutoInputConfig(props.gamepadName.slice(0, 63), config).then(() => {
      setConfigWriteSuccessMessage('Config successfully saved!');
    }).catch((err) => {
      setConfigWriteFailureMessage('Error while saving config: ' + err);
    });
  };

  if (focusedInputMapping[0]) {


    const inputTarget = inputMappings.find((inputMapping) => {
      return inputMapping.key === focusedInputMapping[0];
    });

    // hax
    if (nextCursorIndex !== -1) {
      setTimeout(
        () => { inputTarget?.inputRef.current?.setSelectionRange(nextCursorIndex, nextCursorIndex); },
        0);

      setNextCursorIndex(-1);
    }

    gamepadPoller.setInputListener((inputDefinition: string) => {

      const allInputDefinitions = inputMappings.flatMap((inputMapping) => {
        return inputMapping.value[0].split(' ');
      });

      if (inputTarget) {
        console.log('inputTarget: %o', inputTarget);
        const inputMappings = inputTarget.value[0].split(' ').filter((inputMapping) => inputMapping !== '');

        let effectiveInputDefinition = inputDefinition;
        if (inputTarget.key.includes('Axis') && inputDefinition.includes('axis')) {
          const axisNumber = inputDefinition[5];
          effectiveInputDefinition = `axis(${axisNumber}-,${axisNumber}+)`;
        }

        if (!allInputDefinitions.includes(effectiveInputDefinition)
          && inputMappings.length < inputTarget.maxMappings) {
          inputMappings.push(effectiveInputDefinition);
        }

        const setInputMapping = inputTarget.value[1];
        setInputMapping(inputMappings
          .filter((def) => def !== '')
          .join(' '));
      }
    });
  }

  gamepadPoller.setChangeListener((allPressedInputs: string[]) => {

    inputMappings.forEach((inputMapping) => {
      const mappings = inputMapping.value[0];

      let mappingIsPressed = false;

      allPressedInputs.forEach((pressedInput) => {
        if (mappings.includes(pressedInput)) {
          mappingIsPressed = true;
        }
      });

      const setIsPressed = inputMapping.isPressed[1];
      setIsPressed(mappingIsPressed);
    });
  });

  const inputRows = inputMappings.map((inputMapping) => {

    const onFocus = () => {
      focusedInputMapping[1](inputMapping.key);
    };

    const onBlur = () => {
      focusedInputMapping[1]('');
    };

    const onChange = (event: any) => {

      if (event.nativeEvent.inputType === 'deleteContentBackward') {
        const selectionStart = event.target.selectionStart;

        if (selectionStart === 0) {
          return;
        }

        const currentValue = inputMapping.value[0];

        // find the first word before 'selectionStart'
        const previousWordStart = currentValue.slice(0, selectionStart).trim().lastIndexOf(' ') + 1;

        let previousWordEnd = currentValue.slice(previousWordStart, currentValue.length).indexOf(' ');
        if (previousWordEnd === -1) {
          previousWordEnd = currentValue.length;
        } else {
          previousWordEnd += previousWordStart;
        }

        const previousWord = currentValue.slice(previousWordStart, previousWordEnd);

        const currentInputDefinitions = currentValue.split(' ');
        const wordToDeleteIndex = currentInputDefinitions.findIndex((inputDefinition) => inputDefinition === previousWord);

        if (wordToDeleteIndex !== -1) {
          const nextCursorIndex = currentInputDefinitions.slice(0, wordToDeleteIndex).join(' ').length;

          setNextCursorIndex(nextCursorIndex);

          currentInputDefinitions.splice(wordToDeleteIndex, 1);
        }

        const setInputDefinitions = inputMapping.value[1];
        setInputDefinitions(currentInputDefinitions.join(' '));
      }

      if (event.nativeEvent.inputType === 'deleteContentForward') {
        const selectionStart = event.target.selectionStart;
        const currentValue = inputMapping.value[0];

        if (selectionStart === currentValue.length) {
          return;
        }

        // find the first word after (or during) 'selectionStart'
        let nextWordEnd = currentValue.slice(selectionStart, currentValue.length).trim().indexOf(' ');
        if (nextWordEnd === -1) {
          nextWordEnd = currentValue.length;
        } else {
          nextWordEnd += selectionStart;

          // in case we trimmed something
          if (currentValue[selectionStart] === ' ') {
            nextWordEnd++;
          }
        }

        const nextWordStart = currentValue.slice(0, nextWordEnd).lastIndexOf(' ') + 1;
        const previousWord = currentValue.slice(nextWordStart, nextWordEnd);

        const currentInputDefinitions = currentValue.split(' ');
        const wordToDeleteIndex = currentInputDefinitions.findIndex((inputDefinition) => inputDefinition === previousWord);

        if (wordToDeleteIndex !== -1) {
          const nextCursorIndex = currentInputDefinitions.slice(0, wordToDeleteIndex).join(' ').length;
          setNextCursorIndex(nextCursorIndex);

          currentInputDefinitions.splice(wordToDeleteIndex, 1);
        }

        const setInputDefinitions = inputMapping.value[1];
        setInputDefinitions(currentInputDefinitions.join(' '));
      }

      if (event.key === 'Enter') {
        const focusedInputMappingIndex = inputMappings.findIndex((inputMapping) => {
          return inputMapping.key === focusedInputMapping[0];
        });

        if (focusedInputMappingIndex !== -1) {

          const maybeNextInputMapping = inputMappings[focusedInputMappingIndex + 1];
          if (maybeNextInputMapping) {
            maybeNextInputMapping.inputRef.current?.select();
          }
        }
      }
    };

    const placeholderText = focusedInputMapping[0] === inputMapping.key ? 'Press an input...' : '';
    const labelStyle = inputMapping.isPressed[0]
      ? { 'backgroundColor': 'green' } : {};
    return (
      <tr key={inputMapping.key}>
        <td style={labelStyle}>{inputMapping.label}</td>
        <td>
          <FormControl
            type="text"
            size="sm"
            value={inputMapping.value[0]}
            ref={inputMapping.inputRef}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholderText}
            disabled={loading}
          />
        </td>
      </tr>
    );
  });

  const clearAll = () => {
    inputMappings.forEach((inputMapping) => {
      inputMapping.value[1]('');
    });
  };

  return (
    <div>
      <Button variant="danger"
        className="float-end"
        onClick={clearAll}>
        Clear All
        &nbsp;<FontAwesomeIcon icon={faTrashAlt} />
      </Button>
      <Table size="sm">
        <thead>
          <tr>
            <th>Input</th>
            <th>Gamepad Mapping</th>
          </tr>
        </thead>
        <tbody>
          {inputRows}
        </tbody>
      </Table>

      <div className="py-2">
        <Button onClick={saveConfiguration}>Save Configuration</Button>
      </div>

      <p style={{ color: 'green' }}>{configWriteSuccessMessage}</p>
      <p style={{ color: 'red' }}>{configWriteFailureMessage}</p>

    </div>
  );
};

export default ConfigureGamepadInputsComponent;
