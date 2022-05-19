import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HomeProps } from '../containers/HomeContainer';


export default function Home(props: HomeProps) {

  return (
    <div>

      <div className="row my-5 text-center">

        <div>
          <span>

            <Link to="play-online?host=true">
              <Button
                variant="primary"
                className="m-2"
                size="lg">

                Host Game
              </Button>
            </Link>

            <Link to="play-online">
              <Button
                variant="primary"
                className="m-2"
                size="lg">

                Join Game
              </Button>
            </Link>

          </span>
        </div>
        <div>
          <span>

            <Link to="/play-locally">
              <Button variant="secondary" className="m-2" >
                Play Locally
              </Button>
            </Link>
          </span>
        </div>
      </div>
    </div >
  );
}
