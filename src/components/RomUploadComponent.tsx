import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Dropzone from 'react-dropzone';

import { RomUploadProps } from '../containers/RomUploadContainer';

const RomUploadComponent = (props: RomUploadProps) => {
  console.log('Rendering EditPanelComponent');

  return (
    <div>
      <Dropzone onDrop={acceptedFiles => props.onFileChange(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <FontAwesomeIcon icon={faUpload} size="4x" />
              <input {...getInputProps()} />
              <p>Click or drag to load a ROM to play</p>
            </div>
          </section>
        )}
      </Dropzone>

      { props.loadedRomName && "Loaded: " + props.loadedRomName}
    </div>
  );
};

export default RomUploadComponent;
