import './style/ControllerPluginSlot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { useDrop } from 'react-dnd';

interface ControllerPluginSlot {
  children?: any;
  color: string;
  playerNumber: number;
}

const ControllerPluginSlot = (props: ControllerPluginSlot) => {

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'gamepad',
    drop: () => ({ playerNumber: props.playerNumber }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }));

  return (
    <div ref={drop} role={'PluginSlot'} className="col-sm-3 my-3">
      <div className={`m-1 controller-plugin-slot controller-plugin-slot-${props.color} h-100`}>

        <div className="text-centered">
          {`P${props.playerNumber}`}
        </div>

        {props.children && props.children}
      </div>
    </div>
  );
};

export default ControllerPluginSlot;
