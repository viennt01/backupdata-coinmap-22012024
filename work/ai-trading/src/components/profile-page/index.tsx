import style from './index.module.scss';
import { headers } from '@/fetcher/utils';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { ACTION_UPLOAD, updateUserProFile } from './fetcher';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  message,
  Upload,
  Menu,
  notification,
  Image,
  UploadProps,
  MenuProps,
  ConfigProvider,
} from 'antd';
import { AppContext } from '@/app-context';
import { useRouter } from 'next/router';
import { ERROR_CODE } from '@/constants/error-code';
import { SvgUserProfile, SvgLayers, SvgCreditCard } from '@/assets/images/svg';
import { PROFILE_TABS } from '@/constants/router';
import MyProfile from './components/my-profile';
import MyPlan from './components/my-plan';
import MyPayment from './components/my-payment';
import useI18n from '@/i18n/useI18N';

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

function getItem(
  label: string | ReactElement,
  key: string,
  icon?: ReactElement,
  children?: ReactElement,
  type?: string
) {
  return {
    key,
    icon: null,
    children,
    label: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {icon} {label}
      </div>
    ),
    type,
  };
}

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [activatedTab, setActivatedTab] = useState(PROFILE_TABS.PROFILE);
  const router = useRouter();
  const [apiNotification, contextHolder] = notification.useNotification();

  const { userInfo, setUserInfo } = useContext(AppContext);
  const { translate } = useI18n();
  const { translate: translateHeader } = useI18n('header');

  useEffect(() => {
    const { tab } = router.query;
    if (tab) {
      setActivatedTab(tab as PROFILE_TABS);
    }
  }, [router.query]);

  const items = useMemo(
    () => [
      getItem(
        translateHeader('profile') || '',
        PROFILE_TABS.PROFILE,
        <SvgUserProfile />
      ),
      getItem(translateHeader('plan') || '', PROFILE_TABS.PLAN, <SvgLayers />),
      getItem(
        translateHeader('payment') || '',
        PROFILE_TABS.PAYMENT,
        <SvgCreditCard />
      ),
    ],
    [translateHeader]
  );

  const handleUploadAvatar: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      const { response } = info.file;
      if (response.error_code !== ERROR_CODE.SUCCESS) return;
      const data = {
        profile_pic: response.payload.file_url,
      };
      updateUserProFile(data)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            apiNotification.success({
              message: '',
              description: 'Update successfully',
            });
            if (setUserInfo) setUserInfo({ ...userInfo, ...res.payload });
          }
        })
        .catch((err: Error) => {
          apiNotification.error({
            message: '',
            description: JSON.parse(err.message).message,
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const handleChangeTab: MenuProps['onClick'] = (e) => {
    setActivatedTab(e.key as PROFILE_TABS);
    router.replace(`/profile?tab=${e.key}`);
  };

  const uploadHeaders = { ...headers.headers } as UploadProps['headers'];
  delete uploadHeaders?.['content-type'];

  if (!userInfo) return null;

  return (
    <div className={style.pageWrapper}>
      <div className="container">
        <div className={style.page}>
          {contextHolder}
          <div className={style.leftContainer}>
            <div className={style.leftContentContainer}>
              <div className={style.avatarContainer}>
                <Upload
                  disabled={loading}
                  name="file"
                  listType="picture-card"
                  maxCount={1}
                  headers={uploadHeaders}
                  action={ACTION_UPLOAD}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadAvatar}
                >
                  {userInfo.profile_pic ? (
                    <Image
                      src={userInfo.profile_pic}
                      alt="avatar"
                      preview={false}
                    />
                  ) : (
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  )}
                </Upload>
                <div className={style.email}>{userInfo.email}</div>
              </div>
              <div className={style.navigatorContainerMobile}>
                <Menu
                  onClick={handleChangeTab}
                  mode="horizontal"
                  selectedKeys={[activatedTab]}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                  }}
                  items={items}
                  theme="dark"
                  triggerSubMenuAction="click"
                />
              </div>
              <div className={style.navigatorContainerDesktop}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimaryBg: 'transparent',
                    },
                  }}
                >
                  <Menu
                    onClick={handleChangeTab}
                    mode="inline"
                    selectedKeys={[activatedTab]}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                    }}
                    items={items}
                  />
                </ConfigProvider>
              </div>
            </div>
          </div>
          <div className={style.rightContainer}>
            {activatedTab === PROFILE_TABS.PROFILE && (
              <>
                <div
                  className={[
                    style.rightContentContainer,
                    style.myProfileTab,
                  ].join(' ')}
                >
                  <MyProfile />
                </div>
                <div className={style.policy}>
                  <div>{translate('disclaimer')}</div>
                </div>
              </>
            )}
            {activatedTab === PROFILE_TABS.PLAN && (
              <>
                <div className={style.rightContentContainer}>
                  <MyPlan />
                </div>
              </>
            )}
            {activatedTab === PROFILE_TABS.PAYMENT && (
              <>
                <div className={style.rightContentContainer}>
                  <MyPayment />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
