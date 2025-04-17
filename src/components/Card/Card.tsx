import React, { MouseEvent } from 'react';
import cn from 'classnames';
import Text from '@shared/components/Text';
import s from './Card.module.scss';
import { CityVariant } from '@shared/types/city';
import { getTextFromReactNode } from '@shared/utils';
import Button from '@shared/components/Button';
import { Image } from '@shared/components/Image';
import { Like } from '@shared/components/Like';
import { Comment } from '@shared/components/Comment';
import { useRootStore } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';
import { observer } from 'mobx-react-lite';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** Вариант отображения */
  variant?: CityVariant;
  /** Id карточки */
  cityId: string;
  /** URL изображения */
  image?: string;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
  /** Лоадер скелетона */
  isLoading?: boolean;
  /** Температура в цельсии */
  temp?: string;
  /** Время в городе */
  localTime?: string;
};

const Card: React.FC<CardProps> = observer(
  ({
    className,
    variant = 'preview',
    cityId,
    image,
    captionSlot,
    title,
    subtitle,
    contentSlot,
    onClick,
    actionSlot,
    isLoading = false,
    temp,
    localTime,
  }) => {
    const rootStore = useRootStore();
    const {
      modalStore: { openModal },
      citiesStore: { toggleLike },
      toastStore: { showToast },
    } = rootStore;
    const user = rootStore.userStore.user;
    const citiesLikes = rootStore.citiesDataStore.citiesLikes;
    const citiesComments = rootStore.citiesDataStore.citiesComments;

    const isLoggedIn = !!user;

    const likes = citiesLikes[cityId] ?? [];
    const likesCount = likes.length;
    const liked = isLoggedIn ? likes.includes(user.uid) : false;

    const handleToggleLike = async (e: MouseEvent<HTMLButtonElement>) => {
      removeExtraEventActions(e);

      if (!isLoggedIn) {
        openModal('sign-in');
        return;
      }

      await toggleLike(cityId, user.uid);
      showToast(`Successfully ${!liked ? 'Liked' : 'unLiked'}!`, 'success');
    };

    const rawCityComments = citiesComments[cityId];
    const comments = rawCityComments ? Object.values(rawCityComments).flat() : [];
    const commentsCount = comments.length;
    const commented = isLoggedIn ? comments.some((comment) => comment.owner === user!.uid) : false;

    const imageText = getTextFromReactNode(title);
    const isPreview = variant === 'preview';

    const handleOpenChat = (e: MouseEvent<HTMLButtonElement>) => {
      removeExtraEventActions(e);

      if (!isLoggedIn) {
        openModal('sign-in');
        return;
      }

      openModal('comments');
    };

    return (
      <div onClick={onClick} className={cn(s.card, { [s.card_single]: !isPreview }, className)}>
        <Image isLoading={isLoading} src={isLoading ? undefined : image} alt={imageText} variant={variant} />
        <div className={s.card__body}>
          <div className={s['card__body-top']}>
            {isLoading ||
              (isPreview && (
                <Text isLoading={isLoading} view={'p-14'} color={'secondary'}>
                  {captionSlot}
                </Text>
              ))}
            <Text isLoading={isLoading} view={isPreview ? 'p-20' : 'title'} weight={'bold'} maxLines={2}>
              {title}
            </Text>
            <Text isLoading={isLoading} view={isPreview ? 'p-16' : 'p-20'} color={'secondary'} maxLines={3}>
              {subtitle}
            </Text>
            <Like likesCount={likesCount} liked={liked} handleToggleLike={handleToggleLike} isLoggedIn={isLoggedIn} />
            {!isPreview && (
              <Comment
                commentsCount={commentsCount}
                commented={commented}
                handleOpenChat={handleOpenChat}
                isLoggedIn={isLoggedIn}
              />
            )}
            {(temp || localTime) && (
              <div className={s.card__info}>
                {temp && (
                  <Text isLoading={isLoading} view={'p-18'} weight={'bold'}>
                    {temp}
                  </Text>
                )}
                {localTime && (
                  <Text isLoading={isLoading} view={'p-18'} weight={'bold'}>
                    {localTime}
                  </Text>
                )}
              </div>
            )}
          </div>
          <div className={s['card__body-bottom']}>
            {isPreview && (
              <Text isLoading={isLoading} view={isPreview ? 'p-18' : 'title'} weight={'bold'} className={s.card__price}>
                {contentSlot}
              </Text>
            )}
            <div className={s.card__actions}>
              {actionSlot}
              {!isPreview && (
                <Button className={s.card__button} isLoading={isLoading}>
                  More info
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Card;
