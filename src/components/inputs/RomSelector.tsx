import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEvent, useEffect, useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { listPersistedROMs, loadROM, persistROM, deleteROM } from '../../romUtils';
import './RomSelector.css';

interface RomSelectorProps {
  onROMSelect(romName: string, romData: ArrayBuffer): void;
}

const RomSelector = function(props: RomSelectorProps) {

  const [romNames, setRomNames] = useState<string[]>([]);
  const [selectedROM, setSelectedROM] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingNewROMs, setIsProcessingNewROMs] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    listPersistedROMs().then((roms) => {
      setIsLoading(false);
      setRomNames(roms.sort());
    }).catch((err) => {
      console.error('Error while listing persisted ROMs: ', err);
      setErrorMessage(`Unable to load ROMs: ${err}`);
    });
  }, []);


  const rows = romNames.map((romName, index) => {

    let className = 'rom-table-cell';
    if (selectedROM === romName) {
      className += ' selected';
    }

    const onSelectROM = () => {

      setErrorMessage('');

      loadROM(romName).then((romData: ArrayBuffer) => {
        setSelectedROM(romName);
        props.onROMSelect(romName, romData);
      }).catch((err) => {
        console.error('Error while loading ROM [%s]: ', romName, err);
        setErrorMessage(`Error while loading ROM [${romName}]: ${err}`);
      });
    };

    const onDeleteROM = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      setErrorMessage('');
      setIsProcessingNewROMs(true);

      deleteROM(romName).then(async () => {
        return listPersistedROMs().then((roms) => {
          setRomNames(roms.sort());
          setIsProcessingNewROMs(false);
        });
      }).catch((err) => {
        console.error('Error while deleting ROM [%s]: ', romName, err);
        setErrorMessage(`Error while deleting ROM [${romName}]: ${err}`);
      });
    };

    return (
      <tr key={'rom-' + index} className="rom-table-cell">
        <td className={className} onClick={onSelectROM}>
          {romName}
          <span className="float-end">
            <Button variant="danger" size="sm" onClick={onDeleteROM}>X</Button>
          </span>
        </td>
      </tr >
    );
  });

  const onFileChange = (files: any) => {

    setErrorMessage('');
    setIsProcessingNewROMs(true);

    const persistROMPromises = files.map((file: any) => {
      return file.arrayBuffer().then(async (fileBuffer: ArrayBuffer) => {
        return persistROM(fileBuffer).catch((err) => {
          console.error('Error while persisting ROM [%s]: ', file.name, err);
          setErrorMessage(`Exception while loading file [${file.name}]: ${err}`);
        });
      });
    });

    Promise.allSettled(persistROMPromises).then(async () => {
      return listPersistedROMs().then((roms) => {
        setRomNames(roms.sort());
        setIsProcessingNewROMs(false);
      });
    }).catch((err) => {
      console.error('Exception while loading new ROMs: %o', err);
    });
  };


  if (rows.length > 0 || isLoading || isProcessingNewROMs) {

    const displaySpinner = isProcessingNewROMs || isLoading;

    return (
      <div>

        <Dropzone onDrop={onFileChange} noClick>
          {({ getRootProps, getInputProps, open }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />


                {displaySpinner &&
                  <Spinner animation="border" className="overlay-spinner" />}

                <Table variant="dark">

                  <thead>
                    <tr>
                      <th>
                        <div>
                          Select a Rom

                          <Button className="float-end" onClick={open}>
                            Load ROMs
                          </Button>

                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="rom-table-wrapper">
                    {rows}
                  </tbody>
                </Table>

              </div>

            </section>
          )}
        </Dropzone>
        <div className="text-danger">
          {errorMessage}
        </div>
      </div >
    );
  } else {
    return (
      <div>
        <div id="romUploadContainer">
          <Dropzone onDrop={onFileChange}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} className="romDropZone text-center">
                  <FontAwesomeIcon icon={faUpload} size="4x" className="text-center" />
                  <input {...getInputProps()} />
                  <p>Click or drag to load a ROMs to play</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <div className="text-danger">
          {errorMessage}
        </div>
      </div>
    );
  }
};

export default RomSelector;
