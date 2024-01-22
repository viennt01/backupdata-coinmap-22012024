import { AppContext } from '@/app-context';
import {
  getUserDetail,
  getNumberBotOfCustomer,
} from '@/components/customer/fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { ROUTERS } from '@/constant/router';
import {
  Button,
  Form,
  Input,
  Typography,
  Card,
  Row,
  Col,
  Select,
  Divider,
} from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { GENDER, GENDER_LABEL } from '../interface';
import style from './index.module.scss';
import TableBot from './table-bot';
import ListHistory from './list-history';

export interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: GENDER;
  number_of_tbot: number;
}

const initialValue = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  gender: '',
  number_of_tbot: 0,
};

const { Title } = Typography;

interface Props {
  editing?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (formValues: FormValues) => void;
}

export default function CustomerCreateForm({ editing, handleSubmit }: Props) {
  const router = useRouter();
  const { merchantInfo } = useContext(AppContext);
  const [form] = Form.useForm<FormValues>();
  const { id } = router.query;
  const canUpdateUserBot = merchantInfo?.config.update_user_bot;
  const canCreateUser = merchantInfo?.config.create_user_merchant;

  useEffect(() => {
    if (!id) return;

    getUserDetail(id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          form.setFieldsValue({
            first_name: res.payload.first_name,
            last_name: res.payload.last_name,
            email: res.payload.email,
            gender: res.payload.gender,
          });
        } else {
          router.push(ROUTERS.HOME);
        }
      })
      .catch((e: Error) => {
        console.log(e);
        router.push(ROUTERS.HOME);
      });

    getNumberBotOfCustomer(id as string).then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        if (res.payload) {
          form.setFieldsValue({ number_of_tbot: Number(res.payload.value) });
        }
      }
    });
  }, [router, form]);

  const onFinish = (formValues: FormValues) => {
    handleSubmit(formValues);
  };
  return (
    <div className={style.customerFormContainer}>
      <Card style={{ marginBottom: 24 }}>
        <Form
          name="basic"
          form={form}
          initialValues={initialValue}
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          autoComplete="off"
          labelAlign="left"
        >
          <Row justify={'center'}>
            <Col>
              <Title level={3}>
                {editing ? 'Edit a  customer' : 'Create a new customer'}
              </Title>
            </Col>
          </Row>
          <Row>
            <Col lg={24} md={24}>
              <Form.Item
                label="Fist name"
                name="first_name"
                rules={[{ required: true, message: 'Please input fist name' }]}
              >
                <Input placeholder="Enter fist name" />
              </Form.Item>

              <Form.Item
                label="Last name"
                name="last_name"
                rules={[{ required: true, message: 'Please input last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input email' }]}
              >
                <Input disabled={!canCreateUser} placeholder="Enter email" />
              </Form.Item>

              {!editing ? (
                <>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: 'Please input new password!' },
                      {
                        min: 8,
                        message: 'Your password must be at least 8 characters!',
                      },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                        message:
                          'Your password must contain at least 8 characters with uppercase letter, lowercase letter, and number!',
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>
                  <Form.Item
                    label="Repeat Password"
                    name="old_password"
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Please repeat your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              'The two passwords that you entered do not match!'
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Enter repeat password" />
                  </Form.Item>
                </>
              ) : (
                <></>
              )}
              <Form.Item
                name={'gender'}
                label={'Gender'}
                rules={[{ required: true, message: 'Please input gender' }]}
              >
                <Select
                  placeholder="Select gender"
                  options={Object.values(GENDER).map((gender) => ({
                    label: GENDER_LABEL[gender],
                    value: gender,
                  }))}
                />
              </Form.Item>

              {canUpdateUserBot && editing && (
                <>
                  <Divider />
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Number of A.I Trading"
                        name="number_of_tbot"
                        rules={[
                          {
                            required: true,
                            message: 'Please input number',
                          },
                          {
                            validator: (_, value) =>
                              value >= 0
                                ? Promise.resolve()
                                : Promise.reject(new Error('Number >= 0')),
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="Enter number"
                          addonAfter="A.I Trading"
                          min={0}
                          step={1}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
          <Row gutter={12}>
            <Col>
              <Button onClick={() => router.push(ROUTERS.CUSTOMER_LIST)}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                {editing ? 'Save' : '    Create customer'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card style={{ marginBottom: 24 }}>
        <Row>
          <Col span={24}>
            <TableBot />
          </Col>
        </Row>
      </Card>
      <Card>
        <Row>
          <Col span={24}>
            <ListHistory />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
