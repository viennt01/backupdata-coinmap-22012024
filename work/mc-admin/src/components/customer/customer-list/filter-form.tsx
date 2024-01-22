import {
  Space,
  Form,
  Button,
  Input,
  DatePicker,
  FormInstance,
  Select,
  Row,
  Col,
} from 'antd';
import { DatePickerProps } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { EMAIL_CONFIRMED, EMAIL_CONFIRMED_LABEL } from '@/constant/user';
import QuickFilter from '@/components/common/quick-filter';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constant/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@/app-context';
import {
  getBotTradingList,
  PackageList,
} from '@/components/transaction-list/fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { ORDER_CATEGORY } from '@/constant/transaction';
import { USER_BOT_STATUS } from '../interface';

export interface FormValues {
  keyword: string;
  email_confirmed: boolean;
  tbots: string;
  from: DatePickerProps['value'];
  to: DatePickerProps['value'];
}

interface FilterFormProps {
  form: FormInstance<FormValues>;
  loading: boolean;
  handleSearch: () => void;
}

export default function FilterForm({
  form,
  loading,
  handleSearch,
}: FilterFormProps) {
  const router = useRouter();
  const { merchantInfo } = useContext(AppContext);
  const [packages, setPackages] = useState<PackageList>({});

  const handleCreateCustomer = () => {
    router.push(ROUTERS.CUSTOMER_CREATE);
  };

  // get option select for filter form
  const fetchOptionSelect = () => {
    getBotTradingList()
      .then((botTradingRes) => {
        if (botTradingRes.error_code !== ERROR_CODE.SUCCESS) return;

        setPackages({
          [ORDER_CATEGORY.TBOT]: botTradingRes.payload,
        });
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchOptionSelect();
  }, []);

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

  const botStatusOptions = useMemo(() => {
    const botStatusOptions = {
      [USER_BOT_STATUS['ACTIVE']]: USER_BOT_STATUS.ACTIVE,
      [USER_BOT_STATUS['INACTIVE']]: USER_BOT_STATUS.INACTIVE,
      [USER_BOT_STATUS['NOT_CONNECT']]: USER_BOT_STATUS.NOT_CONNECT,
      [USER_BOT_STATUS['EXPIRED']]: USER_BOT_STATUS.EXPIRED,
      [USER_BOT_STATUS['INACTIVE_BY_SYSTEM']]:
        USER_BOT_STATUS.INACTIVE_BY_SYSTEM,
      [USER_BOT_STATUS['DELETED']]: USER_BOT_STATUS.DELETED,
    };

    return Object.values(botStatusOptions)
      .filter((v) => v)
      .map((item) => ({
        label: item,
        value: item,
      }));
  }, []);

  return (
    <>
      <Row>
        <Col flex={1}>
          <Form
            style={{ marginBottom: 16 }}
            form={form}
            name="search_form"
            onFinish={handleSearch}
          >
            <Space wrap>
              <Form.Item style={{ margin: 0 }} name="keyword">
                <Input
                  placeholder="Keyword"
                  allowClear
                  style={{ minWidth: 140 }}
                />
              </Form.Item>
              <Form.Item style={{ margin: 0 }} name="email_confirmed">
                <Select
                  style={{ minWidth: 140 }}
                  allowClear
                  onClear={() => form.submit()}
                  placeholder="Email Verify"
                  options={Object.values(EMAIL_CONFIRMED).map((value) => ({
                    label:
                      EMAIL_CONFIRMED_LABEL[
                        String(value) as keyof typeof EMAIL_CONFIRMED_LABEL
                      ],
                    value,
                  }))}
                />
              </Form.Item>
              <Form.Item style={{ margin: 0 }} name="tbots">
                <Select
                  style={{ minWidth: 180 }}
                  allowClear
                  onClear={() => form.submit()}
                  showSearch
                  placeholder="Package"
                  options={packageOptions}
                ></Select>
              </Form.Item>
              <Form.Item style={{ margin: 0 }} name="tbot_status">
                <Select
                  style={{ minWidth: 180 }}
                  allowClear
                  onClear={() => form.submit()}
                  showSearch
                  placeholder="Bot status"
                  options={botStatusOptions}
                ></Select>
              </Form.Item>
              <Form.Item style={{ margin: 0 }} name="from">
                <DatePicker placeholder="From" style={{ minWidth: 140 }} />
              </Form.Item>
              <Form.Item style={{ margin: 0 }} name="to">
                <DatePicker placeholder="To" style={{ minWidth: 140 }} />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                style={{ width: 'fit-content', padding: '0 32px' }}
              ></Button>
            </Space>
          </Form>
          <div>
            <QuickFilter
              form={form}
              loading={loading}
              handleSearch={handleSearch}
            />
          </div>
        </Col>
        {merchantInfo && merchantInfo.config.create_user_merchant && (
          <Col>
            <Button
              onClick={handleCreateCustomer}
              type="primary"
              icon={<PlusOutlined />}
            >
              Create
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
}
