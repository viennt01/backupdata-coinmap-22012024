import { ReactElement, ReactPortal, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { BOT } from '@/components/common/bot-list/interface';
import AppModal from '@/components/modal';
import {
  Expired,
  InsufficientBalance,
  RemoveAccount,
  InsufficientAccount,
  MaxDrawdownWarning,
} from '@/components/common/bot-list/components/modal-notification';

interface ModalNotify {
  expired: (botsExpired: BOT[]) => void;
  insufficientBalance: () => void;
  removeAccount: () => void;
  insufficientAccount: (minBalance?: number) => void;
  maxDrawdownWarning: () => void;
}

const useModalNotification: () => [ModalNotify, () => ReactPortal] = () => {
  const [modals, setModals] = useState<ReactElement[]>([]);
  const modalRef = useRef<{ [key: string]: ReactElement }>({});

  const pushToStack = (key: string, modal: ReactElement) => {
    modalRef.current[key] = modal;
    setModals(Object.values(modalRef.current));
  };

  const popOutStack = (key: string) => {
    delete modalRef.current[key];
    setModals(Object.values(modalRef.current));
  };

  const modalNotify: ModalNotify = {
    expired: (botsExpired) => {
      pushToStack(
        'expired',
        <AppModal open close={() => popOutStack('expired')}>
          <Expired botsExpired={botsExpired} />
        </AppModal>
      );
    },
    insufficientBalance: () => {
      pushToStack(
        'insufficientBalance',
        <AppModal open close={() => popOutStack('insufficientBalance')}>
          <InsufficientBalance />
        </AppModal>
      );
    },
    removeAccount: () => {
      pushToStack(
        'removeAccount',
        <AppModal open close={() => popOutStack('removeAccount')}>
          <RemoveAccount />
        </AppModal>
      );
    },
    insufficientAccount: (minBalance) => {
      pushToStack(
        'insufficientAccount',
        <AppModal open close={() => popOutStack('insufficientAccount')}>
          <InsufficientAccount minBalance={minBalance} />
        </AppModal>
      );
    },
    maxDrawdownWarning: () => {
      pushToStack(
        'maxDrawdownWarning',
        <AppModal open close={() => popOutStack('maxDrawdownWarning')}>
          <MaxDrawdownWarning />
        </AppModal>
      );
    },
  };

  const renderModalNotification = () => {
    return ReactDOM.createPortal(modals, document.body);
  };

  return [modalNotify, renderModalNotification];
};

export default useModalNotification;
