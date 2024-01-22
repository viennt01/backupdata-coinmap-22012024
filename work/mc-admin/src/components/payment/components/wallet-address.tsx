import { useContext, useEffect, useState } from 'react';
import {
  Card,
  Space,
  Input,
  Typography,
  Modal,
  Form,
  Tag,
  Button,
  Row,
  Col,
  notification,
  Alert,
  Select,
} from 'antd';
import {
  EditOutlined,
  InfoCircleFilled,
  SettingFilled,
} from '@ant-design/icons';
import ButtonCopy from '@/components/common/button-copy';
import {
  getMerchantInfo,
  verifyPassword,
  getWalletOtp,
  updateWallet,
  NETWORK_TYPE,
} from '@/components/payment/fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { WALLET_STATUS, COLORS } from '@/constant/payment';
import { AppContext } from '@/app-context';

const { Title, Text } = Typography;

interface ConfirmPasswordFormValues {
  password: string;
}

interface SettingsFormValues {
  wallet_address: string;
  otp: string;
  type: NETWORK_TYPE;
}

const confirmPasswordInitialValue = {
  password: '',
};

const SettingsInitialValue = {
  wallet_address: '',
  otp: '',
  type: NETWORK_TYPE.TRC20,
};

const WalletAddress = () => {
  const [notiApi, notiContextHolder] = notification.useNotification();
  const [confirmPasswordForm] = Form.useForm<ConfirmPasswordFormValues>();
  const [settingsForm] = Form.useForm<SettingsFormValues>();
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] =
    useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConfirmChangeModal, setShowConfirmChangeModal] = useState(false);
  const { merchantInfo, setMerchantInfo } = useContext(AppContext);
  const { status, wallet_address } = merchantInfo?.config.wallet ?? {};

  const fetchMerchantInfo = () => {
    getMerchantInfo()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setMerchantInfo?.(res.payload);
        }
      })
      .catch((e: Error) => console.log(e));
  };

  const handleShowConfirmPasswordModal = () => {
    confirmPasswordForm.resetFields();
    setShowConfirmPasswordModal(true);
  };

  const handleConfirmPassword = (formValues: ConfirmPasswordFormValues) => {
    verifyPassword(formValues)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setShowConfirmPasswordModal(false);
          settingsForm.resetFields();
          setShowSettingsModal(true);
        }
      })
      .catch((e: Error) => {
        const res = JSON.parse(e.message);
        notiApi.error({
          message: 'Failed',
          description: res.message,
        });
      });
  };

  const handleGetVerificationCode = () => {
    settingsForm
      .validateFields(['wallet_address', 'type']) // check wallet address before get otp
      .then((res) => {
        const password = confirmPasswordForm.getFieldValue('password');
        const wallet_address = res.wallet_address;
        const type = res.type;

        getWalletOtp({ password, wallet_address, type }) // get otp for wallet address
          .then((res) => {
            if (res.error_code === ERROR_CODE.SUCCESS) {
              notiApi.success({
                message: 'Success',
                description: `A verification code has been sent to ${merchantInfo?.email}`,
              });
            }
          })
          .catch((e: Error) => {
            const res = JSON.parse(e.message);
            notiApi.error({
              message: 'Failed',
              description: res.message,
            });
          });
      })
      .catch((e) => {
        notiApi.error({
          message: 'Failed',
          description: e.errorFields[0].errors[0],
        });
      });
  };

  const handleConfirmChanges = () => {
    setShowConfirmChangeModal(true);
  };

  const handleUpdateWalletAddress = () => {
    const password = confirmPasswordForm.getFieldValue('password') as string;
    const formValues = settingsForm.getFieldsValue();

    updateWallet({ password, ...formValues })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          fetchMerchantInfo();
          setShowSettingsModal(false);
          notiApi.success({
            message: 'Success',
            description: 'Your wallet address has been changed',
          });
        }
      })
      .catch((e: Error) => {
        const res = JSON.parse(e.message);
        notiApi.error({
          message: 'Failed',
          description: res.message,
        });
      });
  };

  useEffect(() => {
    fetchMerchantInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      bordered={false}
      title={
        <>
          <Space
            style={{
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Title
              level={4}
              style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              WALLET ADDRESS
              {!!status && (
                <Tag
                  style={{ margin: 0, padding: '2px 8px' }}
                  color={
                    status === WALLET_STATUS.ACTIVE
                      ? COLORS.ACTIVE
                      : COLORS.INACTIVE
                  }
                >
                  {status}
                </Tag>
              )}
            </Title>
            <Button
              type="text"
              shape="circle"
              onClick={handleShowConfirmPasswordModal}
            >
              <EditOutlined style={{ display: 'block', fontSize: 18 }} />
            </Button>
          </Space>
        </>
      }
    >
      {notiContextHolder}
      <Alert
        message="We only accept payments using TRC20 and BSC20 network"
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />
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
            <InfoCircleFilled style={{ fontSize: 22, color: '#faad14' }} />
            <span style={{ fontSize: 18 }}>CONFIRM PASSWORD</span>
          </div>
        }
        open={showConfirmPasswordModal}
        centered
        maskClosable={false}
        okText="Confirm"
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large', type: 'text' }}
        onCancel={() => setShowConfirmPasswordModal(false)}
        onOk={() => confirmPasswordForm.submit()}
      >
        <Form
          form={confirmPasswordForm}
          initialValues={confirmPasswordInitialValue}
          layout="vertical"
          autoComplete="off"
          onFinish={handleConfirmPassword}
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" placeholder="Enter current password" />
          </Form.Item>
        </Form>
      </Modal>

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
            <SettingFilled style={{ fontSize: 22 }} />
            <span style={{ fontSize: 18 }}>SETTINGS</span>
          </div>
        }
        open={showSettingsModal}
        centered
        maskClosable={false}
        okText="Submit"
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large', type: 'text' }}
        onCancel={() => setShowSettingsModal(false)}
        onOk={() => settingsForm.submit()}
      >
        <Form
          form={settingsForm}
          initialValues={SettingsInitialValue}
          layout="vertical"
          autoComplete="off"
          onFinish={handleConfirmChanges}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="wallet_address"
                label={<Text strong>Wallet address</Text>}
                rules={[
                  { required: true, message: 'Please input wallet address!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter wallet address"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="type"
                label={<Text strong>Wallet type</Text>}
                rules={[
                  { required: true, message: 'Please input wallet type!' },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Select wallet type"
                  options={Object.values(NETWORK_TYPE).map((type) => ({
                    label: type,
                    value: type,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="otp"
                label={<Text strong>Verification code</Text>}
                rules={[
                  {
                    required: true,
                    message: 'Please input verification code!',
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter verification code"
                  allowClear
                  addonAfter={
                    <Button type="link" onClick={handleGetVerificationCode}>
                      Get code
                    </Button>
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

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
            <InfoCircleFilled style={{ fontSize: 22, color: '#faad14' }} />
            <span style={{ fontSize: 18 }}>CONFIRM CHANGES</span>
          </div>
        }
        open={showConfirmChangeModal}
        centered
        maskClosable={false}
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large', type: 'text' }}
        onCancel={() => setShowConfirmChangeModal(false)}
        onOk={() => {
          setShowConfirmChangeModal(false);
          handleUpdateWalletAddress();
        }}
      >
        <Title level={5}>
          Are you sure you want to change the wallet address to:
        </Title>
        <Input.Group compact style={{ display: 'flex' }}>
          <Input
            disabled
            style={{ flex: '1' }}
            size="large"
            value={settingsForm.getFieldValue('wallet_address')}
          />
          <ButtonCopy
            copyValue={settingsForm.getFieldValue('wallet_address')}
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
      </Modal>
    </Card>
  );
};

export default WalletAddress;
