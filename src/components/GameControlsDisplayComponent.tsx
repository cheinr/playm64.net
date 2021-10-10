import { Table } from 'react-bootstrap';
import { GameControlsDisplayProps } from '../containers/GameControlsDisplayContainer';

const GameOverviewComponent = (props: GameControlsDisplayProps) => {
  return (
    <div>
      <div className="game-controls">
        Game Controls
        <Table size="sm">
          <thead>
            <tr>
              <th>N64 Control</th>
              <th>Keyboard Mapping</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Control Pad</td>
              <td>WASD</td>
            </tr>
            <tr>
              <td>Control Stick</td>
              <td>←→↑↓</td>
            </tr>
            <tr>
              <td>Start</td>
              <td>Enter</td>
            </tr>
            <tr>
              <td>A, B</td>
              <td>Left Shift, Left Ctrl</td>
            </tr>
            <tr>
              <td>Z, L, R</td>
              <td>Z, X, C</td>
            </tr>
            <tr>
              <td>C Buttons</td>
              <td>IJKL</td>
            </tr>
          </tbody>
        </Table>
      </div>


      <div className="game-controls">
        Emulator Controls
        <Table size="sm">
          <thead>
            <tr>
              <th>Key</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {!props.inNetplaySession
              &&
              <tr>
                <td>F10, F11</td>
                <td>Speed Up / Slow Down Emulator by 5%</td>
              </tr>
            }
            {!props.inNetplaySession
              &&
              <tr>
                <td>F</td>
                <td>Fast Forward (250%)</td>
              </tr>
            }
            {!props.inNetplaySession
              &&
              <tr>
                <td>P</td>
                <td>Pause/Resume Emulator</td>
              </tr>
            }
            {!props.inNetplaySession
              &&
              <tr>
                <td>?</td>
                <td>Single frame advance while paused</td>
              </tr>
            }
            <tr>
              <td>M</td>
              <td>Mute/Unmute</td>
            </tr>
            <tr>
              <td>[ &nbsp; ]</td>
              <td>Increase / Decrease Volume</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default GameOverviewComponent;

