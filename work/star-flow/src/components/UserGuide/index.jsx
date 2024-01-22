import style from './index.module.scss';
import { SVGCloseCircle } from '@/assets/images/svg';

const userGuideLink = process.env.USER_GUIDE_LINK;

export default function UserGuide({
  openUserGuide,
  setOpenUserGuide,
  userInfo,
}) {
  const handleClickUserGuide = () => {
    if (userGuideLink) {
      window.open(userGuideLink);
    }
  };

  if (!openUserGuide || !userInfo.id || !userGuideLink) return null;
  return (
    <div className={style.userGuideBtnContainer}>
      <SVGCloseCircle
        onClick={() => setOpenUserGuide(false)}
        className={style.iconClose}
      />
      <div onClick={handleClickUserGuide} className={style.userGuideBtn}>
        User guide
      </div>
    </div>
  );
}
