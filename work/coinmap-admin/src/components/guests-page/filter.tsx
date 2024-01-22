import {
  INVITE_CODE_TYPE,
  EVENT_CONFIRM_STATUS,
  PAYMENT_STATUS,
} from '@/constants/code-constants';
import { Form, Row, Col, Input, Select, Button, FormInstance } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

interface OptionSelect {
  label: string;
  value: string;
}

export interface FilterProps {
  keyword: string;
  event_id: string;
  type: string;
  confirm_status: string;
  attend: string;
  payment_status: string;
}

interface Props {
  form: FormInstance<FilterProps>;
  handleSearch: () => void;
  eventOptions: OptionSelect[];
}

export default function Filter({ form, handleSearch, eventOptions }: Props) {
  return (
    <Row gutter={[16, 16]} style={{ flexWrap: 'wrap-reverse' }}>
      <Col span={24} lg={24}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 16]} align="bottom">
            <Col span={24} lg={4}>
              <Form.Item name="keyword" style={{ margin: 0 }}>
                <Input size="large" placeholder="Search" allowClear />
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item name="event_id" style={{ margin: 0 }}>
                <Select placeholder="Event" size="large" allowClear>
                  {eventOptions.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item name="type" style={{ margin: 0 }}>
                <Select placeholder="Guest type" size="large" allowClear>
                  {Object.values(INVITE_CODE_TYPE).map((type) => (
                    <Option value={type} key={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item name="confirm_status" style={{ margin: 0 }}>
                <Select placeholder="Confirm status" size="large" allowClear>
                  {Object.values(EVENT_CONFIRM_STATUS).map((type) => (
                    <Option value={type} key={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item name="payment_status" style={{ margin: 0 }}>
                <Select placeholder="Payment status" size="large" allowClear>
                  {Object.values(PAYMENT_STATUS).map((type) => (
                    <Option value={type} key={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={2}>
              <Form.Item name="attend" style={{ margin: 0 }}>
                <Select placeholder="Attend status" size="large" allowClear>
                  <Option value="1">YES</Option>
                  <Option value="0">NO</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={2}>
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                block
                icon={<SearchOutlined />}
              />
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
