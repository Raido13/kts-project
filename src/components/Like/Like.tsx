import { FC, HTMLAttributes, MouseEvent } from 'react';
import s from './Like.module.scss';
import LikeIcon from '@shared/components/Icon/LikeIcon';
import Text from '@shared/components/Text';
import { useCitiesContext, useModalContext, useUserContext } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';

interface LikeProps extends HTMLAttributes<HTMLDivElement> {
  cityId: string;
}

export const Like: FC<LikeProps> = ({ cityId }) => {
  const { user } = useUserContext();
  const { citiesLikes, toggleLike } = useCitiesContext();
  const { openModal } = useModalContext();

  const likes = citiesLikes[cityId] ?? [];
  const likesCount = likes.length;
  const liked = user ? likes.includes(user.uid) : false;

  const handleToggleLike = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);

    if (!user) {
      openModal('sign-in');
      return;
    }

    toggleLike(cityId, user.uid);
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
