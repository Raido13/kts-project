import { FC, HTMLAttributes, MouseEvent } from 'react';
import s from './Like.module.scss';
import LikeIcon from '@shared/components/Icon/LikeIcon';
import Text from '@shared/components/Text';
import { observer } from 'mobx-react-lite';

interface LikeProps extends HTMLAttributes<HTMLDivElement> {
  likesCount: number;
  liked: boolean;
  handleToggleLike: (e: MouseEvent<HTMLButtonElement>) => void;
  isLoggedIn: boolean;
}

export const Like: FC<LikeProps> = observer(({ likesCount, liked, isLoggedIn, handleToggleLike }) => (
  <button onClick={handleToggleLike} className={s.like}>
    <LikeIcon height={19} width={22} color={isLoggedIn ? (liked ? 'accent' : 'primary') : 'secondary'} liked={liked} />
    <Text tag={'p'} view={'p-20'} weight={'bold'} color={isLoggedIn ? (liked ? 'accent' : 'primary') : 'secondary'}>
      {likesCount}
    </Text>
  </button>
));
