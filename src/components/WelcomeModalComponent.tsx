import { Modal, Button } from 'react-bootstrap';
import { WelcomeModalProps } from '../containers/WelcomeModalContainer';


const WelcomeModalComponent = (props: WelcomeModalProps) => {

  let disableWelcomeModal = false;

  const toggleDisplayPreferences = () => {
    disableWelcomeModal = disableWelcomeModal ? false : true;
  };

  return (
    <div>

      <Modal
        show={props.shouldDisplayModal}
        onHide={() => props.dismissModal(false)}
        centered
      >

        <Modal.Header closeButton>
          <Modal.Title>
            Welcome to playm64.net!
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>


          <p>
            This is an experimental project to port the mupen64plus
            emulator (<a href="https://mupen64plus.org/">link</a>) to the browser, complete with netplay support.
          </p>
          <p>

            Expect to find many issues, ranging from graphical glitches, to games crashing completely, and
            anything in between. For the best experience, try to use the latest Firefox or Chrome-based browser available. Check out the project fork on github
            (<a href='https://github.com/cheinr/mupen64plus-web'>link</a>), and if you're
    interested in a more stable emulation experience check out the <a href="https://m64p.github.io/">m64p emulator</a> (no affiliation with playm64.net).

        </p>
          <p>
            Users are required to provide their own ROMs to emulate -- playm64.net does not distribute ROMs.
        </p>


          <div className="align-center">
            <input type="checkbox" onChange={() => toggleDisplayPreferences()} /> Don't display this again
    </div>
          <div className="align-center">
            <Button onClick={() => props.dismissModal(disableWelcomeModal)}>
              Dismiss
            </Button>

          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default WelcomeModalComponent;

