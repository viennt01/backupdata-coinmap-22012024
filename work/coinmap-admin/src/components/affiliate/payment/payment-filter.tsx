import CustomCard from '@/components/commons/custom-card';
import {
  SyncOutlined,
  SearchOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Row,
  Col,
  Tooltip,
  Button,
  Form,
  Input,
  DatePicker,
  FormInstance,
  Space,
} from 'antd';
import dayjs from 'dayjs';

interface Props {
  form: FormInstance;
  handleSearch: (value: { keyword: { $d: Date }; name: string }) => void;
  exportTableData: () => void;
  syncTableData: () => void;
  createPayout: () => void;
}

export default function PaymentFilter({
  handleSearch,
  form,
  exportTableData,
  syncTableData,
  createPayout,
}: Props) {
  const firstDayOfMonth = dayjs().startOf('month').toDate().getTime();
  const initialValues = {
    keyword: dayjs(firstDayOfMonth),
  };

  return (
    <CustomCard style={{ marginTop: '24px' }}>
      <Row justify="space-between">
        <Col flex={1}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            initialValues={initialValues}
          >
            <Row gutter={[16, 16]} align="bottom">
              <Col>
                <Form.Item name="keyword" style={{ margin: 0 }}>
                  <DatePicker size="large" picker="month" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="name" style={{ margin: 0 }}>
                  <Input size="large" placeholder="Search" allowClear />
                </Form.Item>
              </Col>

              <Col>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                />
              </Col>
            </Row>
          </Form>
        </Col>
        <Col>
          <Space>
            <Tooltip title="Export data">
              <Button
                icon={<CloudDownloadOutlined />}
                size="large"
                onClick={exportTableData}
              />
            </Tooltip>
            <Tooltip title="Sync data">
              <Button
                icon={<SyncOutlined />}
                size="large"
                onClick={syncTableData}
              ></Button>
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={createPayout}
            >
              Create
            </Button>
          </Space>
        </Col>
      </Row>
    </CustomCard>
  );
}
