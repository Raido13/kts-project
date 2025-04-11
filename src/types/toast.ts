export type ToastType = {
  id: number;
  message: string;
  variant: ToastVariant;
  onClose: () => void;
  duration?: number;
  showAnimation?: ToastAnimationType;
  className?: string;
};

export type ToastVariant = 'error' | 'success';
export type ToastAnimationType = 'left' | 'right';
