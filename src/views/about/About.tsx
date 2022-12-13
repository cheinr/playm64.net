import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function About() {
  return (
    <div>

      <div className="text-center py-4">
        <div>
          <Link to="/">
            <Button variant="primary">Main Menu</Button>
          </Link>
        </div>
      </div>


      <h2 className="pb-3">
        Welcome to playm64.net!
      </h2>

      <p>
        This is an experimental project to port the <a href="https://mupen64plus.org/" target="_blank">mupen64plus emulator <FontAwesomeIcon icon={faExternalLinkAlt} /></a> to the browser, complete with netplay support.
      </p>
      <p>

        Expect to find many issues, ranging from graphical glitches, to games crashing completely, and
        anything in between. For the best experience, try to use the latest Firefox or Chrome-based browser available. Check out the <a href='https://github.com/cheinr/playm64.net' target="_blank">project fork on github <FontAwesomeIcon icon={faExternalLinkAlt} /></a>, and if you're
    interested in a more stable emulation experience check out the <a href="https://simple64.github.io/" target="_blank">simple64 emulator <FontAwesomeIcon icon={faExternalLinkAlt} /></a> (no affiliation with playm64.net).

      </p>
      <p>
        Users are required to provide their own ROMs to emulate -- playm64.net does not distribute ROMs.
      </p>

    </div >
  );
}
