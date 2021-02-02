import './App.css';

import RomUploadContainer from './containers/RomUploadContainer';

function App() {
  return (
    <div className="App">
      <i className="fa fa-upload" aria-hidden="true" />
      <header className="App-header">


        <RomUploadContainer />

      </header>
    </div>
  );
}

export default App;
