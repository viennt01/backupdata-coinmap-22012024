import style from './style.module.scss';
import { LOCAL_CACHE_KEYS } from '@/config';
import { ERROR_CODE, headers, headersUploadFromData } from '@/fetcher/utils';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserProfile } from '../LoginPage/fetcher';
import { ACTION_UPLOAD, updateProFile } from './fetcher';
import { API_MESSSAGE } from '@/constant/messsage';
import {
  setUserProfile,
  setUserInfo as setUserInfoAction,
} from '@/redux/actions/userProfile';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Menu } from 'antd';
import {
  UserOutlined,
  CreditCardOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';

import MyProfile from './components/my-profile';
import MyPlans from './components/my-plans';
import MyPayments from './components/my-payments';
import { useRouter } from 'next/router';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';

const beforeUpload = (file) => {
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

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('My profile', '1', <UserOutlined />),
  getItem('My plan', '2', <ScheduleOutlined />),
  getItem('My payment', '3', <CreditCardOutlined />),
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [activatedTab, setActivatedTab] = useState('1');
  const [changePassword, setChangePassword] = useState(false);
  const [userInfoRedux] = useSelector((state) => [state.userProfile.user]);
  const router = useRouter();
  const [openNotification, contextHolder] = useNotification();

  useEffect(() => {
    const { tab } = router.query;
    if (tab) {
      setActivatedTab(tab);
    }
  }, [router.query]);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_CACHE_KEYS.CM_TOKEN);
    headersUploadFromData.setToken(token);
    headers.setToken(token);
    getUserProfile()
      .then((data) => {
        if (data.error_code !== ERROR_CODE.SUCCESS) return;
        dispatch(setUserProfile(data.payload));
        const userInfo = {
          profile_pic: data.payload.profile_pic,
          first_name: data.payload.first_name,
          last_name: data.payload.last_name,
          country: data.payload.country,
          year_of_birth:
            data.payload.year_of_birth &&
            data.payload.year_of_birth !== 'Invalid Date'
              ? dayjs(data.payload.year_of_birth, 'YYYY')
              : '',
          gender: data.payload.gender,
          phone_code: data.payload.phone_code,
          phone: data.payload.phone,
          email: data.payload.email,
        };
        setUserInfo(userInfo);
        setLoading(false);
      })
      .catch((err) => {
        openNotification({
          type: NOTIFICATION_TYPE.ERROR,
          message: '',
          description: JSON.parse(err.message).message,
        });
      });
  }, []);

  const onSubmit = (formValues) => {
    const data = {
      ...formValues,
      year_of_birth: formValues['year_of_birth'].format('YYYY'),
    };
    updateProFile(data)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          openNotification({
            type: NOTIFICATION_TYPE.SUCCESS,
            message: '',
            description: API_MESSSAGE.UPDATE_PROFILE.SUCCESS,
          });
          setChangePassword(false);
          const { first_name, last_name } = res.payload;
          dispatch(setUserInfoAction({ first_name, last_name }));
        }
      })
      .catch((err) => {
        openNotification({
          type: NOTIFICATION_TYPE.ERROR,
          message: '',
          description: JSON.parse(err.message).message,
        });
      });
  };

  const handleChange = (info) => {
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
      updateProFile(data)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            openNotification({
              type: NOTIFICATION_TYPE.SUCCESS,
              message: '',
              description: API_MESSSAGE.UPDATE_PROFILE.SUCCESS,
            });

            const { profile_pic } = res.payload;
            dispatch(setUserInfoAction({ profile_pic }));
          }
        })
        .catch((err) => {
          openNotification({
            type: NOTIFICATION_TYPE.ERROR,
            message: '',
            description: JSON.parse(err.message).message,
          });
        });
    }
  };
  const uploadButton = (
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
  );
  const onClick = (e) => {
    setActivatedTab(e.key);
    router.replace(`/profile?tab=${e.key}`);
  };

  return (
    <div className={style.page}>
      {contextHolder}
      <div className={style.leftContainer}>
        <div className={style.leftContentContainer}>
          <div className={style.avatarContainer}>
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              headers={headersUploadFromData.headers}
              action={ACTION_UPLOAD}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {userInfoRedux.profile_pic ? (
                <img src={userInfoRedux.profile_pic} alt="avatar" />
              ) : (
                uploadButton
              )}
            </Upload>
            <div className={style.welcome}>
              Welcome, {userInfoRedux.first_name} {userInfoRedux.last_name}
            </div>
          </div>
          <div className={style.navigatorContainerMobile}>
            <Menu
              onClick={onClick}
              mode="horizontal"
              selectedKeys={[activatedTab]}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
              }}
              items={items}
            />
          </div>
          <div className={style.navigatorContainerDesktop}>
            <Menu
              onClick={onClick}
              mode="inline"
              selectedKeys={[activatedTab]}
              style={{
                width: 255,
                backgroundColor: 'transparent',
                color: 'white',
              }}
              items={items}
            />
          </div>
        </div>
      </div>
      <div className={style.rightContainer}>
        {activatedTab === '1' && (
          <>
            <div
              className={[style.rightContentContainer, style.myProfileTab].join(
                ' '
              )}
            >
              <MyProfile
                userInfo={userInfo}
                onSubmit={onSubmit}
                changePassword={changePassword}
                setChangePassword={setChangePassword}
                loading={loading}
              />
            </div>
            <div className={style.policy}>
              <div>
                We will not, in any circumstances, share your personal
                information with other individuals or organizations without your
                permission, including public organizations, corporations or
                individuals, except when applicable by law.
              </div>
            </div>
          </>
        )}
        {activatedTab === '2' && (
          <>
            <div className={style.rightContentContainer}>
              <MyPlans />
            </div>
          </>
        )}
        {activatedTab === '3' && (
          <>
            <div className={style.rightContentContainer}>
              <MyPayments />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
