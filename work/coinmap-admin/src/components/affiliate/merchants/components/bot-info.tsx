import { ERROR_CODE } from '@/constants/code-constants';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Col,
  Form,
  Row,
  Typography,
  Select,
  Button,
  Tooltip,
  InputNumber,
  FormInstance,
  Collapse,
  theme,
  Popconfirm,
} from 'antd';
import { useEffect, useState } from 'react';
import { deleteMerchantBots, getListBots } from '../fetcher';
import { BOT, BOT_STATUS } from '../interface';
import { BotFormValues, FormValues } from './merchant-create-form';
import type { SelectProps } from 'antd';
import { errorToast } from '@/hook/toast';

const { Text } = Typography;
const { Panel } = Collapse;

interface BotInfoProps {
  form: FormInstance<FormValues>;
}

const filterBotOptions = (
  botOptions: SelectProps['options'],
  bots: BotFormValues[]
) => {
  return (botOptions || []).map((b) => ({
    ...b,
    disabled: (bots || []).some((bot) => bot?.asset_id === b.value),
  }));
};

export default function BotInfo({ form }: BotInfoProps) {
  const [botOptions, setBotOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  useEffect(() => {
    getListBots().then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const botOptions = res.payload.map((bot: BOT) => {
          let label = bot.name;
          if (bot.clone_name) {
            label += ' - ' + bot.clone_name;
          }
          return {
            value: bot.id,
            label: label,
          };
        });
        setBotOptions(botOptions);
      }
    });
  }, []);

  const bots = Form.useWatch('bots', form) ?? [];

  const handleDeteleMerchantBot = (index: number, callback: () => void) => {
    const botSelected = bots[index];
    if (botSelected && botSelected.id) {
      setLoading(true);
      deleteMerchantBots(botSelected.id)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            callback();
            return;
          }
          errorToast(res.message);
        })
        .catch((e: Error) => {
          errorToast(
            JSON.parse(e.message)?.message || 'Failed to delete the bot'
          );
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Collapse
        style={{ background: '#ffffff' }}
        defaultActiveKey={['0', '1']}
        expandIconPosition="end"
        bordered={false}
      >
        <Panel header={<Text strong>TBOT</Text>} key="1" style={panelStyle}>
          <Form.List name="bots">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row key={key} gutter={16}>
                    <Col span={24} lg={9}>
                      <Form.Item
                        {...restField}
                        name={[name, 'asset_id']}
                        label={<Text strong>Bot</Text>}
                        rules={[{ required: true, message: 'Bot is required' }]}
                      >
                        <Select
                          placeholder="Select bot"
                          size="large"
                          options={filterBotOptions(botOptions, bots)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24} lg={9}>
                      <Form.Item
                        {...restField}
                        name={[name, 'commission']}
                        label={<Text strong>Commission</Text>}
                        rules={[
                          { required: true, message: 'Commission is required' },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Enter commission"
                          min={0}
                          max={100}
                          step={0.5}
                          formatter={(value) => `${value}%`}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={22} lg={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'status']}
                        label={<Text strong>Status</Text>}
                        rules={[
                          { required: true, message: 'Status is required' },
                        ]}
                      >
                        <Select
                          placeholder="Select merchant status"
                          size="large"
                          options={Object.values(BOT_STATUS).map((status) => ({
                            label: status,
                            value: status,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2} lg={2}>
                      <Form.Item label={<Text strong></Text>}>
                        <Popconfirm
                          title=""
                          description="Are you sure to delete this?"
                          placement="topLeft"
                          onConfirm={() => {
                            const callback = () => {
                              remove(name);
                            };
                            handleDeteleMerchantBot(index, callback);
                          }}
                          okText="Delete"
                          cancelText="Cancle"
                        >
                          <Tooltip placement="bottom" title="Delete bot">
                            <Button
                              danger
                              size="large"
                              loading={loading}
                              style={{ margin: 'auto', display: 'block' }}
                              icon={<DeleteOutlined />}
                            ></Button>
                          </Tooltip>
                        </Popconfirm>
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    disabled={bots.length === botOptions.length}
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    New bot
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Panel>
        <Panel header={<Text strong>SBOT</Text>} key="2" style={panelStyle}>
          <Text disabled>Comming soon</Text>
        </Panel>
        <Panel header={<Text strong>PKG</Text>} key="3" style={panelStyle}>
          <Text disabled>Comming soon</Text>
        </Panel>
      </Collapse>
    </>
  );
}
