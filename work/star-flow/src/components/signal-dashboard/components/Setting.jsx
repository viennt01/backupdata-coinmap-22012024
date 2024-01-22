import { useCallback, useContext, useState, useEffect } from 'react';
import { APP_SETTING_NAMES } from '@/config/consts/app-setting';
import AppSettingService from '@/fetcher/services/app-setting.service';
import { Divider, Form, notification, Spin, Switch } from 'antd';

import style from './Setting.module.scss';
import { FilterContext } from './SignalTabs';

const SIGNALS_FIELD_NAME = 'SIGNALS';

const DEFAULT_NOTIFY_SETTINGS = {
  ON_OFF_SOUND_NOTIFICATION: true,
  ON_OFF_PUSH_NOTIFICATION: true,
  [SIGNALS_FIELD_NAME]: true,
  bots: {},
};

const SignalSetting = () => {
  const [loading, setLoading] = useState(true);
  const currentFilter = useContext(FilterContext);
  const [form] = Form.useForm();

  // Get settings from BE
  const getCurrentSettings = useCallback(async () => {
    let settings = DEFAULT_NOTIFY_SETTINGS;
    setLoading(true);
    try {
      const res = await AppSettingService.getSettingById(
        APP_SETTING_NAMES.SIGNAL_PLATFORM
      );

      // default all bot is on
      currentFilter.bots.forEach((bot) => {
        settings.bots[bot.code] = true;
      });

      // parse settings json and map to settings
      const values = JSON.parse(res.payload.value);
      if (values.OFF_SIGNALS_BOT?.length) {
        const offBots = values.OFF_SIGNALS_BOT.split(',');
        offBots.forEach((bot) => {
          settings.bots[bot] = false;
        });
      }
      delete values.OFF_SIGNALS_BOT;

      settings = {
        ...settings,
        ...values,
      };
    } catch (error) {
      console.log('getCurrentSettings error');
    } finally {
      form.setFieldsValue(settings);
      setLoading(false);
    }
  }, [currentFilter.bots, form]);

  useEffect(() => {
    getCurrentSettings();
  }, []);

  // Turn on/off all bots signal on big switch signals change
  const onOffBotsBaseOnSignals = useCallback(
    (changedFields) => {
      const signalsField = changedFields.find((field) =>
        field?.name?.includes(SIGNALS_FIELD_NAME)
      );
      if (!signalsField) {
        return;
      }

      const newBotsSettings = {};
      const currentBotsSettings = form.getFieldValue('bots');
      Object.keys(currentBotsSettings).forEach((key) => {
        newBotsSettings[key] = signalsField.value;
      });
      form.setFieldsValue({ bots: newBotsSettings });
    },
    [form]
  );

  // Turn on signals field on turn on a bot field
  const turnOnSignalsField = useCallback(
    (changedFields) => {
      const changedBotField = changedFields.find(
        (field) => field?.name?.includes('bots') && field?.value === true
      );
      if (!changedBotField) {
        return;
      }

      // Stop if current big switch is enabled
      const currentSignalsValue = form.getFieldValue(SIGNALS_FIELD_NAME);
      if (currentSignalsValue) {
        return;
      }

      form.setFieldValue(SIGNALS_FIELD_NAME, true);
    },
    [form]
  );

  const submitForm = useCallback(async () => {
    const values = form.getFieldsValue();
    const botSettings = values?.bots ?? {};
    const offBotSignals = Object.keys(botSettings).filter(
      (key) => botSettings[key] !== true
    );
    values.OFF_SIGNALS_BOT = offBotSignals.join(',');
    delete values.bots;

    try {
      const res = await AppSettingService.updateSetting({
        name: APP_SETTING_NAMES.SIGNAL_PLATFORM,
        value: JSON.stringify(values),
      });

      if (res.error_code !== 'SUCCESS') {
        throw new Error(res.message);
      }
    } catch (error) {
      notification.error({
        message: `An error occured: ${error?.message ?? error}`,
      });
    }
  }, [form]);

  const handleFieldChange = useCallback(
    (changedFields) => {
      onOffBotsBaseOnSignals(changedFields);
      turnOnSignalsField(changedFields);

      submitForm();
    },
    [onOffBotsBaseOnSignals, turnOnSignalsField, submitForm]
  );

  return (
    <Spin spinning={loading}>
      <div className={style.setting}>
        <Form
          form={form}
          labelCol={{ span: 16 }}
          labelAlign="left"
          colon={false}
          onFieldsChange={handleFieldChange}
        >
          <div className={style.formTitle}>Platform settings</div>
          <Form.Item
            label="Sound Notification"
            name="ON_OFF_SOUND_NOTIFICATION"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item
            name="ON_OFF_PUSH_NOTIFICATION"
            valuePropName="checked"
            label={
              <div>
                <div>Push Notification</div>
                <div className={style.description}>
                  You will not receive push notification when turning off
                </div>
              </div>
            }
          >
            <Switch defaultChecked />
          </Form.Item>
          <Divider />
          <Form.Item
            name={SIGNALS_FIELD_NAME}
            label={<div className={style.formTitle}>Signals Bot</div>}
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>
          {currentFilter.bots.map((bot) => (
            <Form.Item
              key={bot.code}
              label={bot.code}
              name={['bots', bot.code]}
              valuePropName="checked"
            >
              <Switch defaultChecked />
            </Form.Item>
          ))}
        </Form>
      </div>
    </Spin>
  );
};

export default SignalSetting;
