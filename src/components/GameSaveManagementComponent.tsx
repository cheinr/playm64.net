import { Form, Table, Button, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
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
  filesToImport: File[],
  importSuccessMessage: string,
  importFailureMessage: string,

  fileEntriesToExport: any[];
}

class GameSaveManagementComponent extends React.Component<any, GameSaveManagementComponentState> {

  private inputRef: RefObject<HTMLInputElement> = React.createRef();

  public constructor(props: GameSaveManagementComponentProps) {
    super(props);
    this.state = {
      filesToImport: [],
      importSuccessMessage: '',
      importFailureMessage: '',

      fileEntriesToExport: []
    };
  }

  private loadSaveFiles() {

    getAllSaveFiles().then((saveFileEntries) => {
      this.setState({
        fileEntriesToExport: saveFileEntries
      });
    }).catch((err) => {
      console.error('Error loading save files from persistant storage: ', err);
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
          <td><Button variant="success" onClick={() => downloadFile(fileEntry)}>
            <FontAwesomeIcon icon={faDownload} />
          </Button></td>
        </tr >
      );
    });

    return (
      <div>
        <br />

        <Tabs defaultActiveKey="importSaveFiles" className="mb-3"
          onSelect={(k) => {
            if (k === 'exportSaveFiles') {
              this.loadSaveFiles();
            }
          }}>
          <Tab eventKey="importSaveFiles" title="Import Saves">
            <div>
              <p>
                Import your game savefiles here. For these to be picked up they must
                have the following naming convention: "[romgoodname].[save extension]"
              </p>
              <p>
                You can find a list of rom goodnames <a href="https://github.com/mupen64plus/mupen64plus-core/blob/master/data/mupen64plus.ini" target="_blank">here
                <FontAwesomeIcon icon={faExternalLinkAlt} /></a>.
              </p>

            </div>

            <br />

            <div>
              <Form.Group>
                <Form.Control type="file" onChange={handleFiles} />
              </Form.Group>
            </div>

            <br />

            {
              this.state.filesToImport.length > 0
              && (<div className="row justify-content-start align-items-center">
                <div className="col-md-auto">
                  <Button onClick={() => importRoms()}>Import Selected Files</Button>
                </div>
                <div className="col-md-auto">
                  <small> <b>note:</b> Any existing files with the same name will be overwritten</small>
                </div>
              </div>)
            }

            <p style={{ color: 'green' }}>{this.state.importSuccessMessage}</p>
            <p style={{ color: 'red' }}>{this.state.importFailureMessage}</p>

          </Tab>
          <Tab eventKey="exportSaveFiles" title="Export Saves">
            <Table>
              <thead>
                <tr>
                  <th>Save File</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filesToExportTableRows}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </div >
    );
  }

}

export default GameSaveManagementComponent;

