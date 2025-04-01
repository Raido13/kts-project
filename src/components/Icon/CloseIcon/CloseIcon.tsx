import * as React from 'react';
import Icon, { IconProps } from '@shared/components/Icon';

const CloseIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox={'0 0 18 18'} {...props}>
    <path
      d="M7 9L1 3C0.447715 2.44771 0.447715 1.55228 1 1C1.55228 0.447715 2.44772 0.447715 3 1L9 7L15 1C15.5523 0.447715 16.4477 0.447715 17 1C17.5523 1.55228 17.5523 2.44772 17 3L11 9L17 15C17.5523 15.5523 17.5523 16.4477 17 17C16.4477 17.5523 15.5523 17.5523 15 17L9 11L3 17C2.44771 17.5523 1.55228 17.5523 1 17C0.447715 16.4477 0.447715 15.5523 1 15L7 9Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </Icon>
);

export default CloseIcon;
