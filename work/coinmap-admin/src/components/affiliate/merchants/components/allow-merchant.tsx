import React from 'react';
import { Form, Col, Row, Typography, Switch, Modal, FormInstance } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FormValues } from './merchant-create-form';

const { Title, Text } = Typography;

interface AllowMerchant {
  form: FormInstance<FormValues>;
}
const AllowMerchant: React.FC<AllowMerchant> = ({ form }: AllowMerchant) => {
  const [modal, contextHolder] = Modal.useModal();
  const dataUpdateUserBot = Form.useWatch('update_user_bot', form) ?? false;
  const dataCreateUserMerchant =
    Form.useWatch('create_user_merchant', form) ?? false;

  const handleClickShowBoxConform = (
    Notification: string,
    typeModal: string
  ) => {
    modal.confirm({
      title: 'Conform action',
      content: <Text>{Notification}</Text>,
      onCancel() {
        if (typeModal === 'updateBotFroUser') {
          form.setFieldValue('update_user_bot', dataUpdateUserBot);
        } else {
          form.setFieldValue('create_user_merchant', dataCreateUserMerchant);
        }
      },
    });
  };

  const handleChangeSwitch = (checked: boolean) => {
    const typeModal = 'updateBotFroUser';
    const NotificationOk =
      'Are you sure to allow merchant to update bot for user?';
    const NotificationCancel =
      'Are you sure you do not allow merchant to update bot for user?';
    checked
      ? handleClickShowBoxConform(NotificationOk, typeModal)
      : handleClickShowBoxConform(NotificationCancel, typeModal);
  };

  const handleChangeSwitchCreateUsers = (checked: boolean) => {
    const typeModal = 'createUserMerchant';
    const NotificationOk = 'Are you sure to allow merchants to create users?';
    const NotificationCancel =
      'Are you sure you do not allow merchants to create users?';

    checked
      ? handleClickShowBoxConform(NotificationOk, typeModal)
      : handleClickShowBoxConform(NotificationCancel, typeModal);
  };

  return (
    <>
      {contextHolder}
      <Title level={3}>Permission to merchant</Title>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="update_user_bot"
            label={<Text strong>Update bot for user</Text>}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={handleChangeSwitch}
              checked={dataUpdateUserBot}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="create_user_merchant"
            label={<Text strong>Create user</Text>}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={handleChangeSwitchCreateUsers}
              checked={dataCreateUserMerchant}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AllowMerchant;
