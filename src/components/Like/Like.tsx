import { FC, HTMLAttributes, MouseEvent } from 'react';
import s from './Like.module.scss';
import LikeIcon from '@shared/components/Icon/LikeIcon';
import Text from '@shared/components/Text';

interface LikeProps extends HTMLAttributes<HTMLDivElement> {
  likesCount: number;
  liked: boolean;
  handleToggleLike: (e: MouseEvent<HTMLButtonElement>) => void;
  isLoggedIn: boolean;
  isLikeLoading: boolean;
}

export const Like: FC<LikeProps> = ({ likesCount, liked, isLoggedIn, handleToggleLike, isLikeLoading }) => (
  <button onClick={handleToggleLike} className={s.like} disabled={isLikeLoading}>
    <LikeIcon height={19} width={22} color={isLoggedIn ? (liked ? 'accent' : 'primary') : 'secondary'} liked={liked} />
    <Text tag={'p'} view={'p-20'} weight={'bold'} color={isLoggedIn ? (liked ? 'accent' : 'primary') : 'secondary'}>
      {likesCount}
    </Text>
  </button>
);
