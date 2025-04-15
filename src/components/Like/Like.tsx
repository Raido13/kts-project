import { FC, HTMLAttributes, MouseEvent } from 'react';
import s from './Like.module.scss';
import LikeIcon from '@shared/components/Icon/LikeIcon';
import Text from '@shared/components/Text';
import { removeExtraEventActions } from '@shared/utils/utils';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@shared/hooks';

interface LikeProps extends HTMLAttributes<HTMLDivElement> {
  cityId: string;
}

export const Like: FC<LikeProps> = observer(({ cityId }) => {
  const { userStore, modalStore, citiesStore, citiesDataStore, toastStore } = useRootStore();
  const { user } = userStore;
  const { openModal } = modalStore;

  const likes = citiesDataStore.citiesLikes[cityId] ?? [];
  const likesCount = likes.length;
  const liked = user ? likes.includes(user.uid) : false;

  const handleToggleLike = async (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);

    if (!user) {
      openModal('sign-in');
      return;
    }

    await citiesStore.toggleLike(cityId, user.uid);
    toastStore.showToast(`Successfully ${!liked ? 'Liked' : 'unLiked'}!`, 'success');
  };

  return (
    <button onClick={handleToggleLike} className={s.like}>
      <LikeIcon height={19} width={22} color={user ? (liked ? 'accent' : 'primary') : 'secondary'} liked={liked} />
      <Text tag={'p'} view={'p-20'} weight={'bold'} color={user ? (liked ? 'accent' : 'primary') : 'secondary'}>
        {likesCount}
      </Text>
    </button>
  );
});
