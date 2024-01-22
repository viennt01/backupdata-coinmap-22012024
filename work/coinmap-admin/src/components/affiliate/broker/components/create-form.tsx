import React, { useEffect } from 'react';
import {
  Button,
  Form,
  Space,
  Typography,
  Input,
  Row,
  Col,
  Tooltip,
  Switch,
  Select,
} from 'antd';
import { useRouter } from 'next/router';
import { ERROR_CODE, FIELD_TYPE } from '@/constants/code-constants';
import { errorToast } from '@/hook/toast';
import { getById } from '../fetcher';
import CustomCard from '@/components/commons/custom-card';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ROUTERS } from '@/constants/router';
import { TIMEZONE_IDENTIFIERS } from '@/constants/timezone';

const { Text } = Typography;

interface FormProps {
  create: boolean;
  handleSubmit: (formValues: FormValues) => void;
}

export interface FormValues {
  name: string;
  code: string;
  required_profile: boolean;
  check_referral_broker: boolean;
  broker_timezone: string;
  broker_dst_switch_timezone: string;
  referral_setting: {
    name: string;
    key: string;
    type: FIELD_TYPE;
  }[];
  servers: string[];
}

const initialValue = {
  name: '',
  code: '',
  required_profile: false,
  check_referral_broker: true,
  referral_setting: [],
  servers: [],
};

const TIMEZONE_OPTIONS = TIMEZONE_IDENTIFIERS.map((tz) => ({
  label: tz,
  value: tz,
}));

const FaqForm: React.FC<FormProps> = ({ create, handleSubmit }) => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  const requiredProfile = Form.useWatch('required_profile', form);

  useEffect(() => {
    const { id, code } = router.query;
    if (!id) return;
    getById(id as string)
      .then((res) => {
        const brokerSetting = JSON.parse(res.payload.value ?? '{}');
        const broker = brokerSetting[code as string];

        if (res.error_code === ERROR_CODE.SUCCESS && broker) {
          form.setFieldsValue({
            name: broker.name,
            code: broker.code,
            required_profile: broker.required_profile,
            check_referral_broker: broker.check_referral_broker,
            broker_timezone: broker.broker_timezone,
            broker_dst_switch_timezone: broker.broker_dst_switch_timezone,
            servers: broker.servers,
            referral_setting: broker.referral_setting,
          });
        } else {
          errorToast('Failed to get broker detail');
          router.push(ROUTERS.AFFILIATE_BROKER);
        }
      })
      .catch((e: Error) => {
        errorToast('Failed to get broker detail');
        console.log(e);
        router.push(ROUTERS.AFFILIATE_BROKER);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectPage = (path: string) => () => {
    router.push(path);
  };

  const onFinish = (formValues: FormValues) => {
    handleSubmit(formValues);
  };

  return (
    <>
      <Form
        initialValues={initialValue}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <CustomCard style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={24} lg={8}>
              <Form.Item
                name="name"
                label={<Text strong>Name</Text>}
                rules={[{ required: true, message: 'Field is required' }]}
              >
                <Input size="large" placeholder="Broker name" />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <Form.Item
                name="code"
                label={<Text strong>Code</Text>}
                rules={[{ required: true, message: 'Field is required' }]}
              >
                <Input
                  size="large"
                  placeholder="Broker code"
                  disabled={!create}
                />
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item
                name="required_profile"
                label={<Text strong>Require profile</Text>}
                valuePropName="checked"
                rules={[{ required: true, message: 'Field is required' }]}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item
                name="check_referral_broker"
                label={<Text strong>Check referral broker</Text>}
                valuePropName="checked"
                rules={[{ required: true, message: 'Field is required' }]}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          {requiredProfile && (
            <Row gutter={16}>
              <Col span={24} lg={8}>
                <Form.Item
                  name="broker_timezone"
                  label={<Text strong>Timezone</Text>}
                  rules={[{ required: true, message: 'Field is required' }]}
                >
                  <Select
                    size="large"
                    showSearch
                    placeholder="Select timezone"
                    options={TIMEZONE_OPTIONS}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={8}>
                <Form.Item
                  name="broker_dst_switch_timezone"
                  label={<Text strong>Destination switch timezone</Text>}
                  rules={[{ required: true, message: 'Field is required' }]}
                >
                  <Select
                    size="large"
                    showSearch
                    placeholder="Select destination switch timezone"
                    options={TIMEZONE_OPTIONS}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.List name="referral_setting">
            {(fields, { add, remove }, { errors }) => (
              <Form.Item label={<Text strong>Referral settings</Text>}>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16}>
                    <Col span={24} lg={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[
                          {
                            required: true,
                            message: 'Field is required',
                          },
                        ]}
                      >
                        <Input size="large" placeholder="Name" />
                      </Form.Item>
                    </Col>
                    <Col span={24} lg={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'key']}
                        rules={[
                          {
                            required: true,
                            message: 'Field is required',
                          },
                        ]}
                      >
                        <Input size="large" placeholder="Key" />
                      </Form.Item>
                    </Col>
                    <Col span={22} lg={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[
                          {
                            required: true,
                            message: 'Field is required',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Type"
                          size="large"
                          options={Object.values(FIELD_TYPE).map((type) => ({
                            label: type.toUpperCase(),
                            value: type,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2} lg={2}>
                      <Form.Item>
                        <Tooltip placement="bottom" title="Delete">
                          <Button
                            danger
                            size="large"
                            style={{ margin: 'auto', display: 'block' }}
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          ></Button>
                        </Tooltip>
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                <Row gutter={16}>
                  <Col span={24} lg={8}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      New item
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Col>
                </Row>
              </Form.Item>
            )}
          </Form.List>

          <Form.List name="servers">
            {(fields, { add, remove }) => (
              <Form.Item label={<Text strong>Servers</Text>}>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16}>
                    <Col span={22} lg={14}>
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          {
                            required: true,
                            message: "Please input broker server's name",
                          },
                        ]}
                      >
                        <Input size="large" placeholder="Server name" />
                      </Form.Item>
                    </Col>
                    <Col span={2} lg={2}>
                      <Form.Item>
                        <Tooltip placement="bottom" title="Delete">
                          <Button
                            danger
                            size="large"
                            style={{ margin: 'auto', display: 'block' }}
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          ></Button>
                        </Tooltip>
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                <Row gutter={16}>
                  <Col span={24} lg={8}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      New item
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            )}
          </Form.List>

          <Row>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space style={{ columnGap: '16px' }}>
                <Button
                  type="default"
                  size="large"
                  onClick={redirectPage(ROUTERS.AFFILIATE_BROKER)}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  Submit
                </Button>
              </Space>
            </Space>
          </Row>
        </CustomCard>
      </Form>
    </>
  );
};

export default FaqForm;
