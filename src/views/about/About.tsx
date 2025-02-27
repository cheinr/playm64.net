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
        With the exception of the Mupen64Plus Test ROM available <a href='https://github.com/mupen64plus/mupen64plus-rom' target="_blank">here <FontAwesomeIcon icon={faExternalLinkAlt} /></a> under a GPL-2.0 license, and the <a href='https://github.com/cheinr/tankshootout64' target="_blank">TankShootout64 ROM<FontAwesomeIcon icon={faExternalLinkAlt} /></a>, users are required to provide their own ROM files to emulate. This site does not distribute ROM files between players.
      </p>

    </div >
  );
}
