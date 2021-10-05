import "./RomSelector.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import { persistROM, listPersistedROMs, loadROM } from '../romUtils';

interface RomSelectorProps {
  onROMSelect(romName: string, romData: ArrayBuffer): void;
}

const RomSelector = function(props: RomSelectorProps) {

  const [romNames, setRomNames] = useState<string[]>([]);
  const [selectedROM, setSelectedROM] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingNewROMs, setIsProcessingNewROMs] = useState(false);

  useEffect(() => {
    listPersistedROMs().then((roms) => {
      setIsLoading(false);
      setRomNames(roms.sort());
    });
  }, []);

  const rows = romNames.map((romName, index) => {

    let className = 'rom-table-cell';
    if (selectedROM === romName) {
      className += ' selected';
    }

    const onClick = () => {

      loadROM(romName).then((romData: ArrayBuffer) => {
        setSelectedROM(romName);
        props.onROMSelect(romName, romData);
      });
    }

    return (
      <tr key={"rom-" + index} className="rom-table-cell">
        <td className={className} onClick={onClick}>
          {romName}
        </td>
      </tr>
    );
  });

  const onFileChange = (files: any) => {

    setIsProcessingNewROMs(true);

    const persistROMPromises = files.map((file: any) => {
      return file.arrayBuffer().then((fileBuffer: ArrayBuffer) => {
        return persistROM(fileBuffer);
      });
    });

    Promise.all(persistROMPromises).then(() => {
      listPersistedROMs().then((roms) => {
        setRomNames(roms.sort());
        setIsProcessingNewROMs(false);
      });
    });
  };


  if (rows.length > 0 || isLoading || isProcessingNewROMs) {

    const displaySpinner = isProcessingNewROMs || isLoading;


    console.log(displaySpinner);

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
      </div >
    );
  } else {
    return (
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
    );
  }
}

export default RomSelector;
