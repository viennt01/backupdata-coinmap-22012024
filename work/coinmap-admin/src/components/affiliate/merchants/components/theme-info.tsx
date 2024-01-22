import React from 'react';
import {
  Form,
  Input,
  Col,
  Row,
  Typography,
  Avatar,
  InputProps,
  Tooltip,
  FormInstance,
  Card,
  Select,
} from 'antd';
import { FormValues } from './merchant-create-form';
import { generateVariantColors } from '@/utils/color';
import { TEMPLATE_TYPE } from '../interface';

const { Title, Text } = Typography;

interface ThemeInfoProps {
  form: FormInstance<FormValues>;
}

interface ColorPickerProps extends InputProps {
  title: string;
}

const PATTERN_COLOR = /^#([0-9a-f]{3}){2}$/i;

const colorRules = [
  {
    required: true,
    message: 'Color is required',
  },
  {
    pattern: PATTERN_COLOR,
    message: 'Invalid color',
  },
];

const ColorPicker = ({ title, ...props }: ColorPickerProps) => {
  return (
    <Tooltip title={title} placement="bottom">
      <div style={{ display: 'flex', width: '100%', gap: 8 }}>
        <Avatar
          size="large"
          shape="square"
          style={{ background: `${props.value}`, border: '1px solid #d9d9d9' }}
        />
        <Input
          style={{ flex: 1 }}
          size="large"
          placeholder="#FFFFFF"
          onFocus={(e) => e.target.select()}
          {...props}
        />
      </div>
    </Tooltip>
  );
};

const ThemeInfo = ({ form }: ThemeInfoProps) => {
  const normalize = (value: string) => {
    return `#${value.replaceAll('#', '').slice(0, 6).toUpperCase()}`;
  };

  const handleSecondaryColorChange: ColorPickerProps['onChange'] = (e) => {
    const hexColor = normalize(e.target.value);
    const validColor = PATTERN_COLOR.test(hexColor);
    if (validColor) {
      const colors = generateVariantColors(hexColor, 2);
      form.setFieldsValue({
        color_secondary_lighten_1: colors.light[0],
        color_secondary_lighten_2: colors.light[1],
        color_secondary_darken_1: colors.dark[0],
        color_secondary_darken_2: colors.dark[1],
      });
    }
  };

  return (
    <>
      <Title level={3}>Theme</Title>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item name="template" label={<Text strong>Template</Text>}>
            <Select
              placeholder="Select template"
              size="large"
              options={Object.values(TEMPLATE_TYPE).map((type) => ({
                label: type,
                value: type,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Card
        title="Surface, background, and error colors"
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col lg={12} md={24}>
            <Row>
              <Col lg={12} md={24}>
                <Form.Item
                  name="color_primary"
                  label={<Text strong>Primary </Text>}
                  rules={colorRules}
                  normalize={normalize}
                >
                  <ColorPicker title="Primary" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col lg={12} md={24}>
            <Form.Item label={<Text strong>Secondary </Text>} required>
              <Row gutter={16}>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="color_secondary"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker
                      title="Secondary"
                      onChange={handleSecondaryColorChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="color_secondary_lighten_1"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="Lighten 1" />
                  </Form.Item>
                </Col>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="color_secondary_lighten_2"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="Lighten 2" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="color_secondary_darken_1"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="Darken 1" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="color_secondary_darken_2"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="Darken 2" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Typography and iconography colors">
        <Row gutter={16}>
          <Col lg={12} md={24}>
            <Row>
              <Col lg={12} md={24}>
                <Form.Item
                  name="on_color_primary"
                  label={<Text strong>Primary </Text>}
                  rules={colorRules}
                  normalize={normalize}
                >
                  <ColorPicker title="On Primary" />
                </Form.Item>
                <Form.Item
                  name="on_color_price"
                  label={<Text strong>Price </Text>}
                  rules={colorRules}
                  normalize={normalize}
                >
                  <ColorPicker title="On Price" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col lg={12} md={24}>
            <Form.Item label={<Text strong>Secondary </Text>} required>
              <Row gutter={16}>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="on_color_secondary"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="On Secondary" />
                  </Form.Item>
                </Col>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="on_color_secondary_lighten_1"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="On Lighten 1" />
                  </Form.Item>
                </Col>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="on_color_secondary_lighten_2"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="On Lighten 2" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="on_color_secondary_darken_1"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="On Darken 1" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24} lg={6}>
                  <Form.Item
                    name="on_color_secondary_darken_2"
                    rules={colorRules}
                    normalize={normalize}
                  >
                    <ColorPicker title="On Darken 2" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ThemeInfo;
