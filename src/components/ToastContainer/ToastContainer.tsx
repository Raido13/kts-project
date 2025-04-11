import { FC } from 'react';
import s from './ToastContainer.module.scss';
import { useRootStore } from '@shared/hooks';
import { Toast } from '../Toast';
import { observer } from 'mobx-react-lite';

export const ToastContainer: FC = observer(() => {
  const { toastStore } = useRootStore();

  return (
    <div className={s.container}>
      {toastStore.toasts.map(({ id, ...toast }) => (
        <Toast key={id} {...toast} />
      ))}
    </div>
  );
});
