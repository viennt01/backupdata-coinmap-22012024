import { PRIVACY_POLICY_LINK, TERM_CONDITION_LINK } from '@/constants/axi-link';
import { ERROR_CODE } from '@/constants/error-code';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@/constants/message';
import {
  Form,
  Input,
  ConfigProvider,
  Select,
  notification,
  Row,
  Col,
  InputRef,
  Button,
  Space,
  Tooltip,
} from 'antd';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  connectBroker,
  getBrokerSettings,
  selectAndConnectBroker,
  uploadProfile,
} from '../../fetcher';
import { Broker, ConnectBroker } from '../../interface';
import style from './index.module.scss';
import { CONNECT_BROKER_TYPES } from '@/constants/common';
import CustomButton from '@/components/common/custom-button';
import { BOT } from '@/components/common/bot-list/interface';
import { AppContext } from '@/app-context';
import { getThemeForm } from '@/utils/theme';
import useI18n from '@/i18n/useI18N';
import useLocale from '@/hook/use-locale';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import AppModal from '@/components/modal';

const PLATFORMS = {
  MT4: 'mt4',
  MT5: 'mt5',
};

const INITIAL_VALUE = {
  broker_code: null,
  broker_server: null,
  account_id: '',
  password: '',
};

const GUIDE_VIDEO = {
  MT4: {
    title: 'How to get MT4 profile?',
    videoId: '1fTcbyyKE3Tl9gXnwsFDI7IdGsCqNlzQN',
  },
  MT5: {
    title: 'How to get MT5 profile?',
    videoId: '1Cy1VKzbhXG_fCJs9DEU3haiYPvTzlRRk',
  },
};

const generateVideoSrc = (videoId: string) => {
  return `https://drive.google.com/uc?export=download&id=${videoId}`;
};

const connectBrokerHandlers = {
  [CONNECT_BROKER_TYPES.CONNECT]: connectBroker,
  [CONNECT_BROKER_TYPES.SELECT_AND_CONNECT]: selectAndConnectBroker,
};

interface Props {
  botSelected: BOT;
  connectType: CONNECT_BROKER_TYPES;
  onConnected?: () => void;
}

export default function ConnectBrokerForm({
  botSelected,
  connectType,
  onConnected,
}: Props) {
  const locale = useLocale();

  const [loading, setLoading] = useState<boolean>(false);
  const { translate: translateForm } = useI18n('form');
  const { translate: translateConnectBroker } = useI18n('connect-broker');
  const [registerLink, setRegisterLink] = useState('');
  const [form] = Form.useForm<ConnectBroker>();
  const [apiNotification, contextHolder] = notification.useNotification();
  const { appTheme, merchantInfo } = useContext(AppContext);
  const [brokerSettings, setBrokerSettings] = useState<Broker[]>([]);
  const [requireProfile, setRequireProfile] = useState(false);
  const [showGuideVideo, setShowGuideVideo] = useState(false);
  const profileRef = useRef<InputRef>(null);
  const videoGuideRef = useRef(GUIDE_VIDEO.MT4);

  const brokerCode = Form.useWatch('broker_code', form);
  const translation = botSelected.translation[locale];

  const [workBaseOn] = useMemo(() => {
    if (translation) {
      return [translation.work_based_on];
    }
    return [botSelected.work_based_on];
  }, [translation, botSelected]);

  const serverOptions = useMemo(() => {
    const selectedBroker = brokerSettings.find(
      (item) => item.code === brokerCode
    );
    const brokerServers = selectedBroker?.servers ?? [];
    return brokerServers.map((server) => ({ label: server, value: server }));
  }, [brokerSettings, brokerCode]);

  const brokerOptions = useMemo(() => {
    const brokers =
      merchantInfo?.config?.brokers?.filter((b) => b.selected) ?? [];
    return brokers.map((b) => ({
      value: b.code,
      label: b.name,
    }));
  }, [merchantInfo]);

  const fetchBrokerSettings = () => {
    getBrokerSettings()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const brokerSetting = JSON.parse(res.payload.value);
          setBrokerSettings(Object.values(brokerSetting));
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleChangeBroker = useCallback(
    (brokerCode?: string) => {
      form.setFieldValue('broker_server', null);
      const selectedBroker = merchantInfo?.config?.brokers?.find(
        (b) => b.code === brokerCode
      );
      const selectedBrokerSetting = brokerSettings.find(
        (b) => b.code === brokerCode
      );
      setRegisterLink(selectedBroker?.referral_setting?.promotion_ref ?? '');
      setRequireProfile(selectedBrokerSetting?.required_profile ?? false);
    },
    [merchantInfo, form, brokerSettings]
  );

  const handleSubmit = async (formValues: ConnectBroker) => {
    try {
      setLoading(true);
      if (!botSelected.id) return;

      const connectBrokerData: ConnectBroker = {
        bot_id: botSelected.id,
        broker_code: formValues.broker_code,
        broker_server: formValues.broker_server,
        platform: formValues.platform,
        profile_id: null,
        account_id: formValues.account_id,
        password: formValues.password,
      };

      // upload profile and get profile_id
      if (requireProfile) {
        const profileData = new FormData();
        profileData.append('broker_code', formValues.broker_code ?? '');
        profileData.append('platform', formValues.platform ?? '');
        profileData.append('account_id', formValues.account_id ?? '');
        profileData.append('file', profileRef.current?.input?.files?.[0] ?? '');
        const profileRes = await uploadProfile(profileData);
        if (profileRes.error_code !== ERROR_CODE.SUCCESS) {
          throw new Error(JSON.stringify({ message: profileRes.message }));
        }
        connectBrokerData.profile_id = profileRes.payload.profile_id;
      }

      // connect broker
      const connectRes = await connectBrokerHandlers[connectType](
        connectBrokerData
      );
      if (connectRes.error_code === ERROR_CODE.SUCCESS) {
        apiNotification.success({
          message: SUCCESS_MESSAGE.SUCCESS,
        });
        if (onConnected) onConnected();
      } else {
        throw new Error(JSON.stringify({ message: connectRes.message }));
      }
    } catch (err) {
      const res = JSON.parse((err as Error).message);
      apiNotification.error({
        message: res.message || ERROR_MESSAGE.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowGuideVideo = (videoGuid: typeof GUIDE_VIDEO.MT4) => () => {
    videoGuideRef.current = videoGuid;
    setShowGuideVideo(true);
  };

  useEffect(() => {
    fetchBrokerSettings();
  }, []);

  useEffect(() => {
    form.setFieldValue('broker_code', brokerOptions[0]?.value ?? null);
    handleChangeBroker(brokerOptions[0]?.value);
  }, [form, brokerOptions, handleChangeBroker]);

  return (
    <div className={style.connectBrokerContainer}>
      {contextHolder}
      <h1 className={style.title}>{translateConnectBroker('connection')}</h1>
      <div className={style.descriptionContainer}>
        <div className={style.shortDescription}>
          {translateConnectBroker('requirements')}:
        </div>
        <ul className={style.description}>
          {workBaseOn.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <ConfigProvider theme={getThemeForm(appTheme)}>
        <Form
          form={form}
          layout="vertical"
          name="register"
          onFinish={handleSubmit}
          initialValues={INITIAL_VALUE}
          scrollToFirstError
          autoComplete="off"
        >
          <Form.Item
            name="broker_code"
            label={translateForm('label.broker')}
            labelAlign="left"
            rules={[
              {
                required: true,
                message: translateForm('message_error_required.broker'),
              },
            ]}
          >
            <Select
              size="large"
              placeholder={translateForm('placeholder.broker')}
              options={brokerOptions}
              onChange={handleChangeBroker}
            ></Select>
          </Form.Item>
          <p className={style.brokerInputDescription}>
            {translateConnectBroker('dont_have_account')}
            {', '}
            <span
              className={style.anchor}
              onClick={() => window.open(registerLink, '_blank')}
            >
              {translateConnectBroker('register_here')}
            </span>
          </p>
          <Form.Item
            name="broker_server"
            labelAlign="left"
            label={translateForm('label.server')}
            rules={[
              {
                required: true,
                message: translateForm('message_error_required.server'),
              },
            ]}
          >
            <Select
              size="large"
              placeholder={translateForm('placeholder.server')}
              options={serverOptions}
            ></Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={24} xl={requireProfile ? 8 : 24}>
              <Form.Item
                name="platform"
                label={translateForm('label.platform')}
                rules={[
                  {
                    required: true,
                    message: translateForm('message_error_required.platform'),
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder={translateForm('placeholder.platform')}
                  options={Object.values(PLATFORMS).map((platform) => ({
                    label: platform.toUpperCase(),
                    value: platform,
                  }))}
                />
              </Form.Item>
            </Col>
            {requireProfile && (
              <Col span={24} xl={16}>
                <Form.Item
                  name="profile_name"
                  label={
                    <Space>
                      {translateForm('label.profile')}
                      <Tooltip
                        title={
                          <div className={style.profileTutorial}>
                            <p>
                              {translateConnectBroker(
                                'profile_guide.description'
                              )}
                              :
                            </p>
                            <span
                              className={style.anchor}
                              onClick={handleShowGuideVideo(GUIDE_VIDEO.MT4)}
                            >
                              -{' '}
                              {translateConnectBroker(
                                'profile_guide.get_mt4_profile_guide'
                              )}
                            </span>
                            <span
                              className={style.anchor}
                              onClick={handleShowGuideVideo(GUIDE_VIDEO.MT5)}
                            >
                              -{' '}
                              {translateConnectBroker(
                                'profile_guide.get_mt5_profile_guide'
                              )}
                            </span>
                          </div>
                        }
                      >
                        <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
                      </Tooltip>
                    </Space>
                  }
                  rules={[
                    {
                      required: true,
                      message: translateForm('message_error_required.profile'),
                    },
                  ]}
                >
                  <Input
                    readOnly
                    size="large"
                    placeholder={translateForm('placeholder.profile')}
                    addonAfter={
                      <Button
                        style={{
                          color: appTheme.colors.on_secondary_darken_2,
                          background: 'transparent',
                        }}
                        type="text"
                        icon={<UploadOutlined />}
                        onClick={() => profileRef.current?.input?.click()}
                      >
                        {translateForm('label.upload')}
                      </Button>
                    }
                  />
                </Form.Item>
                <Input
                  ref={profileRef}
                  type="file"
                  hidden
                  onChange={(e) =>
                    form.setFieldValue(
                      'profile_name',
                      e.target.files?.[0]?.name
                    )
                  }
                />
              </Col>
            )}
          </Row>
          <Form.Item
            name="account_id"
            label={translateForm('label.id')}
            rules={[
              {
                required: true,
                message: translateForm('message_error_required.id'),
              },
            ]}
          >
            <Input placeholder={translateForm('placeholder.id')} size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label={translateForm('label.password')}
            rules={[
              {
                required: true,
                message: translateForm('message_error_required.password'),
              },
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <div className={style.submitBtnContainer}>
            <CustomButton
              loading={loading}
              type="submit"
              style={{ width: '100%', height: 56, textTransform: 'uppercase' }}
            >
              {translateForm('button.connect')}
            </CustomButton>
          </div>
          <div className={style.policyContainer}>
            {translateConnectBroker('policy_1')}{' '}
            <a href={TERM_CONDITION_LINK} target="_blank" rel="noreferrer">
              {translateConnectBroker('terms')}
            </a>
            {', '}
            <a href={PRIVACY_POLICY_LINK} target="_blank" rel="noreferrer">
              {translateConnectBroker('conditions')}
            </a>{' '}
            {translateConnectBroker('policy_2')}
          </div>
        </Form>
      </ConfigProvider>
      <AppModal
        open={showGuideVideo}
        close={() => setShowGuideVideo(false)}
        noPadding
      >
        <div className={style.guideVideo}>
          <video
            width="100%"
            controls
            autoPlay
            title={videoGuideRef.current.title}
          >
            <source
              src={generateVideoSrc(videoGuideRef.current.videoId)}
            ></source>
          </video>
        </div>
      </AppModal>
    </div>
  );
}
