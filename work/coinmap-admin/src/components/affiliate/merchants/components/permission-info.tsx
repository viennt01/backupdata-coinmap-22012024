import React, { useEffect, useState } from 'react';
import {
  Form,
  Col,
  Row,
  Typography,
  Tag,
  Space,
  FormInstance,
  Checkbox,
  Divider,
} from 'antd';
import {
  PAGE_PERMISSIONS,
  FEATURE_PERMISSIONS,
  PERMISSION_ACTIONS,
  ACTION_COLORS,
  QUICK_SELECTION,
  DEFAULT_PERMISSION_ALL,
  DEFAULT_PERMISSION_MERCHANT,
  DEFAULT_PERMISSION_CUSTOM,
} from '@/constants/merchants';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FormValues } from './merchant-create-form';
const { Title } = Typography;

interface PermissionInfoProps {
  form: FormInstance<FormValues>;
}
const plainOptions = [
  { label: 'All (CM KOL)', value: QUICK_SELECTION.ALL },
  { label: 'Merchant', value: QUICK_SELECTION.MERCHANT },
  { label: 'Custom', value: QUICK_SELECTION.CUSTOM },
];

const defaultSelection = {
  [QUICK_SELECTION.ALL]: DEFAULT_PERMISSION_ALL,
  [QUICK_SELECTION.MERCHANT]: DEFAULT_PERMISSION_MERCHANT,
  [QUICK_SELECTION.CUSTOM]: DEFAULT_PERMISSION_CUSTOM,
};

const PermissionInfo = ({ form }: PermissionInfoProps) => {
  const [quickSelection, setQuickSelection] =
    useState<CheckboxValueType | null>(null);

  const pageIds = Form.useWatch('page_permission_ids', form) ?? [];
  const featureIds = Form.useWatch('feature_permission_ids', form) ?? [];

  const handleQuickSelectionChange = (e: CheckboxChangeEvent) => {
    const { value } = e.target;
    setQuickSelection(quickSelection === value ? null : value);
    const { pages, features } =
      defaultSelection[value as keyof typeof QUICK_SELECTION];
    const page_permission_ids =
      quickSelection === value ? [] : pages.map((item) => item.id);
    const feature_permission_ids =
      quickSelection === value ? [] : features.map((item) => item.id);

    form.setFieldsValue({
      page_permission_ids,
      feature_permission_ids,
    });
  };

  const checkQuickSelection = (
    value: QUICK_SELECTION,
    currentPageIds: string[],
    currentFeatureIds: string[]
  ) => {
    if (!currentPageIds.length && !currentFeatureIds.length) return false;

    const { pages, features } = defaultSelection[value];
    const defaultPageIds = pages.map((item) => item.id);
    const defaultFeatureIds = features.map((item) => item.id);

    const equalPagePermission =
      currentPageIds.length === defaultPageIds.length &&
      currentPageIds.every((id) => defaultPageIds.includes(id));
    const equalFeaturePermission =
      currentFeatureIds.length === defaultFeatureIds.length &&
      currentFeatureIds.every((id) => defaultFeatureIds.includes(id));

    return equalPagePermission && equalFeaturePermission;
  };

  useEffect(() => {
    let quickSelectionValue = QUICK_SELECTION.CUSTOM;
    for (const option of plainOptions) {
      if (checkQuickSelection(option.value, pageIds, featureIds)) {
        quickSelectionValue = option.value;
        break;
      }
    }
    setQuickSelection(quickSelectionValue);
  });

  return (
    <>
      <Row>
        <Col span={24} lg={12}>
          <Space wrap>
            <Space wrap>
              {plainOptions.map((option) => {
                return (
                  <Checkbox
                    key={option.value}
                    onChange={handleQuickSelectionChange}
                    value={option.value}
                    checked={quickSelection === option.value}
                  >
                    {option.label}
                  </Checkbox>
                );
              })}
            </Space>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Title level={3}>Page Permissions</Title>
          <Form.Item name="page_permission_ids">
            <Checkbox.Group style={{ display: 'block' }}>
              {PAGE_PERMISSIONS.map((item) => (
                <div key={item.id} style={{ marginBottom: '8px' }}>
                  <Checkbox
                    value={item.id}
                    // enable when user want to custom
                    disabled={quickSelection !== QUICK_SELECTION.CUSTOM}
                  >
                    <ActionTag action={item.action} />
                    {`${item.id} - ${item.pathname}`}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Title level={3}>Feature Permissions</Title>
          <Form.Item name="feature_permission_ids">
            <Checkbox.Group style={{ display: 'block' }}>
              {FEATURE_PERMISSIONS.map((item) => (
                <div key={item.id} style={{ marginBottom: '8px' }}>
                  <Checkbox
                    value={item.id}
                    // enable when user want to custom
                    disabled={quickSelection !== QUICK_SELECTION.CUSTOM}
                  >
                    <ActionTag action={item.action} />
                    {item.id}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default PermissionInfo;

const ActionTag = ({ action }: { action: PERMISSION_ACTIONS }) => (
  <Tag.CheckableTag
    style={{
      minWidth: '60px',
      textAlign: 'center',
      background: ACTION_COLORS[action as keyof typeof ACTION_COLORS],
    }}
    checked
  >
    {action}
  </Tag.CheckableTag>
);
