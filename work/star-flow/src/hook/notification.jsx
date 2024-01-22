import { notification } from 'antd';

const key = 'cextrading';
export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warning',
};

export default function useNotification() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({ type, message, description }) => {
    api.open({
      key,
      type,
      message,
      description,
    });
  };

  return [openNotification, contextHolder];
}

export function openNotification({ type, message, description }) {
  notification.open({
    type,
    message: message,
    description,
    style: {
      backgroundColor: '#1D1C32',
      color: '#FFFFFF',
    },
  });
}
