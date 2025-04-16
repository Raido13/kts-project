import { FC, HTMLAttributes, MouseEvent } from 'react';
import Text from '@shared/components/Text';
import { CommentIcon } from '@shared/components/Icon/CommentIcon/CommentIcon';
import s from './Comment.module.scss';

interface CommentProps extends HTMLAttributes<HTMLDivElement> {
  commentsCount: number;
  commented: boolean;
  handleOpenChat: (e: MouseEvent<HTMLButtonElement>) => void;
  isLoggedIn: boolean;
}

export const Comment: FC<CommentProps> = ({ commentsCount, commented, handleOpenChat, isLoggedIn }) => (
  <button onClick={handleOpenChat} className={s.comment}>
    <CommentIcon height={24} width={24} color={isLoggedIn ? (commented ? 'accent' : 'primary') : 'secondary'} />
    <Text tag={'p'} view={'p-20'} weight={'bold'} color={isLoggedIn ? (commented ? 'accent' : 'primary') : 'secondary'}>
      {commentsCount}
    </Text>
  </button>
);
