import { ERROR_CODE, FIELD_TYPE } from '@/constants/code-constants';
import {
  Col,
  Form,
  Row,
  Typography,
  FormInstance,
  Input,
  Checkbox,
  Switch,
  Divider,
} from 'antd';
import { useEffect, useState } from 'react';
import { MerchantCreate, getBrokerSettings } from '../fetcher';
import { Broker } from '../interface';
import { FormValues } from './merchant-create-form';
import React from 'react';

const { Text } = Typography;

interface BrokerProps {
  form: FormInstance<FormValues>;
  merchantInfo?: MerchantCreate;
}

export default function BrokerInfo({ form, merchantInfo }: BrokerProps) {
  const [brokerList, setBrokerList] = useState<Broker[]>([]);

  const fetchData = () => {
    getBrokerSettings()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS && res.payload[0]) {
          const brokerSetting = JSON.parse(res.payload[0].value);
          const brokers: Broker[] = Object.values(brokerSetting);
          setBrokerList(brokers);
        }
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const brokers = merchantInfo?.config?.brokers ?? [];
    brokerList.forEach((brokerSetting) => {
      const broker = brokers.find((item) => item.code === brokerSetting.code);
      const formValues = {
        brokers: {
          [brokerSetting.code]: {
            name: brokerSetting.name,
            selected: broker?.selected ?? false,
            referral_setting: broker?.referral_setting ?? {},
          },
        },
      };
      form.setFieldsValue(formValues);
    });
  }, [form, merchantInfo, brokerList]);

  const renderFormItem = (
    code: string,
    field: {
      key: string;
      name: string;
      type: FIELD_TYPE;
    }
  ) => {
    const namePath = ['brokers', code, 'referral_setting', field.key];
    switch (field.type) {
      case FIELD_TYPE.STRING: {
        return (
          <Form.Item name={namePath} label={<Text strong>{field.name}</Text>}>
            <Input size="large" allowClear />
          </Form.Item>
        );
      }
      case FIELD_TYPE.NUMBER: {
        return (
          <Form.Item name={namePath} label={<Text strong>{field.name}</Text>}>
            <Input type="number" size="large" allowClear />
          </Form.Item>
        );
      }
      case FIELD_TYPE.BOOLEAN: {
        return (
          <Form.Item
            name={namePath}
            label={<Text strong>{field.name}</Text>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        );
      }
      default: {
        return (
          <Form.Item name={namePath} label={<Text strong>{field.name}</Text>}>
            <Input size="large" allowClear />
          </Form.Item>
        );
      }
    }
  };

  return (
    <>
      {brokerList.map((broker, brokerIndex) => (
        <React.Fragment key={brokerIndex}>
          <Row gutter={16}>
            <Col span={24} lg={4} hidden>
              <Form.Item name={['brokers', broker.code, 'name']}></Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item
                name={['brokers', broker.code, 'selected']}
                valuePropName="checked"
                label={<Text strong>{broker.name}</Text>}
              >
                <Checkbox>Enable</Checkbox>
              </Form.Item>
            </Col>
            {broker.referral_setting.map((setting, settingIndex) => (
              <Col span={24} lg={4} key={settingIndex}>
                {renderFormItem(broker.code, setting)}
              </Col>
            ))}
          </Row>
          {brokerIndex < brokerList.length - 1 && (
            <Divider style={{ marginTop: 0 }} />
          )}
        </React.Fragment>
      ))}
    </>
  );
}
