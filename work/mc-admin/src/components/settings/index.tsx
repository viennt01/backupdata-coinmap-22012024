import { Breadcrumb, Button, Form, notification, Space } from 'antd';
import { createContext, useEffect, useState } from 'react';
import { getMerchantInfo, updateMerchantInfo } from './fetcher';
import { MerchantInfo } from '@/interface/merchant-info';
import { DOMAIN_TYPE } from '@/constant/merchant';
import { ERROR_CODE } from '@/constant/error-code';
import SocialMedia from './components/social-media';
import Support from './components/support';
import AnalyticsAndEmailSender from './components/analytics-and-email-sender';
import Website from './components/website';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constant/router';

export interface FormValues {
  // analytics
  facebook_pixel_id: string;
  google_tag_manager_id: string;
  // email sender
  email_logo_url: string;
  email_banner_url: string;
  // support
  support_phone: string;
  support_email: string;
  support_telegram: string;
  support_discord: string;
  // social media
  social_facebook: string;
  social_twitter: string;
  social_telegram: string;
  social_youtube: string;
  social_discord: string;
  // website
  favicon_url: string;
  logo_url: string;
  banner_url_1: string;
  banner_url_2: string;
  copyright: string;
  policy_files: {
    uid: string;
    name: string;
    url: string;
    status: string;
  }[];
  hide_background_texture: boolean;
  // theme
  color_primary: string;
  color_secondary: string;
  color_secondary_lighten_1: string;
  color_secondary_lighten_2: string;
  color_secondary_darken_1: string;
  color_secondary_darken_2: string;
  color_on_primary: string;
  color_on_secondary: string;
  color_on_secondary_lighten_1: string;
  color_on_secondary_lighten_2: string;
  color_on_secondary_darken_1: string;
  color_on_secondary_darken_2: string;
  color_on_price: string;
}

interface SettingsContext {
  refreshData: () => void;
  merchantInfo?: MerchantInfo;
  loading: boolean;
}

export const SettingsContext = createContext<SettingsContext>({
  refreshData: () => null,
  loading: false,
});

export default function SettingsPage() {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [notiApi, contextHolder] = notification.useNotification();
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | undefined>();
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const canSettingWebsite =
    merchantInfo?.config.domain_type === DOMAIN_TYPE.OTHERS;

  const initializeFormValues = (merchantInfo: MerchantInfo) => {
    const analytics = {
      facebook_pixel_id: merchantInfo.config.facebook_pixel_id,
      google_tag_manager_id: merchantInfo.config.google_tag_manager_id,
    };
    const emailSender = {
      email_logo_url: merchantInfo.config.email_logo_url,
      email_banner_url: merchantInfo.config.email_banner_url,
    };
    const support = {
      support_phone: merchantInfo.config.support?.phone,
      support_email: merchantInfo.config.support?.email,
      support_telegram: merchantInfo.config.support?.telegram,
      support_discord: merchantInfo.config.support?.discord,
    };
    const socialMedia = {
      social_facebook: merchantInfo.config.social_media?.facebook_url,
      social_twitter: merchantInfo.config.social_media?.twitter_url,
      social_telegram: merchantInfo.config.social_media?.telegram_url,
      social_youtube: merchantInfo.config.social_media?.youtube_url,
      social_discord: merchantInfo.config.social_media?.discord_url,
    };
    const website = {
      favicon_url: merchantInfo.config.favicon_url,
      logo_url: merchantInfo.config.logo_url,
      banner_url_1: merchantInfo.config.banner_url_1,
      banner_url_2: merchantInfo.config.banner_url_2,
      copyright: merchantInfo.config.copyright,
      policy_files: merchantInfo.config.policy_file
        ? [
            {
              uid: '-1',
              name: merchantInfo.config.policy_file.name,
              url: merchantInfo.config.policy_file.url,
              status: 'done',
            },
          ]
        : [],
      hide_background_texture: merchantInfo.config.hide_background_texture,
    };
    const colors = merchantInfo.config.theme?.colors ?? {};
    const themeColors = Object.keys(colors).reduce((result, key: string) => {
      Object.assign(result, {
        [`color_${key}`]: colors[key as keyof typeof colors],
      });
      return result;
    }, {});

    const formValues = {
      ...analytics,
      ...emailSender,
      ...support,
      ...socialMedia,
      ...website,
      ...themeColors,
    };
    form.setFieldsValue(formValues);
  };

  const fetchMerchantInfo = () => {
    setLoading(true);
    getMerchantInfo()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          if (firstLoad) initializeFormValues(res.payload);
          setMerchantInfo(res.payload);
          setFirstLoad(false);
        }
      })
      .catch((e: Error) => console.log(e))
      .finally(() => setLoading(false));
  };

  const handleUpdateSettings = (formValues: FormValues) => {
    setLoading(true);
    const analytics = {
      facebook_pixel_id: formValues.facebook_pixel_id,
      google_tag_manager_id: formValues.google_tag_manager_id,
    };
    const emailSender = {
      email_logo_url: formValues.email_logo_url,
      email_banner_url: formValues.email_banner_url,
    };
    const support = {
      phone: formValues.support_phone,
      email: formValues.support_email,
      telegram: formValues.support_telegram,
      discord: formValues.support_discord,
    };
    const social_media = {
      facebook_url: formValues.social_facebook,
      twitter_url: formValues.social_twitter,
      telegram_url: formValues.social_telegram,
      youtube_url: formValues.social_youtube,
      discord_url: formValues.social_discord,
    };
    const website = {
      favicon_url: formValues.favicon_url,
      logo_url: formValues.logo_url,
      banner_url_1: formValues.banner_url_1,
      banner_url_2: formValues.banner_url_2,
      copyright: formValues.copyright,
      policy_file: formValues.policy_files[0]
        ? {
            name: formValues.policy_files[0].name,
            url: formValues.policy_files[0].url,
          }
        : null,
      hide_background_texture: formValues.hide_background_texture,
    };
    const colors = {
      primary: formValues.color_primary,
      secondary: formValues.color_secondary,
      secondary_lighten_1: formValues.color_secondary_lighten_1,
      secondary_lighten_2: formValues.color_secondary_lighten_2,
      secondary_darken_1: formValues.color_secondary_darken_1,
      secondary_darken_2: formValues.color_secondary_darken_2,
      on_primary: formValues.color_on_primary,
      on_price: formValues.color_on_price,
      on_secondary: formValues.color_on_secondary,
      on_secondary_lighten_1: formValues.color_on_secondary_lighten_1,
      on_secondary_lighten_2: formValues.color_on_secondary_lighten_2,
      on_secondary_darken_1: formValues.color_on_secondary_darken_1,
      on_secondary_darken_2: formValues.color_on_secondary_darken_2,
    };

    const requestData = {
      config: {
        ...analytics,
      },
    };
    if (canSettingWebsite) {
      Object.assign(requestData.config, {
        ...emailSender,
        support,
        social_media,
        ...website,
        theme: {
          colors,
        },
      });
    }

    updateMerchantInfo(requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          notiApi.success({
            message: 'Changes saved',
            description: 'All your changes has been saved',
            placement: 'topRight',
            duration: 3,
          });
        }
      })
      .catch((err) => {
        const res = JSON.parse(err.message);
        notiApi.error({
          message: 'Update failed',
          description: res.message,
          placement: 'topRight',
          duration: 3,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMerchantInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        refreshData: fetchMerchantInfo,
        merchantInfo,
        loading,
      }}
    >
      {contextHolder}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Merchant settings</Breadcrumb.Item>
      </Breadcrumb>
      <Form
        form={form}
        layout="vertical"
        scrollToFirstError
        onFinish={handleUpdateSettings}
      >
        <div>
          <AnalyticsAndEmailSender
            form={form}
            canSettingWebsite={canSettingWebsite}
          />
        </div>
        <div style={{ marginTop: 24 }} hidden={!canSettingWebsite}>
          <SocialMedia />
        </div>
        <div style={{ marginTop: 24 }} hidden={!canSettingWebsite}>
          <Support />
        </div>
        <div style={{ marginTop: 24 }} hidden={!canSettingWebsite}>
          <Website form={form} />
        </div>

        <Space
          style={{
            position: 'sticky',
            bottom: 0,
            width: '100%',
            justifyContent: 'end',
            padding: '24px 0',
            background: '#f5f5f5',
          }}
        >
          <Button
            type="text"
            size="large"
            onClick={() => router.push(ROUTERS.HOME)}
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={loading}
          >
            Submit
          </Button>
        </Space>
      </Form>
    </SettingsContext.Provider>
  );
}
