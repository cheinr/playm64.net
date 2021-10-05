import { GameRoomOverviewProps } from '../containers/GameOverviewContainer';

const GameOverviewComponent = (props: GameRoomOverviewProps) => {
  return (
    <div>
      <h4>Playing "{props.romShortName.trim()}"</h4>

      { props.waitingForNetplayGameStart &&
        <h5 id="joinCode">Join Code: {props.gameRoomId}</h5>
      }
    </div >
  );
};

export default GameOverviewComponent;
