import { FC, HTMLAttributes, MouseEvent } from 'react';
import s from './Like.module.scss';
import LikeIcon from '../Icon/LikeIcon';
import Text from '../Text';
import { useCitiesContext, useModalContext, useUserContext } from '@shared/lib/hooks';
import { removeExtraEventActions } from '@shared/lib/utils/utils';

interface LikeProps extends HTMLAttributes<HTMLDivElement> {
  cardId: string;
}

export const Like: FC<LikeProps> = ({ cardId }) => {
  const { user } = useUserContext();
  const { citiesLikes, toggleLike } = useCitiesContext();
  const { openModal } = useModalContext();

  const likes = citiesLikes[cardId] ?? [];
  const likesCount = likes.length;
  const liked = user ? likes.includes(user.uid) : false;

  const handleToggleLike = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);

    if (!user) {
      openModal('sign-in');
      return;
    }

    toggleLike(cardId, user.uid);
  };

  return (
    <button onClick={handleToggleLike} className={s.like}>
      <LikeIcon height={19} width={22} color={user ? (liked ? 'accent' : 'primary') : 'secondary'} liked={liked} />
      <Text tag={'p'} view={'p-20'} weight={'bold'} color={user ? (liked ? 'accent' : 'primary') : 'secondary'}>
        {likesCount}
      </Text>
    </button>
  );
};
