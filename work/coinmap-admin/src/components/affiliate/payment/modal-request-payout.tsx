import { formatCurrency } from '@/utils/format-currency';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Statistic,
} from 'antd';
import { useEffect, useState } from 'react';
import ButtonCopy from '@/components/commons/button-copy';
import {
  getMerchants,
  getTransactionReport,
  getMerchantDetail,
  createInvoice,
} from './fetcher';
import { ERROR_CODE } from '@/constants/code-constants';
import { Merchant } from './interface';
import { errorToast, successToast } from '@/hook/toast';

interface ModalRequestPayoutProps {
  open: boolean;
  onClose: () => void;
  onCreatedPayout?: () => void;
}

interface FormValues {
  merchant_id: string;
  profit_all_time: number;
  payout_complete: number;
  payout_pending: number;
  profit_available: number;
  amount: number;
}

const initialValue = {
  merchant_id: null,
  profit_available: 0,
  profit_all_time: 0,
  payout_complete: 0,
  payout_pending: 0,
  amount: 0,
};

const ModalRequestPayout = ({
  open,
  onClose,
  onCreatedPayout,
}: ModalRequestPayoutProps) => {
  const [loading, setLoading] = useState(false);
  const [merchantOptions, setMerchantOptions] = useState([]);
  const [merchantInfo, setMerchantInfo] = useState({
    id: '',
    walletAddress: '',
  });
  const [profit, setProfit] = useState({
    profit_available: 0,
    profit_all_time: 0,
    payout_complete: 0,
    payout_pending: 0,
  });
  const [form] = Form.useForm<FormValues>();
  const disabledWithdraw =
    !merchantInfo.walletAddress ||
    profit.profit_available === 0 ||
    !merchantInfo.id;

  const fetchMerchantOptions = () => {
    getMerchants()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setMerchantOptions(
            res.payload.map((item: Merchant) => ({
              label: item.email,
              value: item.id,
            }))
          );
        }
      })
      .catch((e: Error) => console.log(e));
  };

  const fetchTransactionReport = (merchantId: string) => {
    getTransactionReport(merchantId)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const { commission_cash, payout_pending, payout_complete } =
            res.payload;

          const profitData = {
            profit_available:
              commission_cash - (payout_complete + payout_pending),
            profit_all_time: commission_cash,
            payout_complete: payout_complete,
            payout_pending: payout_pending,
          };

          setProfit(profitData);
          form.setFieldsValue(profitData);
        }
      })
      .catch((e: Error) => console.log(e));
  };

  const fetchMerchantInfo = (merchantId: string) => {
    getMerchantDetail(merchantId)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setMerchantInfo({
            id: res.payload.id,
            walletAddress: res.payload.config?.wallet?.wallet_address ?? '',
          });
        }
      })
      .catch((e: Error) => console.log(e));
  };

  const handleChangeMerchant = (merchantId: string) => {
    fetchTransactionReport(merchantId);
    fetchMerchantInfo(merchantId);
  };

  const handleGetAllProfit = () => {
    form.setFieldValue('amount', profit.profit_available);
  };

  const handleRequestPayout = (formValues: FormValues) => {
    setLoading(true);
    createInvoice(merchantInfo.id, { amount: formValues.amount })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Request payout created successfully');
          onClose();
          onCreatedPayout?.();
        }
      })
      .catch((e: Error) => {
        const res = JSON.parse(e.message);
        errorToast(res.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMerchantOptions();
  }, []);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setMerchantInfo({
        id: '',
        walletAddress: '',
      });
    }
  }, [open, form]);

  return (
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
      open={open}
      centered
      maskClosable={false}
      okText="Send request"
      okButtonProps={{ size: 'large', loading, disabled: disabledWithdraw }}
      cancelButtonProps={{ size: 'large', type: 'text' }}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        initialValues={initialValue}
        layout="vertical"
        autoComplete="off"
        onFinish={handleRequestPayout}
      >
        <Form.Item label="Merchant" name="merchant_id">
          <Select
            placeholder="Select merchant"
            size="large"
            showSearch
            optionFilterProp="label"
            options={merchantOptions}
            onChange={handleChangeMerchant}
          />
        </Form.Item>
        <Row>
          <Col span={24} sm={12}>
            <Form.Item label="All time profit" name="profit_all_time">
              <Statistic
                precision={2}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12}>
            <Form.Item label="Withdrawn" name="payout_complete">
              <Statistic
                precision={2}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12}>
            <Form.Item label="Payout pending" name="payout_pending">
              <Statistic
                precision={2}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12}>
            <Form.Item label="Available to withdraw" name="profit_available">
              <Statistic
                precision={2}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Wallet address" name="wallet_address">
          <Input.Group compact style={{ display: 'flex' }}>
            <Input
              disabled
              style={{ flex: '1' }}
              size="large"
              value={merchantInfo.walletAddress}
            />
            <ButtonCopy
              copyValue={merchantInfo.walletAddress}
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
            disabled={disabledWithdraw}
            style={{ width: '100%' }}
            size="large"
            min={0}
            max={profit.profit_available}
            precision={2}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            addonBefore="$"
            addonAfter={
              <Button
                disabled={disabledWithdraw}
                type="link"
                onClick={handleGetAllProfit}
              >
                Withdraw all
              </Button>
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalRequestPayout;
