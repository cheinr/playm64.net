import { PlayModeSelectProps } from '../containers/PlayModeSelectContainer';

const PlayModeSelectComponent = (props: PlayModeSelectProps) => {

  return (
    <div>
      <button> Play Locally </button>
      <button> Host Game </button>
      <button> Join Game </button>
    </div>
  );
};

export default PlayModeSelectComponent;
