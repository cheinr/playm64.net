import { Form, Table } from 'react-bootstrap';
import { AdvancedEmulatorConfigOverridesProps } from '../containers/AdvancedEmulatorConfigOverridesContainer';
import { GameControlsDisplayProps } from '../containers/GameControlsDisplayContainer';

const AdvancedEmulatorConfigOverridesComponent = (props: AdvancedEmulatorConfigOverridesProps) => {


  const updateRiceConfigValue = (configKey: string, newValue: number) => {
    const newConfigOverrides = Object.assign({}, props.emulatorConfigOverrides, {
      videoRice: Object.assign({}, props.emulatorConfigOverrides.videoRice, {
        [configKey]: newValue
      })
    });

    props.setEmulatorConfigOverrides(newConfigOverrides);
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
            <td>ScreenupdateSetting</td>
            <td>
              <Form.Select
                value={(props.emulatorConfigOverrides?.videoRice?.ScreenUpdateSetting ?? 1).toString()}
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
    </div>
  );
};

export default AdvancedEmulatorConfigOverridesComponent;

