import Modal from 'react-modal';
import { putSaveFile, getAllSaveFiles } from 'mupen64plus-web';
import React, { ReactNode, RefObject } from 'react';
import { GameSaveManagementComponentProps } from '../containers/GameSaveManagementContainer';


// These are from https://stackoverflow.com/questions/25354313/saving-a-uint8array-to-a-binary-file
const downloadURL = (data: any, fileName: any) => {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
};

const downloadFile = (fileEntry: any) => {

  const fileName = fileEntry.fileKey.replace('/mupen64plus/saves/', '');

  console.log(fileEntry);
  const saveFileBlob = new Blob([fileEntry.contents], {
    type: 'application/octet-stream'
  });

  const url = window.URL.createObjectURL(saveFileBlob);

  downloadURL(url, fileName);

  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

interface GameSaveManagementComponentState {
  fileImportModalIsOpen: boolean,
  filesToImport: File[],
  importSuccessMessage: string,
  importFailureMessage: string,

  fileExportModalIsOpen: boolean,
  fileEntriesToExport: any[];
}

class GameSaveManagementComponent extends React.Component<any, GameSaveManagementComponentState> {

  private inputRef: RefObject<HTMLInputElement> = React.createRef();

  public constructor(props: GameSaveManagementComponentProps) {
    super(props);
    this.state = {
      fileImportModalIsOpen: false,
      filesToImport: [],
      importSuccessMessage: '',
      importFailureMessage: '',

      fileExportModalIsOpen: false,
      fileEntriesToExport: []
    };
  }

  private openImportSaveModal() {
    this.setState(Object.assign({}, this.state, {
      fileImportModalIsOpen: true
    }));
  }

  private closeImportSaveModal() {

    this.setState(Object.assign({}, this.state, {
      fileImportModalIsOpen: false,
      filesToImport: [],
      importSuccessMessage: '',
      importFailureMessage: ''
    }));
  }

  private openExportSaveModal() {

    this.setState({
      fileExportModalIsOpen: true
    });

    getAllSaveFiles().then((saveFileEntries) => {
      this.setState({
        fileEntriesToExport: saveFileEntries
      });
    }).catch((err) => {
      console.error('Error loading save files from persistant storage: ', err);
    });
  }

  private closeExportSaveModal() {

    this.setState({
      fileExportModalIsOpen: false
    });
  }

  public render(): ReactNode {


    const handleFiles = (event: any) => {


      const files = event.target.files;

      this.setState(Object.assign({}, this.state, {
        filesToImport: files,
        importSuccessMessage: '',
        importFailureMessage: ''
      }));
    };

    const importRoms = () => {

      this.setState({
        importSuccessMessage: '',
        importFailureMessage: ''
      });

      console.log('files: %o', this.state.filesToImport);

      const putSaveFilePromises: Promise<void>[] = [];

      Object.values(this.state.filesToImport).forEach((file) => {
        const fileName = file.name;

        putSaveFilePromises.push(file.arrayBuffer().then(async (data) => {
          return putSaveFile(fileName, data);
        }));
      });

      Promise.all(putSaveFilePromises).then(() => {
        console.log('Finished importing the selected savefiles!');
        this.setState({
          filesToImport: [],
          importSuccessMessage: 'Finished importing the selected savefiles!'
        });
      }).catch((err) => {
        this.setState({
          importFailureMessage: `Exception while importing the selected files: ${err}`,
        });
      });
    };

    const filesToExportTableRows = this.state.fileEntriesToExport.map((fileEntry) => {
      return (
        <tr key={'fileRow-' + fileEntry.fileKey.replaceAll('/')}>
          <td> {fileEntry.fileKey} </td>
          <td><button onClick={() => downloadFile(fileEntry)}>download</button></td>
        </tr >
      );
    });

    return (
      <div>

        <Modal
          isOpen={this.state.fileImportModalIsOpen}
          contentLabel="Example Modal"
          className="Modal"
          overlayClassName="ModalOverlay"
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

        <Modal
          isOpen={this.state.fileExportModalIsOpen}
          contentLabel="Example Modal"
          className="Modal"
          overlayClassName="ModalOverlay"
          onRequestClose={() => this.closeExportSaveModal()}
        >

          <div className="align-right">
            <button onClick={() => this.closeExportSaveModal()}>Close</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Save File</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filesToExportTableRows}
            </tbody>
          </table>
        </Modal>


        <div>
          <small>Manage Saves</small>
        </div>
        <button onClick={() => this.openImportSaveModal()}>Import Saves</button>
        <button onClick={() => this.openExportSaveModal()}>Export Saves</button>
      </div >
    );
  }

}


export default GameSaveManagementComponent;

