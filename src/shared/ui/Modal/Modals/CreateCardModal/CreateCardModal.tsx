import { HTMLAttributes, FC, useState } from 'react';
import Text from '@shared/ui/Text';
import Input from '@shared/ui/Input';
import Button from '@shared/ui/Button';
import s from './CreateCardModal.module.scss';
import CheckBox from '@shared/ui/CheckBox';

interface CardFormState {
  name: string;
  country: string;
  population: string;
  image: string;
  is_capital: boolean;
}

export const CreateCardModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [card, setCard] = useState<CardFormState>({
    name: '',
    country: '',
    population: '',
    image: '',
    is_capital: false,
  });

  const handleChange = (key: keyof CardFormState, value: string | boolean | number) => {
    setCard((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'}>
        Create City card
      </Text>
      <div className={s.modal__field}>
        <Text view={'p-14'} tag={'p'}>
          Enter city name
        </Text>
        <Input value={card.name} type={'text'} onChange={(value) => handleChange('name', value)} />
      </div>
      <div className={s.modal__field}>
        <Text view={'p-14'} tag={'p'}>
          Enter city country
        </Text>
        <Input value={card.country} type={'text'} onChange={(value) => handleChange('country', value)} />
      </div>
      <div className={s.modal__field}>
        <Text view={'p-14'} tag={'p'}>
          Enter population
        </Text>
        <Input value={card.population} type={'text'} onChange={(value) => handleChange('population', value)} />
      </div>
      <div className={s.modal__field}>
        <Text view={'p-14'} tag={'p'}>
          Enter image
        </Text>
        <Input value={card.image} type={'text'} onChange={(value) => handleChange('image', value)} />
      </div>
      <div className={s.modal__field}>
        <Text view={'p-14'} tag={'p'}>
          Is it Capital
        </Text>
        <CheckBox checked={card.is_capital} onChange={(checked) => handleChange('is_capital', checked)} />
      </div>
      <div className={s.modal__action}>
        <Button>Create</Button>
      </div>
    </div>
  );
};
