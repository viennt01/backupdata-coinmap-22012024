import CustomCard from '@/components/commons/custom-card';
import { EMAIL_CONFIRMED, EMAIL_CONFIRMED_LABEL } from '@/constants/merchants';
import { SearchOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  FormInstance,
  Select,
  DatePicker,
} from 'antd';
import {
  Merchant,
  ORDER_CATEGORY,
  PackageList,
  USER_BOT_STATUS,
} from '../interface';
import { useEffect, useMemo, useState } from 'react';
import { getBotTradingList, getMerchants } from '../fetcher';
import { ERROR_CODE } from '@/constants/code-constants';

interface Props {
  form: FormInstance;
  handleSearch: (value: { keyword: { $d: Date }; name: string }) => void;
}

export default function PaymentFilter({ handleSearch, form }: Props) {
  const [packages, setPackages] = useState<PackageList>({});
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  const packageOptions = useMemo(() => {
    const filteredPackages = Object.values(packages).flat();
    return filteredPackages.map((item) => {
      let label = item.name;
      if (item.clone_name) {
        label += ' - ' + item.clone_name;
      }
      return {
        label,
        value: item.id,
      };
    });
  }, [packages]);

  const merchantOptions = useMemo(() => {
    const filteredPackages = Object.values(merchants).flat();
    return filteredPackages.map((item) => ({
      label: item.code,
      value: item.code,
    }));
  }, [merchants]);

  const botStatusOptions = useMemo(() => {
    return Object.values(USER_BOT_STATUS).map((status) => ({
      label: status,
      value: status,
    }));
  }, []);

  const fetchOptionSelect = () => {
    getMerchants()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setMerchants(res.payload);
        }
      })
      .catch((e) => console.log(e));
    getBotTradingList()
      .then((botTradingRes) => {
        if (botTradingRes.error_code === ERROR_CODE.SUCCESS) {
          setPackages({
            [ORDER_CATEGORY.TBOT]: botTradingRes.payload,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchOptionSelect();
  }, []);

  return (
    <CustomCard style={{ marginTop: '24px' }}>
      <Row justify="space-between">
        <Col flex={1}>
          <Form form={form} layout="vertical" onFinish={handleSearch}>
            <Row gutter={[16, 16]} align="bottom">
              <Col span={24} lg={3}>
                <Form.Item name="keyword" style={{ margin: 0 }}>
                  <Input size="large" placeholder="Search" allowClear />
                </Form.Item>
              </Col>
              <Col span={24} lg={3}>
                <Form.Item name="email_confirmed" style={{ margin: 0 }}>
                  <Select
                    placeholder="Email verify"
                    size="large"
                    allowClear
                    options={Object.values(EMAIL_CONFIRMED).map((value) => ({
                      label:
                        EMAIL_CONFIRMED_LABEL[
                          String(value) as keyof typeof EMAIL_CONFIRMED_LABEL
                        ],
                      value,
                    }))}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={3}>
                <Form.Item name="merchant_code" style={{ margin: 0 }}>
                  <Select
                    placeholder="Merchant code"
                    size="large"
                    allowClear
                    showSearch
                    options={merchantOptions}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={3}>
                <Form.Item name="tbots" style={{ margin: 0 }}>
                  <Select
                    placeholder="Package"
                    size="large"
                    allowClear
                    showSearch
                    options={packageOptions}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={3}>
                <Form.Item name="tbot_status" style={{ margin: 0 }}>
                  <Select
                    placeholder="Bot status"
                    size="large"
                    allowClear
                    showSearch
                    options={botStatusOptions}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={3}>
                <Form.Item name="from" style={{ margin: 0 }}>
                  <DatePicker
                    placeholder="From"
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={3}>
                <Form.Item name="to" style={{ margin: 0 }}>
                  <DatePicker
                    placeholder="To"
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              <Col flex={1} style={{ textAlign: 'right' }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </CustomCard>
  );
}
