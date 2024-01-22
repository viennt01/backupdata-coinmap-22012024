import React, { useEffect, useState } from 'react';
import { Button, Form, Space, Modal, Typography } from 'antd';
import { useRouter } from 'next/router';
import { ERROR_CODE, FIELD_TYPE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { MERCHANTS_STATUS, DOMAIN_TYPE } from '@/constants/merchants';
import {
  FormAdditionalData,
  MerchantCreate,
  getListMerchantBots,
  getMerchantDetail,
  resetMerchantPassword,
} from '../fetcher';
import CustomCard from '@/components/commons/custom-card';
import ProfileInfo from './profile-info';
import WebsiteInfo from './website-info';
import ThemeInfo from './theme-info';
import SocialInfo from './social-info';
import SupportInfo from './support-info';
import PermissionInfo from './permission-info';
import { LogoutOutlined } from '@ant-design/icons';
import BotInfo from './bot-info';
import AllowMerchant from './allow-merchant';
import { Merchant_BOT, BOT_STATUS, TEMPLATE_TYPE } from '../interface';
import Faq from './faq';
import Package from './package';
import EmailSender from './email-sender';
import BrokerInfo from './broker-info';
import CollapseCard from '@/components/commons/collapse-card';
import { ROUTERS } from '@/constants/router';

const { Text } = Typography;

interface MerchantFormProps {
  create: boolean;
  handleSubmit: (formValues: FormValues) => void;
  handleDelete?: () => void;
}

export interface BotFormValues {
  id?: string;
  asset_id: string;
  commission: number;
  status: BOT_STATUS;
}

export interface BrokerFormValues {
  [key: string]: {
    name: string;
    selected: boolean;
    referral_setting: { [key: string]: FIELD_TYPE };
  };
}

export interface FormValues {
  name: string;
  code: string;
  email: string;
  status: MERCHANTS_STATUS;
  description: string;
  domain: string;
  commission: number;
  favicon_url: string;
  logo_url: string;
  banner_url_1: string;
  banner_url_2: string;
  email_logo_url: string;
  email_banner_url: string;
  copyright: string;
  policy_files: {
    uid: string;
    name: string;
    url: string;
    status: string;
  }[];
  domain_type: DOMAIN_TYPE;
  template: TEMPLATE_TYPE;
  color_primary: string;
  color_secondary: string;
  color_secondary_lighten_1: string;
  color_secondary_lighten_2: string;
  color_secondary_darken_1: string;
  color_secondary_darken_2: string;

  on_color_primary: string;
  on_color_price: string;
  on_color_secondary: string;
  on_color_secondary_lighten_1: string;
  on_color_secondary_lighten_2: string;
  on_color_secondary_darken_1: string;
  on_color_secondary_darken_2: string;

  support_phone: string;
  support_email: string;
  support_telegram: string;
  support_discord: string;
  facebook_url: string;
  twitter_url: string;
  telegram_url: string;
  youtube_url: string;
  discord_url: string;
  page_permission_ids: string[];
  feature_permission_ids: string[];
  tracking_id: string;
  facebook_pixel_id: string;
  view_id: string;
  bots: BotFormValues[];
  update_user_bot: boolean;
  create_user_merchant: boolean;
  user_registration: boolean;
  hide_background_texture: boolean;
  faq: FormAdditionalData[];
  package_period: FormAdditionalData[];
  tbot_period: FormAdditionalData[];
  brokers: BrokerFormValues;
}

const initialValue = {
  name: '',
  code: '',
  email: '',
  status: MERCHANTS_STATUS.ACTIVE,
  description: '',
  domain: '',
  commission: 5,
  favicon_url: '',
  logo_url: '',
  banner_url_1: '',
  banner_url_2: '',
  email_logo_url: '',
  email_banner_url: '',
  copyright: '',
  policy_files: [],
  domain_type: DOMAIN_TYPE.OTHERS,
  template: TEMPLATE_TYPE.AI_TRADING,
  color_primary: '#2864B4',
  color_secondary: '#0A1D38',
  color_secondary_lighten_1: '#475164',
  color_secondary_lighten_2: '#5A7490',
  color_secondary_darken_1: '#090E19',
  color_secondary_darken_2: '#050A0F',

  on_color_primary: '#2864B4',
  on_color_price: '#C8B285',
  on_color_secondary: '#FFFFFF',
  on_color_secondary_lighten_1: '#FFFFFF',
  on_color_secondary_lighten_2: '#FFFFFF',
  on_color_secondary_darken_1: '#FFFFFF',
  on_color_secondary_darken_2: '#FFFFFF',

  support_phone: '',
  support_email: '',
  support_telegram: '',
  support_discord: '',
  facebook_url: '',
  twitter_url: '',
  telegram_url: '',
  youtube_url: '',
  discord_url: '',
  page_permission: [],
  feature_permission: [],
  tracking_id: '',
  view_id: '',
  bots: [],
  update_user_bot: false,
  create_user_merchant: false,
  user_registration: false,
  hide_background_texture: false,
  faq: [],
  package_period: [],
  tbot_period: [],
  brokers: {},

  // name: '1ándakj',
  // code: '11111',
  // email: '123123111@gmail.com',
  // status: 'ACTIVE',
  // description: '',
  // domain: '11',
  // commission: null,
  // favicon_url:
  //   'https://static-dev.cextrading.io/images/xtrading-user-service/1682483280893.png',
  // logo_url:
  //   'https://static-dev.cextrading.io/images/xtrading-user-service/1682483283017.png',
  // footer_logo_url:
  //   'https://static-dev.cextrading.io/images/xtrading-user-service/1682483285433.png',
  // banner_url_1:
  //   'https://static-dev.cextrading.io/images/xtrading-user-service/1682483287325.png',
  // banner_url_2:
  //   'https://static-dev.cextrading.io/images/xtrading-user-service/1682483289199.png',
  // home_path: '/',
  // copyright: '1',
  // domain_type: 'COINMAP',
  // facebook_url: '',
  // twitter_url: '',
  // telegram_url: '',
  // youtube_url: '',
  // discord_url: '',
  // tracking_id: '',
  // view_id: '',
  // update_user_bot: false,
  // create_user_merchant: false,
};

const MerchantForm: React.FC<MerchantFormProps> = ({
  create,
  handleSubmit,
}) => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [modal, contextHolder] = Modal.useModal();
  const [merchantInfo, setMerchantInfo] = useState<MerchantCreate>();

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;
    getListMerchantBots(id as string).then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const bots = res.payload.rows.map((bot: Merchant_BOT) => ({
          id: bot.id,
          asset_id: bot.asset_id,
          commission: bot.commission * 100,
          status: bot.status,
        }));
        form.setFieldValue('bots', bots);
      }
    });
    getMerchantDetail(id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setMerchantInfo(res.payload);
          const page_permission_ids = (
            res.payload.config.permission?.pages ?? []
          ).map((item: { id: string }) => item.id);
          const feature_permission_ids = (
            res.payload.config.permission?.features ?? []
          ).map((item: { id: string }) => item.id);

          const theme = res.payload.config.theme
            ? {
                // Type template
                template:
                  res.payload.config.theme.template || TEMPLATE_TYPE.AI_TRADING,

                // Surface, background, and error colors
                color_primary: res.payload.config.theme.colors.primary,
                color_secondary: res.payload.config.theme.colors.secondary,
                color_secondary_lighten_1:
                  res.payload.config.theme.colors.secondary_lighten_1,
                color_secondary_lighten_2:
                  res.payload.config.theme.colors.secondary_lighten_2,
                color_secondary_darken_1:
                  res.payload.config.theme.colors.secondary_darken_1,
                color_secondary_darken_2:
                  res.payload.config.theme.colors.secondary_darken_2,

                // Typography and iconography colors
                on_color_primary: res.payload.config.theme.colors.on_primary,
                on_color_price: res.payload.config.theme.colors.on_price,
                on_color_secondary:
                  res.payload.config.theme.colors.on_secondary,
                on_color_secondary_lighten_1:
                  res.payload.config.theme.colors.on_secondary_lighten_1,
                on_color_secondary_lighten_2:
                  res.payload.config.theme.colors.on_secondary_lighten_2,
                on_color_secondary_darken_1:
                  res.payload.config.theme.colors.on_secondary_darken_1,
                on_color_secondary_darken_2:
                  res.payload.config.theme.colors.on_secondary_darken_2,
              }
            : {};

          form.setFieldsValue({
            name: res.payload.name,
            code: res.payload.code,
            email: res.payload.email,
            status: res.payload.status,
            description: res.payload.description,
            domain: res.payload.domain,
            commission: res.payload.config.commission * 100,
            favicon_url: res.payload.config.favicon_url,
            logo_url: res.payload.config.logo_url,
            banner_url_1: res.payload.config.banner_url_1,
            banner_url_2: res.payload.config.banner_url_2,
            email_logo_url: res.payload.config.email_logo_url,
            email_banner_url: res.payload.config.email_banner_url,
            copyright: res.payload.config.copyright,
            policy_files: res.payload.config.policy_file
              ? [
                  {
                    uid: '-1',
                    name: res.payload.config.policy_file.name,
                    url: res.payload.config.policy_file.url,
                    status: 'done',
                  },
                ]
              : [],
            domain_type: res.payload.config.domain_type,
            ...theme,
            support_phone: res.payload.config.support?.phone,
            support_email: res.payload.config.support?.email,
            support_telegram: res.payload.config.support?.telegram,
            support_discord: res.payload.config.support?.discord,
            facebook_url: res.payload.config.social_media?.facebook_url,
            twitter_url: res.payload.config.social_media?.twitter_url,
            telegram_url: res.payload.config.social_media?.telegram_url,
            youtube_url: res.payload.config.social_media?.youtube_url,
            discord_url: res.payload.config.social_media?.discord_url,
            page_permission_ids,
            feature_permission_ids,
            tracking_id: res.payload.config.tracking_id,
            facebook_pixel_id: res.payload.config.facebook_pixel_id,
            view_id: res.payload.config.view_id,
            update_user_bot: res.payload.config?.update_user_bot,
            create_user_merchant: res.payload.config?.create_user_merchant,
            user_registration: res.payload.config?.user_registration,
            hide_background_texture:
              res.payload.config?.hide_background_texture,
          });
        } else {
          errorToast('Failed to get merchant details');
          router.push(ROUTERS.AFFILIATE_MERCHANT);
        }
      })
      .catch((e: Error) => {
        errorToast('Failed to get merchant details');
        console.log(e);
        router.push(ROUTERS.AFFILIATE_MERCHANT);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectPage = (path: string) => () => {
    router.push(path);
  };

  const handleClickResetPassword = () => {
    modal.confirm({
      title: 'Reset password',
      icon: <LogoutOutlined />,
      content: (
        <Text>
          Do you want to reset password? New password will be send to email of
          merchant automatically.
        </Text>
      ),
      onOk() {
        resetMerchantPassword(router.query.id as string)
          .then(() => {
            successToast('Password has been reset successfully');
          })
          .catch((e: Error) => {
            console.log(e);
            errorToast('Reset password failed');
          });
      },
    });
  };

  const onFinish = (formValues: FormValues) => {
    handleSubmit(formValues);
  };

  return (
    <>
      {contextHolder}

      <Form
        initialValues={initialValue}
        form={form}
        layout="vertical"
        scrollToFirstError
        onFinish={onFinish}
      >
        <CustomCard style={{ marginBottom: '24px' }}>
          <ProfileInfo create={create} />
        </CustomCard>

        <CustomCard style={{ marginBottom: '24px' }}>
          <ThemeInfo form={form} />
        </CustomCard>

        <CustomCard style={{ marginBottom: '24px' }}>
          <AllowMerchant form={form} />
        </CustomCard>

        <CollapseCard title="Email Sender" style={{ marginBottom: '24px' }}>
          <EmailSender form={form} />
        </CollapseCard>

        <CollapseCard title="Website" style={{ marginBottom: '24px' }}>
          <WebsiteInfo form={form} />
        </CollapseCard>

        <CollapseCard title="Social Media" style={{ marginBottom: '24px' }}>
          <SocialInfo />
        </CollapseCard>

        <CollapseCard title="Support" style={{ marginBottom: '24px' }}>
          <SupportInfo />
        </CollapseCard>

        <CollapseCard title="Broker" style={{ marginBottom: '24px' }}>
          <BrokerInfo form={form} merchantInfo={merchantInfo} />
        </CollapseCard>

        <CollapseCard title="BOT" style={{ marginBottom: '24px' }}>
          <BotInfo form={form} />
        </CollapseCard>

        <CollapseCard title="Quick selection" style={{ marginBottom: '24px' }}>
          <PermissionInfo form={form} />
        </CollapseCard>

        <CollapseCard title="FAQ" style={{ marginBottom: '24px' }}>
          <Faq form={form} />
        </CollapseCard>

        <CollapseCard title="Subscription" style={{ marginBottom: '24px' }}>
          <Package form={form} />
        </CollapseCard>

        <CustomCard
          style={{
            marginBottom: '24px',
            position: 'sticky',
            bottom: 0,
            zIndex: 11,
          }}
        >
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space style={{ columnGap: '16px' }}>
              <Button
                type="default"
                size="large"
                onClick={redirectPage(ROUTERS.AFFILIATE_MERCHANT)}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Submit
              </Button>
            </Space>
            {!create && (
              <Button
                type="primary"
                danger
                size="large"
                onClick={handleClickResetPassword}
              >
                Reset Password
              </Button>
            )}
          </Space>
        </CustomCard>
      </Form>
    </>
  );
};

export default MerchantForm;
