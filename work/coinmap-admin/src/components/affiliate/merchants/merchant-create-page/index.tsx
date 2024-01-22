import React from 'react';
import MerchantForm from '../components/merchant-create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { useRouter } from 'next/router';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/merchants/components/merchant-create-form';
import {
  createMerchant,
  MerchantBOTUpdate,
  MerchantCreate,
  updateAdditionalData,
  updateMerchantBot,
} from '../fetcher';
import { PAGE_PERMISSIONS, FEATURE_PERMISSIONS } from '@/constants/merchants';
import { BOT_CATEGORY } from '../interface';
import { ROUTERS } from '@/constants/router';

const GuestsCreatePage = () => {
  const router = useRouter();

  // create new guest
  const handleSubmit = (formValues: FormValues) => {
    const pagePermissions = PAGE_PERMISSIONS.filter((item) =>
      (formValues.page_permission_ids || []).includes(item.id)
    );
    const featurePermissions = FEATURE_PERMISSIONS.filter((item) =>
      (formValues.feature_permission_ids || []).includes(item.id)
    );

    const brokers = Object.keys(formValues.brokers ?? []).map((key) => ({
      code: key,
      name: formValues.brokers[key].name,
      selected: formValues.brokers[key].selected,
      referral_setting: formValues.brokers[key].referral_setting,
    }));

    const _requestData: MerchantCreate = {
      name: formValues.name,
      code: formValues.code,
      email: formValues.email,
      status: formValues.status,
      description: formValues.description,
      domain: formValues.domain,
      config: {
        commission: formValues.commission / 100,
        favicon_url: formValues.favicon_url,
        logo_url: formValues.logo_url,
        banner_url_1: formValues.banner_url_1,
        banner_url_2: formValues.banner_url_2,
        email_logo_url: formValues.email_logo_url,
        email_banner_url: formValues.email_banner_url,
        copyright: formValues.copyright,
        policy_file: formValues.policy_files[0]
          ? {
              name: formValues.policy_files[0].name,
              url: formValues.policy_files[0].url,
            }
          : undefined,
        domain_type: formValues.domain_type,
        theme: {
          template: formValues.template,
          colors: {
            // Surface, background, and error colors
            primary: formValues.color_primary,
            secondary: formValues.color_secondary,
            secondary_lighten_1: formValues.color_secondary_lighten_1,
            secondary_lighten_2: formValues.color_secondary_lighten_2,
            secondary_darken_1: formValues.color_secondary_darken_1,
            secondary_darken_2: formValues.color_secondary_darken_2,
            // Typography and iconography colors
            on_primary: formValues.on_color_primary,
            on_price: formValues.on_color_price,
            on_secondary: formValues.on_color_secondary,
            on_secondary_lighten_1: formValues.on_color_secondary_lighten_1,
            on_secondary_lighten_2: formValues.on_color_secondary_lighten_2,
            on_secondary_darken_1: formValues.on_color_secondary_darken_1,
            on_secondary_darken_2: formValues.on_color_secondary_darken_2,
          },
        },
        support: {
          phone: formValues.support_phone,
          email: formValues.support_email,
          telegram: formValues.support_telegram,
          discord: formValues.support_discord,
        },
        social_media: {
          facebook_url: formValues.facebook_url,
          twitter_url: formValues.twitter_url,
          telegram_url: formValues.telegram_url,
          youtube_url: formValues.youtube_url,
          discord_url: formValues.discord_url,
        },
        permission: {
          pages: pagePermissions,
          features: featurePermissions,
        },
        tracking_id: formValues.tracking_id,
        view_id: formValues.view_id,
        facebook_pixel_id: formValues.facebook_pixel_id,
        update_user_bot: formValues.update_user_bot,
        create_user_merchant: formValues.create_user_merchant,
        user_registration: formValues.user_registration,
        hide_background_texture: formValues.hide_background_texture,
        brokers,
      },
    };

    const botsUpdate = formValues.bots.map((b) => ({
      ...b,
      commission: b.commission / 100,
    }));
    const dataUpdateMerchantBot: MerchantBOTUpdate = {
      category: BOT_CATEGORY.TBOT,
      data: botsUpdate as unknown as MerchantBOTUpdate['data'],
    };

    const additionalData = formValues.faq
      .concat(formValues.package_period)
      .concat(formValues.tbot_period);

    createMerchant(_requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          //res.payload is id of merchant
          updateAdditionalData(additionalData, res.payload)
            .then((res) => {
              if (res.error_code === ERROR_CODE.SUCCESS) {
                successToast('Update FAQ successfully');
                return;
              }
              errorToast(res.message);
            })
            .catch((e: Error) => {
              errorToast(
                JSON.parse(e.message)?.message || 'Failed to update FAQ'
              );
              console.log(e);
            });

          updateMerchantBot(dataUpdateMerchantBot, res.payload)
            .then((res) => {
              if (res.error_code === ERROR_CODE.SUCCESS) {
                successToast('Update bots successfully');
                return router.push(ROUTERS.AFFILIATE_MERCHANT);
              }
              errorToast(res.message);
            })
            .catch((e: Error) => {
              errorToast(
                JSON.parse(e.message)?.message || 'Failed to update guest'
              );
              console.log(e);
            });
          successToast('Create a new merchant successfully');
        }
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to create guest');
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle title="Create new merchant" />
      <MerchantForm create handleSubmit={handleSubmit} />
    </>
  );
};

export default GuestsCreatePage;
