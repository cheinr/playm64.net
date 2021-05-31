import Modal from 'react-modal';
import { putSaveFile } from 'mupen64plus-web';
import React, { ReactNode, RefObject } from 'react';
import { GameSaveManagementComponentProps } from '../containers/GameSaveManagementContainer';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

interface GameSaveManagementComponentState {
  modalIsOpen: boolean,
  filesToImport: File[],
  importSuccessMessage: String,
  importFailureMessage: String
}

class GameSaveManagementComponent extends React.Component<{}, GameSaveManagementComponentState> {

  private inputRef: RefObject<HTMLInputElement> = React.createRef();

  public constructor(props: GameSaveManagementComponentProps) {
    super(props);
    this.state = {
      modalIsOpen: false,
      filesToImport: [],
      importSuccessMessage: '',
      importFailureMessage: ''
    };
  }

  public openImportSaveModal() {
    this.setState(Object.assign({}, this.state, {
      modalIsOpen: true
    }));
  }

  public closeImportSaveModal() {

    this.setState(Object.assign({}, this.state, {
      modalIsOpen: false,
      filesToImport: [],
      importSuccessMessage: '',
      importFailureMessage: ''
    }));
  }

  public render(): ReactNode {

    const handleFiles = (event: any) => {


      const files = event.target.files;

      this.setState(Object.assign({}, this.state, {
        filesToImport: files,
        importSuccessMessage: "",
        importFailureMessage: ""
      }));
    }

    const importRoms = () => {

      this.setState({
        importSuccessMessage: "",
        importFailureMessage: ""
      });

      console.log('files: %o', this.state.filesToImport);

      const putSaveFilePromises: Promise<void>[] = [];

      Object.values(this.state.filesToImport).forEach((file) => {
        const fileName = file.name;

        putSaveFilePromises.push(file.arrayBuffer().then((data) => {
          return putSaveFile(fileName, data);
        }));
      });

      Promise.all(putSaveFilePromises).then(() => {
        console.log("Finished importing the selected savefiles!");
        this.setState({
          filesToImport: [],
          importSuccessMessage: "Finished importing the selected savefiles!"
        });
      }).catch((err) => {
        this.setState({
          importFailureMessage: `Exception while importing the selected files: ${err}`,
        });
      });
    };

    return (
      <div>

        <Modal
          isOpen={this.state.modalIsOpen}
          contentLabel="Example Modal"
          style={customStyles}
          onRequestClose={() => this.closeImportSaveModal()}
        >
          <div className="align-right">
            <button onClick={() => this.closeImportSaveModal()}>Close</button>
          </div>

          <br />

          <div>
            <p>
              Import your game savefiles here. For these to be picked up they must
              have the following naming convention: "[romgoodname].[save extension]"
            </p>
            <p>
              You can find a list of rom goodnames <a href="https://github.com/mupen64plus/mupen64plus-core/blob/master/data/mupen64plus.ini">here</a>.
            </p>

          </div>

          <br />

          <div>
            <input ref={this.inputRef} type="file" onChange={handleFiles} />
          </div>

          <br />

          {this.state.filesToImport.length > 0
            && (<div>
              <button onClick={() => importRoms()}>Import Selected Files</button>
              <small> <b>note:</b> Any existing files with the same name will be overwritten</small>
            </div>)}

          <p style={{ color: 'green' }}>{this.state.importSuccessMessage}</p>
          <p style={{ color: 'red' }}>{this.state.importFailureMessage}</p>

          {this.state.importSuccessMessage !== ''
            && (<div className="align-center">
              <button onClick={() => this.closeImportSaveModal()}>Close</button>
            </div>)}

        </Modal>

        <div>
          <small>Manage Saves</small>
        </div>
        <button onClick={() => this.openImportSaveModal()}>Import Saves</button>
        <button>Export Saves</button>
      </div >
    );
  }

};


export default GameSaveManagementComponent;

