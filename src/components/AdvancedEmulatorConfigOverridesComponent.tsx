import { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Table } from 'react-bootstrap';
import { AdvancedEmulatorConfigOverridesProps } from '../containers/AdvancedEmulatorConfigOverridesContainer';

export const M64_EMU_CONFIG_OVERRIDES_KEY = 'm64EmuConfigOverrides';

const AdvancedEmulatorConfigOverridesComponent = (props: AdvancedEmulatorConfigOverridesProps) => {

  // naming... "working" here meaning the config may not be "applied" yet
  const [workingConfigOverrides, setWorkingConfigOverrides] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setWorkingConfigOverrides(props.emulatorConfigOverrides);
  }, []);

  const updateRiceConfigValue = (configKey: string, newValue: number) => {

    const newConfigOverrides = Object.assign({}, workingConfigOverrides, {
      videoRice: Object.assign({}, workingConfigOverrides.videoRice, {
        [configKey]: newValue
      })
    });

    setWorkingConfigOverrides(newConfigOverrides);
  };

  const [shouldPersistOverrides, setShouldPersistOverrides] = useState(true);

  const applyOverrides = () => {
    props.setEmulatorConfigOverrides(workingConfigOverrides);

    if (shouldPersistOverrides) {

      const existingPersistedOverrides: any = JSON.parse(localStorage.getItem(M64_EMU_CONFIG_OVERRIDES_KEY) ?? '{}');
      existingPersistedOverrides[props.selectedROMGoodName] = workingConfigOverrides;

      localStorage.setItem(M64_EMU_CONFIG_OVERRIDES_KEY, JSON.stringify(existingPersistedOverrides));
      setSuccessMessage('Overrides successfully persisted and applied!');
    } else {
      setSuccessMessage('Overrides successfully applied!');
    }
  };

  const clearPersistedOverridesForSingleROM = () => {
    const existingPersistedOverrides: any = JSON.parse(localStorage.getItem(M64_EMU_CONFIG_OVERRIDES_KEY) ?? '{}');
    delete existingPersistedOverrides[props.selectedROMGoodName];

    localStorage.setItem(M64_EMU_CONFIG_OVERRIDES_KEY, JSON.stringify(existingPersistedOverrides));
    setSuccessMessage(`Successfully cleared persisted config overrides for ${props.selectedROMGoodName}!`);
  };

  const clearPersistedOverridesForAllROMs = () => {
    localStorage.setItem(M64_EMU_CONFIG_OVERRIDES_KEY, JSON.stringify({}));
    setSuccessMessage('Successfully cleared persisted config overrides for all ROMs!');
  };

  return (
    <div>

      <h5>Video-Rice Overrides</h5>

      <Table size="sm">
        <thead>
          <tr>
            <th>Config</th>
            { /* TODO - Add description dropdown */}
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ScreenUpdateSetting</td>
            <td>
              <Form.Select
                value={(workingConfigOverrides?.videoRice?.ScreenUpdateSetting ?? -1).toString()}
                onChange={(e) => updateRiceConfigValue('ScreenUpdateSetting', parseInt(e.currentTarget.value))}>

                <option value="-1">
                  No Override
                </option>
                <option value="0">
                  0=ROM default
                </option>
                <option value="1">
                  1=VI origin update (Recommended)
                </option>
                <option value="2">
                  2=VI origin change
                </option>
                <option value="3">
                  3=CI change
                </option>
                <option value="4">
                  4=first CI change (Recommended)
                </option>
                <option value="5">
                  5=first primitive draw
                </option>
                <option value="6">
                  6=before screen clear
                </option>
                <option value="7">
                  7=after screen drawn
                </option>
              </Form.Select>
            </td>
          </tr>
        </tbody>
      </Table>

      <hr />

      <div className="p-1">
        <Form.Check type="checkbox"
          label={`Automatically load these overrides for "${props.selectedROMGoodName}" in the future?`}
          checked={shouldPersistOverrides}
          onChange={() => { setShouldPersistOverrides(!shouldPersistOverrides); }}
        />
      </div>

      <div className="p-1">
        <Button onClick={applyOverrides} >
          Apply
        </Button>

        <Dropdown className="float-end">
          <Dropdown.Toggle variant="warning">
            Clear Persisted Overrides
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={clearPersistedOverridesForSingleROM}>For "{props.selectedROMGoodName}"</Dropdown.Item>
            <Dropdown.Item onClick={clearPersistedOverridesForAllROMs}>For all ROMs</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="p-2">
        <p style={{ color: 'lime' }}>{successMessage}</p>
      </div>
    </div>
  );
};

export default AdvancedEmulatorConfigOverridesComponent;

