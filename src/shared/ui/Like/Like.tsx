import { FC, HTMLAttributes } from 'react';
import s from './Like.module.scss';
import LikeIcon from '../Icon/LikeIcon';
import Text from '../Text';

interface LikeProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
  liked: boolean;
}

export const Like: FC<LikeProps> = ({ count, liked }) => (
  <button className={s.like}>
    <LikeIcon height={19} width={22} color={liked ? 'accent' : 'primary'} liked={liked} />
    <Text tag={'p'} view={'p-20'} weight={'bold'} color={liked ? 'accent' : 'primary'}>
      {count}
    </Text>
  </button>
);
