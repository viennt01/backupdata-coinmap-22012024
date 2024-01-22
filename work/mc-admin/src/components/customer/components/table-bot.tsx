import { ERROR_CODE } from '@/constant/error-code';
import { successToast, errorToast } from '@/hook/toast';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Popconfirm,
  Button,
  SelectProps,
  Table,
  Tooltip,
  Drawer,
  Form,
  Select,
  Input,
  Card,
  Typography,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  addCustomerBot,
  deleteBotOfCustomer,
  getBotTradingListByMechant,
  getBotTradingListOfUser,
  updateStatusBot,
} from '../fetcher';
import {
  BotByUserId,
  USER_BOT_STATUS,
  BOT_TYPE,
  CreateBotOfCustomer,
  USER_BOT_COLORS,
} from '../interface';
import { AppContext } from '@/app-context';

const { Title } = Typography;

const filterBotOptions = (
  botOptions: SelectProps['options'],
  bots: BotByUserId[]
) => {
  return (botOptions || []).map((b) => ({
    ...b,
    disabled: (bots || []).some((bot) => bot?.id === b.value),
  }));
};

const BOT_TYPE_OPTIONS = Object.values(BOT_TYPE).map((status) => ({
  label: status,
  value: status,
}));

const initialValues: CreateBotOfCustomer = {
  asset_id: '',
  quantity: '',
  type: '',
};
export default function TableBot() {
  const router = useRouter();
  const [botListOfUser, setBotListOfUser] = useState<BotByUserId[]>([]);
  const [botSelected, setBotSelected] = useState<BotByUserId | null>(null);
  const [openDrawerUpdateBot, setOpenDrawerUpdateBot] =
    useState<boolean>(false);
  const [botOptions, setBotOptions] = useState<SelectProps['options']>([]);
  const [form] = Form.useForm();
  const { merchantInfo } = useContext(AppContext);

  const { id } = router.query;
  const canUpdateUserBot = merchantInfo?.config.update_user_bot;

  const fetchListBotOfCustomer = () => {
    getBotTradingListOfUser(id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setBotListOfUser(res.payload);
        }
      })
      .catch((e: Error) => {
        console.log(e);
        router.push('/customer/list');
      });
  };

  useEffect(() => {
    if (!id) return;
    fetchListBotOfCustomer();
    getBotTradingListByMechant().then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const botOptions = res.payload.rows.map((bot) => ({
          value: bot.asset_id,
          label: bot.name,
        }));
        setBotOptions(botOptions);
      }
    });
  }, [id]);

  const handleEditBot = (bot: BotByUserId) => {
    setBotSelected(bot);
    setOpenDrawerUpdateBot(true);
    form.setFieldsValue({
      asset_id: bot.id,
      quantity: bot.quantity,
      type: bot.package_type,
      status: bot.status,
    });
  };
  const handleCloseDrawer = () => {
    setBotSelected(null);
    setOpenDrawerUpdateBot(false);
  };

  const handleCreateNewBot = (formValues: CreateBotOfCustomer) => {
    const data = {
      rows: [formValues],
    };
    addCustomerBot(data, id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          fetchListBotOfCustomer();
          handleCloseDrawer();
          successToast('Add bot for customer successfully');
          return;
        }
        errorToast(res.message);
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed ');
        console.log(e);
      });
  };

  const handleUpdateBot = (formValues: CreateBotOfCustomer) => {
    if (formValues.status) {
      const userBotId = botListOfUser.find((b) => b.id === formValues.asset_id);
      if (userBotId) {
        updateStatusBot(formValues.status, userBotId.user_bot_id)
          .then((res) => {
            if (res.error_code === ERROR_CODE.SUCCESS) {
              fetchListBotOfCustomer();
              handleCloseDrawer();
              successToast('Bot status updated successfully');
              return;
            }
            errorToast(res.message);
          })
          .catch((e: Error) => {
            errorToast(JSON.parse(e.message)?.message || 'Failed');
            console.log(e);
          });
      }
    }
  };

  const handleSubmit = (formValues: CreateBotOfCustomer) => {
    if (botSelected) {
      handleUpdateBot(formValues);
    } else {
      handleCreateNewBot(formValues);
    }
  };

  const handleDeleteBot = (record: BotByUserId) => {
    deleteBotOfCustomer(record.user_bot_id)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          fetchListBotOfCustomer();
          successToast('Delete successfully');
          return;
        }
        errorToast(res.message);
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed');
        console.log(e);
      });
  };

  const columns: ColumnsType<BotByUserId> = useMemo(
    () => [
      {
        title: 'A.I Trading',
        dataIndex: 'name',
        align: 'left',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        align: 'center',
      },
      {
        title: 'Type',
        dataIndex: 'package_type',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (value: USER_BOT_STATUS) => (
          <Tag color={USER_BOT_COLORS[value]}>{value}</Tag>
        ),
      },
      {
        title: '',
        width: '120px',
        align: 'center',
        fixed: 'right',
        render: (_, record: BotByUserId) => {
          return (
            <>
              <Tooltip placement="topLeft" title={'Edit'}>
                <Button
                  type="dashed"
                  onClick={() => handleEditBot(record)}
                  icon={<EditOutlined />}
                ></Button>
              </Tooltip>
              <Popconfirm
                title="Are you sure to delete this?"
                placement="topRight"
                okText="Delete"
                onConfirm={() => handleDeleteBot(record)}
              >
                <Button
                  hidden={!canUpdateUserBot}
                  style={{ marginLeft: 8 }}
                  type="dashed"
                  danger
                  icon={<DeleteOutlined />}
                ></Button>
              </Popconfirm>
            </>
          );
        },
      },
    ],
    [canUpdateUserBot]
  );

  return (
    <>
      <Title
        style={{
          marginBottom: 24,
          textAlign: 'center',
        }}
        level={3}
      >
        List A.I Trading of customer
      </Title>
      <Table
        style={{
          marginBottom: 24,
        }}
        bordered
        dataSource={botListOfUser}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      <Button
        hidden={!canUpdateUserBot}
        disabled={
          botOptions &&
          botListOfUser &&
          botListOfUser.length === botOptions.length
        }
        onClick={() => {
          form.setFieldsValue({
            asset_id: '',
            quantity: '',
            type: '',
            status: USER_BOT_STATUS.ACTIVE,
          });
          setOpenDrawerUpdateBot(true);
        }}
        icon={<PlusOutlined />}
      >
        New A.I Trading
      </Button>
      <Drawer
        title="A.I TRADING"
        placement="right"
        onClose={handleCloseDrawer}
        open={openDrawerUpdateBot}
      >
        <Card>
          <Form
            name="basic"
            form={form}
            initialValues={initialValues}
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="asset_id"
              label={'A.I Trading'}
              rules={[{ required: true, message: 'Please select A.I Trading' }]}
            >
              <Select
                disabled={Boolean(botSelected)}
                placeholder="Select gender"
                options={filterBotOptions(botOptions, botListOfUser)}
              />
            </Form.Item>
            <Form.Item
              name={'type'}
              label={'Type'}
              rules={[{ required: true, message: 'Please select type' }]}
            >
              <Select
                disabled={Boolean(botSelected)}
                placeholder="Select gender"
                options={BOT_TYPE_OPTIONS}
              />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: 'Please input quantity' }]}
            >
              <Input
                disabled={Boolean(botSelected)}
                placeholder="Enter quantity"
                type="number"
                min={1}
              />
            </Form.Item>

            <Form.Item
              name={'status'}
              label={'Status'}
              rules={[{ required: true, message: 'Please input gender' }]}
            >
              <Select
                placeholder="Select status"
                disabled={
                  !Boolean(botSelected) ||
                  !(
                    botSelected &&
                    botSelected.status === USER_BOT_STATUS.INACTIVE_BY_SYSTEM
                  )
                }
                options={Object.values(USER_BOT_STATUS).map((status) => {
                  if (status === USER_BOT_STATUS.INACTIVE) {
                    return {
                      label: status,
                      value: status,
                    };
                  }
                  return {
                    label: status,
                    value: status,
                    disabled: true,
                  };
                })}
              />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Button block onClick={handleCloseDrawer}>
                  Cancel
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  disabled={
                    !!botSelected &&
                    botSelected.status !== USER_BOT_STATUS.INACTIVE_BY_SYSTEM
                  }
                  block
                  type="primary"
                  htmlType="submit"
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Drawer>
    </>
  );
}
