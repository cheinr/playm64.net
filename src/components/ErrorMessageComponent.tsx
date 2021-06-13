import { ErrorMessageProps } from '../containers/ErrorMessageContainer';

const ErrorMessageComponent = (props: ErrorMessageProps) => {
  return (
    <div>
      <small style={{ color: 'red' }}>
        {props.emulatorErrorMessage}
      </small>
    </div>
  );
};

export default ErrorMessageComponent;


