import { FALLBACK_IMG } from '@/constant/common';
import style from './get-url-tours.module.scss';
import { Spin, Tour, TourProps, Image } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
  target: HTMLElement;
}

const GetUrlTours = ({ open, target, onClose }: Props) => {
  const tourSteps: TourProps['steps'] = [
    {
      title: 'How to get verification URL?',
      description: 'Open the confirmation mail',
      cover: (
        <Image
          rootClassName={style.tourCover}
          src="images/verification-mail.png"
          alt="verification-mail"
          fallback={FALLBACK_IMG}
          placeholder={<Spin />}
        />
      ),
      target,
    },
    {
      title: 'How to get verification URL?',
      description: 'Click to "Verify Single Sender" button',
      cover: (
        <Image
          rootClassName={style.tourCover}
          src="images/verification-verify-button.png"
          alt="verification-verify-button"
          fallback={FALLBACK_IMG}
          placeholder={<Spin />}
        />
      ),
      target,
    },
    {
      title: 'How to get verification URL?',
      description: 'Copy the verification URL in new tab',
      cover: (
        <Image
          rootClassName={style.tourCover}
          src="images/verification-url.png"
          alt="verification-url"
          fallback={FALLBACK_IMG}
          placeholder={<Spin />}
        />
      ),
      target,
    },
  ];
  return <Tour open={open} onClose={onClose} steps={tourSteps} />;
};

export default GetUrlTours;
