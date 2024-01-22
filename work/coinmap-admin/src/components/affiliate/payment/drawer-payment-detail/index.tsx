import CustomCard from '@/components/commons/custom-card';
import {
  ICON_NETWORK,
  NETWORK,
  Payment,
} from '@/components/affiliate/payment/interface';
import {
  SaveOutlined,
  UserOutlined,
  DollarOutlined,
  WalletOutlined,
  FieldTimeOutlined,
  MailOutlined,
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Image,
  Typography,
} from 'antd';
import { PAYMENT_STATUS } from '../interface';
import { formatDate } from '@/utils/format';
import { MerchantUpdatePayment } from '../fetcher';
import { formatCurrency } from '@/utils/format-currency';
import { useEffect } from 'react';
import ButtonCopy from '@/components/commons/button-copy';
import PaymentLogs from './payment-logs';

const { Option } = Select;
const { Title } = Typography;

interface Props {
  onClose: () => void;
  open: boolean;
  handleUpdatePayment: (value: MerchantUpdatePayment) => void;
  paymentSelected: Payment | null;
}

export default function DrawerPaymentDetail({
  onClose,
  open,
  handleUpdatePayment,
  paymentSelected,
}: Props) {
  const [form] = Form.useForm();

  //set initial values when opening another payment
  useEffect(() => {
    form.resetFields();
  }, [open]);

  if (!paymentSelected) {
    return null;
  }

  const initialValues = {
    transaction_id: paymentSelected.transaction_id,
    status: paymentSelected.status,
    description: paymentSelected.description,
  };
  return (
    <Drawer
      title="Update payment"
      placement="right"
      size="large"
      onClose={onClose}
      open={open}
    >
      <CustomCard style={{ marginBottom: 24 }}>
        <Space direction="vertical">
          <div>
            <UserOutlined style={{ fontSize: 18 }} />{' '}
            {paymentSelected.merchant_name}
          </div>
          <div>
            <MailOutlined style={{ fontSize: 18 }} />{' '}
            {paymentSelected.merchant_email}
          </div>
          <div>
            <DollarOutlined style={{ fontSize: 18 }} />{' '}
            {formatCurrency(paymentSelected.amount_commission_complete)}
          </div>
          <div>
            <FieldTimeOutlined style={{ fontSize: 18 }} />{' '}
            {formatDate(new Date(Number(paymentSelected.created_at)))}
          </div>
          <div
            style={{
              height: '22px',
            }}
          >
            <WalletOutlined style={{ fontSize: 18 }} />{' '}
            {paymentSelected.wallet_address}
            <ButtonCopy copyValue={paymentSelected.wallet_address} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '22px',
              gap: '4px',
            }}
          >
            <Image
              src={
                ICON_NETWORK[paymentSelected.wallet_network] ||
                ICON_NETWORK.TRC20
              }
              alt="logo network"
              width={18}
              height={18}
              style={{
                display: 'block',
              }}
              preview={false}
            />
            {paymentSelected.wallet_network || NETWORK.TRC20}
          </div>
        </Space>
      </CustomCard>

      <CustomCard style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdatePayment}
          initialValues={initialValues}
        >
          <Form.Item name="transaction_id">
            <Input
              size="large"
              placeholder="Enter transaction id"
              allowClear
              disabled={initialValues.status === PAYMENT_STATUS.COMPLETED}
            />
          </Form.Item>
          <Form.Item
            name="status"
            rules={[{ required: true, message: 'Please input status!' }]}
          >
            <Select
              placeholder="Choose status"
              size="large"
              allowClear
              disabled={initialValues.status === PAYMENT_STATUS.COMPLETED}
            >
              {Object.values(PAYMENT_STATUS).map((status) => (
                <Option value={status} key={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description">
            <Input size="large" placeholder="Enter description" allowClear />
          </Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            block
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        </Form>
      </CustomCard>

      <Title level={4}>Histories</Title>
      <CustomCard>
        <PaymentLogs
          paymentHistories={paymentSelected.metadata?.histories ?? []}
        />
      </CustomCard>
    </Drawer>
  );
}
