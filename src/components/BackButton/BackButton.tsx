import { FC, HTMLAttributes, ReactNode } from 'react';
import Text from '@shared/components/Text';
import ArrowPaginationIcon from '@shared/components/Icon/ArrowPaginationIcon';
import { useNavigate } from 'react-router-dom';
import s from './BackButton.module.scss';
import cn from 'classnames';

interface BackButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const BackButton: FC<BackButtonProps> = ({ children, className, ...props }) => {
  const navigate = useNavigate();

  return (
    <button className={cn(s.button, className)} onClick={() => navigate(-1)} {...props}>
      <ArrowPaginationIcon width={35} height={35} color={'primary'} />
      <Text tag={'p'} view={'p-18'}>
        {children}
      </Text>
    </button>
  );
};
