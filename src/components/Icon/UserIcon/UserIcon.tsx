import * as React from 'react';
import Icon, { IconProps } from '@shared/components/Icon';

const UserIcon: React.FC<IconProps> = ({ ...props }) => (
  <Icon {...props} width={30} height={30} viewBox="0 0 30 30" fill={'none'} color={'primary'}>
    <path
      d="M15 15C18.4518 15 21.25 12.2018 21.25 8.75C21.25 5.29822 18.4518 2.5 15 2.5C11.5482 2.5 8.75 5.29822 8.75 8.75C8.75 12.2018 11.5482 15 15 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.7374 27.5C25.7374 22.6625 20.9249 18.75 14.9999 18.75C9.07495 18.75 4.26245 22.6625 4.26245 27.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export default UserIcon;
