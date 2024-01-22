import React, { useEffect } from 'react';
import {
  Button,
  Form,
  Space,
  Typography,
  Input,
  Row,
  InputNumber,
  Col,
  Tooltip,
  Table,
  FormListFieldData,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast } from '@/hook/toast';
import { getById } from '../fetcher';
import CustomCard from '@/components/commons/custom-card';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ROUTERS } from '@/constants/router';

const { Text } = Typography;

interface FormProps {
  create: boolean;
  handleSubmit: (formValues: FormValues) => void;
}

export interface FormValues {
  name: string;
  ranges: {
    from: number;
    to: number;
    percent: number;
  }[];
}

const initialValue = {
  name: 'DEFAULT',
  ranges: [
    {
      from: null,
      to: null,
      percent: null,
    },
  ],
};

const FaqForm: React.FC<FormProps> = ({ handleSubmit }) => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;
    getById(id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          form.setFieldsValue({
            name: res.payload.name,
            ranges: res.payload.data.ranges,
          });
        } else {
          errorToast('Failed to get bot fee detail');
          router.push(ROUTERS.AFFILIATE_TBOT_FEE);
        }
      })
      .catch((e: Error) => {
        errorToast('Failed to get bot fee detail');
        console.log(e);
        router.push(ROUTERS.AFFILIATE_TBOT_FEE);
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
            <Col span={24} lg={7}>
              <Form.Item
                name="name"
                label={<Text strong>Name</Text>}
                rules={[{ required: true, message: 'Field is required' }]}
              >
                <Input size="large" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="ranges">
            {(fields, { add, remove }) => {
              const columns: ColumnsType<FormListFieldData> = [
                {
                  title: 'Balance From',
                  dataIndex: 'from',
                  render: (_, { name, ...restField }, index) => (
                    <Form.Item
                      {...restField}
                      style={{ marginBottom: 0 }}
                      name={[name, 'from']}
                      rules={[
                        { required: true, message: 'Field is required' },
                        // validate from value must be equal or less than to value
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const rowData = getFieldValue('ranges')[index];
                            if (value && rowData.to && value > rowData.to) {
                              return Promise.reject(new Error('Invalid value'));
                            }
                            return Promise.resolve();
                          },
                        }),
                        // validate from value must be equal previous to value
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const prevRowData =
                              getFieldValue('ranges')[index - 1];
                            if (
                              value &&
                              prevRowData?.to &&
                              value !== prevRowData.to
                            ) {
                              return Promise.reject(
                                new Error('Value is not continuous')
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        size="large"
                        min={0}
                        step={1}
                        precision={0}
                        formatter={(value) =>
                          `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: 'Balance To',
                  dataIndex: 'to',
                  render: (_, { name, ...restField }, index) => (
                    <Form.Item
                      {...restField}
                      style={{ marginBottom: 0 }}
                      name={[name, 'to']}
                      rules={[
                        // balance to of last row can be Infinity
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const ranges = getFieldValue('ranges');
                            if (index < ranges.length - 1 && !value) {
                              return Promise.reject(
                                new Error('Field is required')
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                        // validate from value must be equal or less than to value
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const rowData = getFieldValue('ranges')[index];
                            if (value && rowData.from && value < rowData.from) {
                              return Promise.reject(new Error('Invalid value'));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        size="large"
                        min={0}
                        step={1}
                        precision={0}
                        formatter={(value) =>
                          `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: 'Fee Rate',
                  dataIndex: 'percent',
                  render: (_, { name, ...restField }) => (
                    <Form.Item
                      {...restField}
                      style={{ marginBottom: 0 }}
                      name={[name, 'percent']}
                      rules={[{ required: true, message: 'Field is required' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        size="large"
                        min={0}
                        max={1}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: '',
                  dataIndex: 'action',
                  align: 'center',
                  fixed: 'right',
                  width: '60px',
                  render: (_, { name }) => (
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Tooltip placement="bottom" title="Delete row">
                        <Button
                          danger
                          size="large"
                          style={{ margin: 'auto', display: 'block' }}
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        ></Button>
                      </Tooltip>
                    </Form.Item>
                  ),
                },
              ];
              return (
                <>
                  <Table
                    rowKey={(record) => record.key}
                    columns={columns}
                    dataSource={fields}
                    pagination={false}
                    tableLayout="auto"
                    scroll={{ x: 'max-content' }}
                  />
                  <Form.Item style={{ marginTop: 16 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      New item
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>

          <Row>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space style={{ columnGap: '16px' }}>
                <Button
                  type="default"
                  size="large"
                  onClick={redirectPage(ROUTERS.AFFILIATE_TBOT_FEE)}
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
