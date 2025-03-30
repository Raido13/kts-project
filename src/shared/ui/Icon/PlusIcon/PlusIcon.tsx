import * as React from 'react';
import Icon, { IconProps } from '../Icon';

const PlusIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox={'0 0 18 18'} {...props}>
    <path d="M9 0C8.28992 0 7.71429 0.575634 7.71429 1.28571V7.71429H1.28572C0.575634 7.71429 0 8.28992 0 9C0 9.71008 0.575634 10.2857 1.28572 10.2857H7.71429V16.7143C7.71429 17.4244 8.28992 18 9 18C9.71008 18 10.2857 17.4244 10.2857 16.7143V10.2857H16.7143C17.4244 10.2857 18 9.71008 18 9C18 8.28992 17.4244 7.71429 16.7143 7.71429H10.2857V1.28571C10.2857 0.575634 9.71008 0 9 0Z"  fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
  </Icon>
);

export default PlusIcon;
