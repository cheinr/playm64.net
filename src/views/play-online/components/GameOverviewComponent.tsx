import { useState, useRef } from 'react';
import { Button, Overlay, Tooltip } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GameRoomOverviewProps } from '../containers/GameOverviewContainer';

const GameOverviewComponent = (props: GameRoomOverviewProps) => {
  const [showCopyNotice, setShowCopyNotice] = useState(false);
  const copyTarget = useRef(null);

  return (
    <div>
      <h4>Playing "{props.romShortName.trim()}"</h4>

      <h5 id="joinCode">
        Join Code: {props.gameRoomId}
        <CopyToClipboard
          text={props.gameRoomId}
          onCopy={() => {
            setShowCopyNotice(true);
            setTimeout(() => setShowCopyNotice(false), 1000);
          }}
        >
          <Button className="mx-1" ref={copyTarget} size="sm" variant="outline-success">Copy</Button>
        </CopyToClipboard>

        <Overlay target={copyTarget.current} show={showCopyNotice} placement="right">
          {(props) => (
            <Tooltip {...props}>
              Copied to clipboard!
            </Tooltip>
          )}
        </Overlay>
      </h5>

      { props.gameIsPaused &&
        <h5 className="text-warning">PAUSED</h5>}
    </div>
  );
};

export default GameOverviewComponent;
