import Icons from '@/components/HomePage/components/Icons';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { limitDevice } from '@/utils/limitDevice';
import { IconMoney, IconProfile } from '@/assets/images/svg/svgToJsx';
import style from './Sidebar.module.scss';
import { LineChartOutlined, RobotOutlined } from '@ant-design/icons';
import { menuItems } from '../Header';
import { useMemo } from 'react';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { PATHNAME_TO_ID } from '@/utils/pagePermission/ability';
import { FEATURE_ID } from '@/config/consts/pagePermission';

const cexUrl = process.env.CEX_LINK;
const dexUrl = process.env.DEX_LINK;

const Item = ({ label, typeCase = '', icon, onClick }) => {
  return (
    <div onClick={onClick} className={style.groupItem}>
      <h1 className={`${typeCase}`}>{label}</h1>
      {icon && <Icons name={icon} />}
    </div>
  );
};

const Section = ({ title, children, border }) => {
  return (
    <div className={`${style.py__16} ${border ? style.borderBLueGray : ''}`}>
      <h1 className={style.text__1}>{title}</h1>
      <div>{children}</div>
    </div>
  );
};

const SideBar = () => {
  const router = useRouter();
  const { id, first_name, last_name, profile_pic } = useSelector(
    (state) => state.userProfile.user
  );
  const merchantInfo = useSelector((state) => state.common.merchantInfo);
  const pageAbility = useAbility(PageAbilityContext);

  const filteredMenuItems = useMemo(() => {
    return !merchantInfo.checkPermission
      ? menuItems
      : menuItems.filter((item) =>
          pageAbility.can(PERMISSION_ACTIONS.VIEW, PATHNAME_TO_ID[item.key])
        );
  }, [merchantInfo, pageAbility]);

  const canIView = (featureId) =>
    !merchantInfo.checkPermission ||
    pageAbility.can(PERMISSION_ACTIONS.VIEW, featureId);

  const redirectPage = (path) => () => {
    router.push(path);
  };

  const handleLogout = () => {
    limitDevice.clearLoginData();
    limitDevice.closeSocket();
    limitDevice.logoutOtherTabs();
    router.push('/');
  };

  return (
    <div className={style.container}>
      <div className={style.box__1}>
        <div onClick={redirectPage('/login')} className={style.group__2}>
          <div className={style.wrapped}>
            <div className={style.main}>
              <Icons name={Icons.names.user} />
            </div>
            <h1>Login</h1>
          </div>
          <Icons name={Icons.names.signout} />
        </div>

        <Section title="Menu" border>
          <div className={style.py__16}>
            {filteredMenuItems.map((item) => (
              <Item
                key={item.key}
                onClick={() => router.push(item.key)}
                label={
                  <div className={style.groupLabelItem}>
                    <span>{item.label}</span>
                  </div>
                }
                icon={Icons.names.link}
              />
            ))}
          </div>
        </Section>
        <Section title="">
          <div className={style.py__16}>
            <Item
              onClick={handleLogout}
              label={
                <div className={style.groupLabelItem}>
                  <span>Logout</span>
                </div>
              }
              typeCase="uppercase"
              icon={Icons.names.signout}
            />
          </div>
        </Section>
      </div>
    </div>
  );
};
export default SideBar;
