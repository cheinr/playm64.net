// modified version of https://github.com/alvaromontoro/gamepad-simulator
export const gamepadSimulator = {
  getGamepads: null,
  fakeController: {
    axes: [0, 0],
    buttons: [
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      },
      {
        pressed: false,
        touched: false,
        value: 0
      }
    ],
    connected: false,
    id: 'playm64 touch controls',
    index: 0,
    mapping: 'standard',
    timestamp: Math.floor(Date.now() / 1000)
  },
  create: function() {

    gamepadSimulator.getGamepads = navigator.getGamepads;
    navigator.getGamepads = function() {
      return [
        gamepadSimulator.fakeController
      ];
    };
  },
  destroy: function() {
    if (gamepadSimulator.fakeController.connected) {
      gamepadSimulator.disconnect();
    }
    navigator.getGamepads = gamepadSimulator.getGamepads;
  },
  connect: function() {
    const event = new Event('gamepadconnected');
    gamepadSimulator.fakeController.connected = true;
    gamepadSimulator.fakeController.timestamp = performance.now();
    event.gamepad = gamepadSimulator.fakeController;
    window.dispatchEvent(event);
  },
  disconnect: function() {
    const event = new Event('gamepaddisconnected');
    gamepadSimulator.fakeController.connected = false;
    gamepadSimulator.fakeController.timestamp = performance.now();
    event.gamepad = gamepadSimulator.fakeController;
    window.dispatchEvent(event);
  },
  isActive: function() {
    return gamepadSimulator.fakeController.connected;
  },
  pressButton: function(button, pressed) {
    gamepadSimulator.fakeController.buttons[button].touched = pressed;
    gamepadSimulator.fakeController.buttons[button].pressed = pressed;
    gamepadSimulator.fakeController.buttons[button].value = pressed ? 1 : 0;
    gamepadSimulator.fakeController.timestamp = performance.now();
  },
  setAxis: function(axis, value) {
    gamepadSimulator.fakeController.axes[axis] = value;
    gamepadSimulator.fakeController.timestamp = performance.now();
  }
};
