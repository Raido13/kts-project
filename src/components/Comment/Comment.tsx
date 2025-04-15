import { useRootStore } from '@shared/hooks';
import { FC, HTMLAttributes, MouseEvent } from 'react';
import Text from '@shared/components/Text';
import { CommentIcon } from '@shared/components/Icon/CommentIcon/CommentIcon';
import { removeExtraEventActions } from '@shared/utils/utils';
import s from './Comment.module.scss';
import { observer } from 'mobx-react-lite';

interface CommentProps extends HTMLAttributes<HTMLDivElement> {
  cityId: string;
}

export const Comment: FC<CommentProps> = observer(({ cityId }) => {
  const { userStore, modalStore, citiesDataStore } = useRootStore();
  const { openModal } = modalStore;

  const rawCityComments = citiesDataStore.citiesComments[cityId];
  const comments = rawCityComments ? Object.values(rawCityComments).flat() : [];
  const commentsCount = comments.length;
  const commented = userStore.user ? comments.some((comment) => comment.owner === userStore.user!.uid) : false;

  const handleOpenChat = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);

    if (!userStore.user) {
      openModal('sign-in');
      return;
    }

    openModal('comments');
  };

  return (
    <button onClick={handleOpenChat} className={s.comment}>
      <CommentIcon height={24} width={24} color={userStore.user ? (commented ? 'accent' : 'primary') : 'secondary'} />
      <Text
        tag={'p'}
        view={'p-20'}
        weight={'bold'}
        color={userStore.user ? (commented ? 'accent' : 'primary') : 'secondary'}
      >
        {commentsCount}
      </Text>
    </button>
  );
});
