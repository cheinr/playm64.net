import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { HomeProps } from '../containers/HomeContainer';

export default function Home(props: HomeProps) {

  const history = useHistory();

  const goToPlayOnline = (isHosting: boolean) => {

    if (isHosting && !props.showHostingMenu) {
      props.toggleHostingMenu();
    }

    if (!isHosting && props.showHostingMenu) {
      props.toggleHostingMenu();
    }

    history.push('/play-online');
  }

  return (
    <div>

      <div className="my-5 text-center">
        <div>
          <span>

            <Button
              variant="primary"
              className="m-2"
              size="lg"
              onClick={() => goToPlayOnline(true)}>

              Host Game
            </Button>

            <Button
              variant="primary"
              className="m-2"
              size="lg"
              onClick={() => goToPlayOnline(false)}>

              Join Game
            </Button>

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
