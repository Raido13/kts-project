import * as React from 'react';
import Icon, { IconProps } from '@shared/components/Icon';

const BurgerIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox={'0 0 18 12'} {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1C0 0.447715 0.447716 0 1 0L17 0C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2L1 2C0.447715 2 0 1.55228 0 1ZM0 6C0 6.55228 0.447715 7 1 7L17 7C17.5523 7 18 6.55228 18 6C18 5.44772 17.5523 5 17 5L1 5C0.447716 5 0 5.44772 0 6ZM0 11C0 11.5523 0.447715 12 1 12L17 12C17.5523 12 18 11.5523 18 11C18 10.4477 17.5523 10 17 10L1 10C0.447716 10 0 10.4477 0 11Z"
      fill="currentColor"
    />
  </Icon>
);

export default BurgerIcon;
