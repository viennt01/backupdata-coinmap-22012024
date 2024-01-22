import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Space,
  Typography,
  Form,
  Button,
  Steps,
  notification,
  Modal,
  Drawer,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { updateSender, verifySender } from '@/components/settings/fetcher';
import RegisterForm from './register-form';
import VerifyForm from './verify-form';
import GetUrlTours from './get-url-tours';
import { SettingsContext } from '@/components/settings';

const { Text } = Typography;

export const STEPS = {
  REGISTER: 0,
  VERIFY_URL: 1,
  COMPLETED: 2,
};

interface EmailSenderSettingsProps {
  open: boolean;
  onClose: () => void;
}

export interface RegisterFormValues {
  email: string;
  name: string;
  country: string;
  city: string;
  address: string;
}

export interface VerifyFormValues {
  url_verify: string;
}

const EmailSenderSettings = ({ open, onClose }: EmailSenderSettingsProps) => {
  const [notiApi, notiContextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();
  const { merchantInfo, refreshData } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);
  const [registerForm] = Form.useForm<RegisterFormValues>();
  const [verifyForm] = Form.useForm<VerifyFormValues>();
  const [currentStep, setCurrentStep] = useState(0);
  const [emailSender, setEmailSender] = useState('');
  const [showTours, setShowTours] = useState(false);
  const getUrlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!merchantInfo) return;
    const formValues = {
      email: merchantInfo.config.email_sender?.from_email,
      name: merchantInfo.config.email_sender?.from_name,
      country: merchantInfo.config.email_sender?.country,
      city: merchantInfo.config.email_sender?.city,
      address: merchantInfo.config.email_sender?.address,
    };
    registerForm.setFieldsValue(formValues);
    if (merchantInfo.config.verified_sender) {
      setEmailSender(merchantInfo.config.email_sender?.from_email);
      setCurrentStep(STEPS.COMPLETED);
    } else {
      setCurrentStep(STEPS.REGISTER);
    }
  }, [registerForm, merchantInfo]);

  const handleRegister = () => {
    registerForm
      .validateFields()
      .then((formValues) => {
        setLoading(true);
        updateSender(formValues)
          .then(() => {
            setEmailSender('');
            setCurrentStep(STEPS.VERIFY_URL);
            notiApi.success({
              message: 'Registration success',
              description: `A confirmation email has been sent to ${formValues.email}`,
              placement: 'topRight',
              duration: 5,
            });
          })
          .catch((e) => {
            const res = JSON.parse(e.message);
            notiApi.error({
              message: 'Registration failed',
              description: res.message,
              placement: 'topRight',
              duration: 3,
            });
          })
          .finally(() => setLoading(false));
      })
      .catch((e) => console.log(e));
  };

  const handleVerify = () => {
    verifyForm
      .validateFields()
      .then((formValues) => {
        setLoading(true);
        verifySender(formValues)
          .then(() => {
            setCurrentStep(STEPS.COMPLETED);
            setEmailSender(registerForm.getFieldValue('email'));
            refreshData();
            onClose();
            notiApi.success({
              message: 'Verification success',
              description: 'Your email sender has been setting',
              placement: 'topRight',
              duration: 3,
            });
          })
          .catch((e) => {
            const res = JSON.parse(e.message);
            notiApi.error({
              message: 'Verification failed',
              description: res.message,
              placement: 'topRight',
              duration: 3,
            });
          })
          .finally(() => setLoading(false));
      })
      .catch((e) => console.log(e));
  };

  const confirmRegister = () => {
    modal.confirm({
      centered: true,
      type: 'confirm',
      title: 'Continue change?',
      content: <Text>If you continue, your email sender will be changed.</Text>,
      cancelButtonProps: { type: 'text' },
      onOk() {
        handleRegister();
      },
    });
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case STEPS.VERIFY_URL: {
        setCurrentStep(STEPS.REGISTER);
        break;
      }
      default: {
        setCurrentStep(STEPS.REGISTER);
      }
    }
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case STEPS.REGISTER: {
        if (!!emailSender) {
          confirmRegister();
        } else {
          handleRegister();
        }
        break;
      }
      case STEPS.VERIFY_URL: {
        handleVerify();
        break;
      }
      default: {
        setCurrentStep(STEPS.COMPLETED);
      }
    }
  };

  const settingSteps = useMemo(
    () => [
      {
        title: <strong>Register</strong>,
        description: (
          <RegisterForm form={registerForm} currentStep={currentStep} />
        ),
      },
      {
        title: (
          <strong>
            Verify URL
            <QuestionCircleOutlined
              style={{ marginLeft: 8 }}
              onClick={() => setShowTours(true)}
            />
          </strong>
        ),
        description: (
          <VerifyForm
            form={verifyForm}
            currentStep={currentStep}
            senderEmail={registerForm.getFieldValue('email')}
            getUrlRef={getUrlRef}
          />
        ),
      },
      {
        title: <strong>Completed</strong>,
        description: (
          <Text disabled={currentStep !== STEPS.COMPLETED}>
            Your email sender has been setting
          </Text>
        ),
      },
    ],
    [registerForm, verifyForm, currentStep]
  );

  return (
    <Drawer
      open={open}
      title="Email Sender Settings"
      placement="right"
      size="large"
      contentWrapperStyle={{ maxWidth: '100%' }}
      footer={
        <Space
          style={{
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {currentStep !== STEPS.COMPLETED ? (
            <>
              <Button
                size="large"
                type="text"
                disabled={currentStep <= 0 || loading}
                onClick={handlePrevStep}
              >
                Previous step
              </Button>
              <Button
                size="large"
                type="primary"
                disabled={currentStep > settingSteps.length - 1 || loading}
                onClick={handleNextStep}
              >
                Next step
              </Button>
            </>
          ) : (
            <Button
              size="large"
              type="primary"
              ghost
              onClick={() => setCurrentStep(STEPS.REGISTER)}
            >
              Change email sender
            </Button>
          )}
        </Space>
      }
      onClose={onClose}
    >
      <div>
        {notiContextHolder}
        {modalContextHolder}

        <Steps
          style={{ marginBottom: 12 }}
          direction="vertical"
          current={currentStep}
          items={settingSteps}
        />

        <GetUrlTours
          open={showTours}
          target={getUrlRef.current as HTMLElement}
          onClose={() => setShowTours(false)}
        />
      </div>
    </Drawer>
  );
};

export default EmailSenderSettings;
