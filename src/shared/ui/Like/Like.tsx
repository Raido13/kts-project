import { FC, HTMLAttributes } from 'react';
import s from './Like.module.scss';
import LikeIcon from '../Icon/LikeIcon';
import Text from '../Text';
import { useCitiesContext, useUserContext } from '@shared/lib/hooks';

interface LikeProps extends HTMLAttributes<HTMLDivElement> {
  cardId: string;
}

export const Like: FC<LikeProps> = ({ cardId }) => {
  const { user } = useUserContext();
  const { citiesLikes, toggleLike } = useCitiesContext();

  if (!user) return null;

  const likes = citiesLikes[cardId] ?? [];
  const likesCount = likes.length;
  const liked = likes.includes(user.uid);

  return (
    <button onClick={() => toggleLike(cardId, user.uid)} className={s.like}>
      <LikeIcon height={19} width={22} color={liked ? 'accent' : 'primary'} liked={liked} />
      <Text tag={'p'} view={'p-20'} weight={'bold'} color={liked ? 'accent' : 'primary'}>
        {likesCount}
      </Text>
    </button>
  );
};
