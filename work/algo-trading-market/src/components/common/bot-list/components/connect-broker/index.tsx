import {
  CREATA_AXI_ACCOUNT_LINK,
  PRIVACY_POLICY_LINK,
  TERM_CONDITION_LINK,
} from '@/constants/axi-link';
import { ERROR_CODE } from '@/constants/error-code';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@/constants/message';
import { Form, Input, ConfigProvider, Select, notification } from 'antd';
import { useEffect, useState } from 'react';
import {
  connectBroker,
  selectAndConnectBroker,
  getBrokers,
} from '../../fetcher';
import { ConnectBroker } from '../../interface';
import style from './index.module.scss';
const { Option } = Select;
import { CONNECT_BROKER_TYPES } from '@/constants/common';
import CustomButton from '@/components/common/custom-button';
import { THEME_FORM } from '@/constants/theme';
import { BOT } from '@/components/common/bot-list/interface';

const INITIAL_VALUE: Omit<ConnectBroker, 'bot_id'> = {
  broker_code: '',
  broker_server: '',
  account_id: '',
  password: '',
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
  const [loading, setLoading] = useState<boolean>(false);
  const [brokerOptions, setBrokerOptions] = useState<
    { name: string; label: string }[]
  >([]);
  const [form] = Form.useForm<Omit<ConnectBroker, 'bot_id'>>();
  const [apiNotification, contextHolder] = notification.useNotification();

  const fetchBrokers = () => {
    getBrokers().then((res) => {
      if (res && res.error_code === ERROR_CODE.SUCCESS) {
        const brokerOptions = res.payload.map((b) => ({
          name: b.code,
          label: b.name,
        }));
        setBrokerOptions(brokerOptions);
      }
    });
  };
  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleSubmit = (values: Omit<ConnectBroker, 'bot_id'>) => {
    if (botSelected.id) {
      const data: ConnectBroker = {
        bot_id: botSelected.id,
        ...values,
      };
      setLoading(true);
      connectBrokerHandlers[connectType](data)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            // close modal and noti
            apiNotification.success({
              message: SUCCESS_MESSAGE.SUCCESS,
            });
            if (onConnected) onConnected();
          }
        })
        .catch((err) => {
          const res = JSON.parse(err.message);
          apiNotification.error({
            message: res.message || ERROR_MESSAGE.ERROR,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className={style.connectBrokerContainer}>
      {contextHolder}
      <h1 className={style.title}>Connect Broker</h1>
      <div className={style.descriptionContainer}>
        <div className={style.shortDescription}>
          Before connecting your broker, please make sure:
        </div>
        <ul className={style.description}>
          {botSelected.work_based_on.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <ConfigProvider theme={THEME_FORM}>
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
            label="Broker"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Please select Broker',
              },
            ]}
          >
            <Select size="large" placeholder="Select your Broker">
              {brokerOptions.map((b) => (
                <Option key={b.name} value={b.name}>
                  {b.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <p className={style.brokerInputDescription}>
            If you have no broker account,{' '}
            <a href={CREATA_AXI_ACCOUNT_LINK} target="_blank" rel="noreferrer">
              Create a broker account
            </a>{' '}
            using our link now.
          </p>
          <Form.Item
            name="broker_server"
            labelAlign="left"
            label="Server"
            rules={[
              {
                required: true,
                message: 'Please input your Broker Server',
              },
            ]}
          >
            <Input placeholder="Enter your Broker server" size="large" />
          </Form.Item>
          <Form.Item
            name="account_id"
            label="ID"
            rules={[
              {
                required: true,
                message: 'Please input your ID',
              },
            ]}
          >
            <Input placeholder="Enter your ID" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input Password',
              },
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>
          <div className={style.submitBtnContainer}>
            <CustomButton
              loading={loading}
              type="submit"
              style={{ width: '100%', height: 56 }}
            >
              CONNECT BROKER
            </CustomButton>
          </div>
          <div className={style.policyContainer}>
            By click on CONNECT BROKER button, you agree with{' '}
            <a href={TERM_CONDITION_LINK} target="_blank" rel="noreferrer">
              Term & Condition
            </a>
            {', '}
            <a href={PRIVACY_POLICY_LINK} target="_blank" rel="noreferrer">
              Privacy Policy
            </a>{' '}
            of MetaAPI
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
}
