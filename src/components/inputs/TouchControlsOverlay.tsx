import { useRef, useEffect } from 'react';
import nipplejs from 'nipplejs';
import { gamepadSimulator } from '../../GamepadSimulator';
import './TouchControlsOverlay.css';

const TouchControlsOverlay = () => {

  const joystickZoneRef = useRef(null);

  useEffect(() => {
    const nippleManager = nipplejs.create({
      zone: joystickZoneRef.current!,
      mode: 'static',
      restJoystick: true,
      position: {
        left: '75px',
        bottom: '75px'
      }
    });

    // We can't do 'nippleManager.get(0)', as nipplejs increments
    // the default id each time a new nippleManager is created
    // We get around this by making use of this functionality:
    // https://github.com/yoannmoinet/nipplejs/blob/master/src/collection.js#L83-L85
    // But since the type is declared as an Array, we can't do
    // that without casting.
    const joystick = (nippleManager as any).get();
    if (joystick) {
      joystick.on('move', (event: any, data: any) => {
        gamepadSimulator.setAxis(0, data.vector.x);
        gamepadSimulator.setAxis(1, -1 * data.vector.y);
      });

      joystick.on('end', (event: any, data: any) => {
        gamepadSimulator.setAxis(0, 0);
        gamepadSimulator.setAxis(1, 0);
      });
    }

    return () => {
      nippleManager.destroy();
    };
  }, []);

  const pressButton = (button: number) => {
    gamepadSimulator.pressButton(button, true);
  };

  const releaseButton = (button: number) => {
    gamepadSimulator.pressButton(button, false);
  };

  return (
    <div>
      <div id="JoystickZone" ref={joystickZoneRef} />
      <button className="button buttonL"
        onTouchStart={() => pressButton(0)}
        onTouchEnd={() => releaseButton(0)}
      >L</button>
      <button className="button buttonR"
        onTouchStart={() => pressButton(1)}
        onTouchEnd={() => releaseButton(1)}
      >R</button>
      <button className="button buttonZ"
        onTouchStart={() => pressButton(2)}
        onTouchEnd={() => releaseButton(2)}
      >Z</button>

      <button className="button buttonCUp"
        onTouchStart={() => pressButton(3)}
        onTouchEnd={() => releaseButton(3)}
      >&#708;</button>
      <button className="button buttonCDown"
        onTouchStart={() => pressButton(4)}
        onTouchEnd={() => releaseButton(4)}
      >&#709;</button>
      <button className="button buttonCLeft"
        onTouchStart={() => pressButton(5)}
        onTouchEnd={() => releaseButton(5)}
      >&#706;</button>
      <button className="button buttonCRight"
        onTouchStart={() => pressButton(6)}
        onTouchEnd={() => releaseButton(6)}
      >&#707;</button>

      <button className="button buttonA"
        onMouseDown={() => pressButton(7)}
        onMouseUp={() => releaseButton(7)}
        onTouchStart={() => pressButton(7)}
        onTouchEnd={() => releaseButton(7)}
      >A</button>
      <button className="button buttonB"
        onTouchStart={() => pressButton(8)}
        onTouchEnd={() => releaseButton(8)}
      >B</button>

      <button className="button buttonStart"
        onTouchStart={() => pressButton(9)}
        onTouchEnd={() => releaseButton(9)}
      >START</button>

    </div>
  );
};

export default TouchControlsOverlay;

