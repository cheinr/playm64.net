import { MouseEvent } from 'react';

interface LinkButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const LinkButton = (props: LinkButtonProps) => {
  return (
    <button className="link-button"
      onClick={props.onClick}
      disabled={props.disabled}>
      {props.children}
    </button>
  );
};

export default LinkButton;

