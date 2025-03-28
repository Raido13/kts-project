import React from 'react';
import cn from 'classnames';
import Text from '../Text';
import s from './Card.module.scss';
import { cardVariant } from '@shared/lib/types/card';
import { getTextFromReactNode } from '@shared/lib/utils';
import Button from '../Button';
import { imageMock } from '@shared/lib/mock/cities';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** Вариант отображения */
  variant?: cardVariant;
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
};

const Card: React.FC<CardProps> = ({
  className,
  variant = 'preview',
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  const imageText = getTextFromReactNode(title);
  const isPreview = variant === 'preview';

  return (
    <div onClick={onClick} className={cn(s.card, { [s['card--single']]: variant === 'single' }, className)}>
      <img src={image ?? imageMock} alt={imageText} className={s.card__image} />
      <div className={s.card__body}>
        <div className={s['card__body-top']}>
          {!isPreview && captionSlot && (
            <Text view={'p-14'} color={'secondary'}>
              {captionSlot}
            </Text>
          )}
          <Text view={isPreview ? 'p-20' : 'title'} weight={'bold'} maxLines={2}>
            {title}
          </Text>
          <Text view={isPreview ? 'p-16' : 'p-20'} color={'secondary'} maxLines={3}>
            {subtitle}
          </Text>
        </div>
        <div className={s['card__body-bottom']}>
          {contentSlot && (
            <Text view={isPreview ? 'p-18' : 'title'} weight={'bold'} className={s.card__price}>
              {contentSlot}
            </Text>
          )}
          <div className={s.card__actions}>
            {actionSlot}
            {!isPreview && <Button className={s.card__button}>More info</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
