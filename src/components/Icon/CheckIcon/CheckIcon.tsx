import * as React from 'react';
import Icon, { IconProps } from '@shared/components/Icon';

const CheckIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox={'0 0 24 24'} {...props}>
    <path d="M4 11.6129L9.87755 18L20 7" stroke="currentColor" strokeWidth="2" fill="transparent" />
  </Icon>
);

export default CheckIcon;
