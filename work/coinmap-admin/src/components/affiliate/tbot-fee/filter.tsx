import CustomCard from '@/components/commons/custom-card';
import { ROUTERS } from '@/constants/router';
import { SyncOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Tooltip,
  Button,
  Form,
  Input,
  FormInstance,
  Space,
} from 'antd';
import { useRouter } from 'next/router';

interface Props {
  form: FormInstance;
  handleSearch: (values: { keyword: string }) => void;
  syncTableData: () => void;
}

export default function Filter({ handleSearch, form, syncTableData }: Props) {
  const router = useRouter();
  const initialValues = {
    keyword: '',
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
              onClick={() =>
                router.push(`${ROUTERS.AFFILIATE_TBOT_FEE}/create`)
              }
            >
              Create
            </Button>
          </Space>
        </Col>
      </Row>
    </CustomCard>
  );
}
