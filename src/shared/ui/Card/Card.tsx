import React from 'react';
import cn from 'classnames';
import Text from '../Text';
import s from './Card.module.scss';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL изображения */
  image: string;
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

const getTextFromReactNode = (node: React.ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextFromReactNode(node.props.children);
  }

  return '';
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  const imageText = getTextFromReactNode(title);

  return (
    <div onClick={onClick} className={cn(s.card, className)}>
      <img src={image} alt={imageText} className={s.card__image} />
      <div className={s.card__body}>
        <div className={s['card__body-top']}>
          {captionSlot && (
            <Text view={'p-14'} color={'secondary'}>
              {captionSlot}
            </Text>
          )}
          <Text weight={'bold'} maxLines={2}>
            {title}
          </Text>
          <Text view={'p-16'} color={'secondary'} maxLines={3}>
            {subtitle}
          </Text>
        </div>
        <div className={s['card__body-bottom']}>
          {contentSlot && (
            <Text view={'p-18'} weight={'bold'} className={s.card__price}>
              {contentSlot}
            </Text>
          )}
          {actionSlot}
        </div>
      </div>
    </div>
  );
};

export default Card;
