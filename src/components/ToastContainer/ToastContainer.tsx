import { FC } from 'react';
import s from './ToastContainer.module.scss';
import { useRootStore } from '@shared/hooks';
import { Toast } from '@shared/components/Toast';
import { observer } from 'mobx-react-lite';

export const ToastContainer: FC = observer(() => {
  const rootStore = useRootStore();
  const toasts = rootStore.toastStore.toasts;

  return (
    <div className={s.container}>
      {toasts.map(({ id, ...toast }) => (
        <Toast key={id} {...toast} />
      ))}
    </div>
  );
});
