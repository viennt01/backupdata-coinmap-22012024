import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Statistic,
  notification,
} from 'antd';
import { AppContext } from '@/app-context';
import { useContext, useState } from 'react';
import { WALLET_STATUS } from '@/constant/payment';
import ButtonCopy from '@/components/common/button-copy';
import { formatCurrency } from '@/utils/format';
import { createInvoice, verifyPassword } from '@/components/payment/fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { PaymentContext } from '@/components/payment/payment';

interface RequestPayoutProps {
  availableProfit: number;
}

interface FormValues {
  amount: number;
  password: string;
}

const initialValue = {
  amount: 0,
  password: '',
};

const RequestPayout = ({ availableProfit }: RequestPayoutProps) => {
  const [notiApi, notiContextHolder] = notification.useNotification();
  const { merchantInfo } = useContext(AppContext);
  const [showRequestPayout, setShowRequestPayout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const { togglePageLoading } = useContext(PaymentContext);

  const { status, wallet_address } = merchantInfo?.config.wallet ?? {};
  const disabledWithdraw = availableProfit === 0;

  const handleClickRequestPayout = () => {
    if (!wallet_address || status !== WALLET_STATUS.ACTIVE) {
      notiApi.error({
        message: 'Failed',
        description:
          'The wallet address is not valid. Please complete the settings before requesting a payout',
      });
    } else {
      form.resetFields();
      setShowRequestPayout(true);
    }
  };

  const handleGetAllProfit = () => {
    form.setFieldValue('amount', availableProfit);
  };

  const handleRequestPayout = async (formValues: FormValues) => {
    setLoading(true);
    verifyPassword({ password: formValues.password })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          return createInvoice({ amount: formValues.amount }).then((res) => {
            if (res.error_code === ERROR_CODE.SUCCESS) {
              notiApi.success({
                message: 'Success',
                description: 'Request payout created successfully',
              });
              setShowRequestPayout(false);
              togglePageLoading?.();
            }
          });
        }
      })
      .catch((e: Error) => {
        const res = JSON.parse(e.message);
        notiApi.error({
          message: 'Failed',
          description: res.message,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {notiContextHolder}
      <Button
        disabled={disabledWithdraw}
        type="primary"
        size="large"
        onClick={handleClickRequestPayout}
      >
        Request Payout
      </Button>

      <Modal
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 18 }}>REQUEST PAYOUT</span>
          </div>
        }
        open={showRequestPayout}
        centered
        maskClosable={false}
        okText="Send request"
        okButtonProps={{ size: 'large', loading }}
        cancelButtonProps={{ size: 'large', type: 'text' }}
        onCancel={() => setShowRequestPayout(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          initialValues={initialValue}
          layout="vertical"
          autoComplete="off"
          onFinish={handleRequestPayout}
        >
          <Form.Item label="Available to withdraw">
            <Statistic
              value={availableProfit}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Form.Item>
          <Form.Item label="Wallet address">
            <Input.Group compact style={{ display: 'flex' }}>
              <Input
                disabled
                style={{ flex: '1' }}
                size="large"
                value={wallet_address}
              />
              <ButtonCopy
                copyValue={wallet_address}
                buttonProps={{
                  type: 'default',
                  size: 'large',
                  style: {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }}
              />
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Enter the value to request for payout"
            name="amount"
            rules={[{ required: true, message: 'Please input the value!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              size="large"
              min={0}
              max={availableProfit}
              precision={2}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              addonBefore="$"
              addonAfter={
                <Button type="link" onClick={handleGetAllProfit}>
                  Withdraw all
                </Button>
              }
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RequestPayout;
