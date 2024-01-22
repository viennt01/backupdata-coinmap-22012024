import React from 'react';
import { Form, Col, Row, Typography, FormInstance } from 'antd';
import { FormValues } from '@/components/settings';
import { generateVariantColors } from '@/utils/color';
import ColorPicker, { ColorPickerProps } from '../common/color-picker';

const { Text } = Typography;

interface Props {
  form: FormInstance<FormValues>;
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

const Theme = ({ form }: Props) => {
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
      <Text>
        <strong>Website color setting</strong> (Surface, background, and error
        colors)
      </Text>
      <Row gutter={16}>
        <Col span={24} lg={8}>
          <Row>
            <Col span={24} lg={12}>
              <Form.Item
                name="color_primary"
                label="Primary"
                rules={colorRules}
                normalize={normalize}
              >
                <ColorPicker title="Primary" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24} lg={16}>
          <Form.Item label="Secondary" required>
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

      <Text>
        <strong>Website typography color setting</strong> (Typography,
        iconography colors)
      </Text>
      <Row gutter={16}>
        <Col span={24} lg={8}>
          <Row gutter={16}>
            <Col span={24} lg={12}>
              <Form.Item
                name="color_on_primary"
                label="Primary"
                rules={colorRules}
                normalize={normalize}
              >
                <ColorPicker title="On Primary" />
              </Form.Item>
            </Col>
            <Col span={24} lg={12}>
              <Form.Item
                name="color_on_price"
                label="Price"
                rules={colorRules}
                normalize={normalize}
              >
                <ColorPicker title="On Price" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24} lg={16}>
          <Form.Item label="Secondary" required>
            <Row gutter={16}>
              <Col span={24} lg={6}>
                <Form.Item
                  name="color_on_secondary"
                  rules={colorRules}
                  normalize={normalize}
                >
                  <ColorPicker title="On Secondary" />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item
                  name="color_on_secondary_lighten_1"
                  rules={colorRules}
                  normalize={normalize}
                >
                  <ColorPicker title="On Lighten 1" />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item
                  name="color_on_secondary_lighten_2"
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
                  name="color_on_secondary_darken_1"
                  rules={colorRules}
                  normalize={normalize}
                >
                  <ColorPicker title="On Darken 1" />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item
                  name="color_on_secondary_darken_2"
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
    </>
  );
};

export default Theme;
