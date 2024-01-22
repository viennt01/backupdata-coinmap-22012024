import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Drawer,
  Space,
  Tag,
  Tooltip,
  Avatar,
  Input,
  Image,
} from 'antd';
import { Layout, Row, Col } from 'antd';
import { ROUTERS } from '@/constant/router';
import { useRouter } from 'next/router';
import { Typography } from 'antd';
import { appLocalStorage } from '@/utils/localstorage';
import { LOCAL_STORAGE_KEYS } from '@/constant/localstorage';
import { getMerchantInfo } from './fetcher';
import { MerchantInfo } from '@/interface/merchant-info';

import { ERROR_CODE } from '@/constant/error-code';
import { getAffiliateLink } from '@/utils/format';
import { AppContext } from '@/app-context';
import AppSider from './components/app-sider';
import Head from 'next/head';

const { Text } = Typography;
const { Header, Content, Footer } = Layout;
const HEADER_HEIGHT = 64;

interface Props {
  children: React.ReactNode;
}

export function AppLayout(props: Props) {
  const [userInfoCollapse, setUserInfoCollapse] = useState(false);
  const [merchantInfo, setMerchantInfoState] = useState<MerchantInfo | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAffiliateLink, setCopiedAffiliateLink] = useState(false);
  const { setMerchantInfo } = useContext(AppContext);

  const router = useRouter();

  const fetchMerchantInfo = () => {
    getMerchantInfo()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setMerchantInfoState(res.payload);
          if (setMerchantInfo) {
            setMerchantInfo(res.payload);
          }
        }
      })
      .catch(() => {
        // remove token and redirect to home
        appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
        router.replace(ROUTERS.LOGIN);
      });
  };

  useEffect(() => {
    if (merchantInfo && setMerchantInfo) {
      setMerchantInfo(merchantInfo);
    }
  }, [merchantInfo, setMerchantInfo]);

  useEffect(() => {
    fetchMerchantInfo();
  }, []);

  const handleToggleUserInfoCollapse = () => {
    setUserInfoCollapse((prev) => !prev);
  };

  const handleCopyCode = () => {
    if (merchantInfo?.code) {
      navigator.clipboard.writeText(merchantInfo.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  const handleCopyAffiliateLink = () => {
    if (merchantInfo?.code && merchantInfo?.domain) {
      navigator.clipboard.writeText(
        getAffiliateLink(merchantInfo.domain, merchantInfo.code)
      );
      setCopiedAffiliateLink(true);
      setTimeout(() => setCopiedAffiliateLink(false), 3000);
    }
  };

  const handleChangePassword = () => {
    router.push(ROUTERS.CHANGE_PASSWORD);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Head>
        <link rel="favicon" href={merchantInfo?.config?.favicon_url} />
        <link rel="shortcut icon" href={merchantInfo?.config?.favicon_url} />
      </Head>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          padding: '0 24px',
          background: 'black',
          height: HEADER_HEIGHT,
        }}
      >
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Image
            style={{ maxHeight: 40, cursor: 'pointer' }}
            hidden={!merchantInfo?.config?.logo_url}
            src={merchantInfo?.config?.logo_url ?? ''}
            alt="logo"
            preview={false}
            onClick={() => router.push(ROUTERS.HOME)}
          />
          <Space
            style={{ cursor: 'pointer' }}
            onClick={handleToggleUserInfoCollapse}
          >
            <Avatar
              style={{ display: 'block', background: 'white', color: 'black' }}
              icon={<UserOutlined />}
            />
            <span style={{ color: 'white' }}>{merchantInfo?.name}</span>
          </Space>
        </Space>
        <Drawer
          title="User Info"
          placement="right"
          onClose={handleToggleUserInfoCollapse}
          open={userInfoCollapse}
        >
          {merchantInfo && (
            <Row
              style={{
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Col flex={1}>
                <Card
                  style={{
                    background: '#E6F4FF',
                    border: '1px solid #91CAFF',
                  }}
                >
                  <Row
                    gutter={[12, 8]}
                    style={{
                      flexDirection: 'column',
                    }}
                  >
                    <Col flex={1}>
                      <Space>
                        <strong style={{ width: '40%' }}>Name:</strong>
                        <Text>{merchantInfo.name}</Text>
                        <Tag color={'success'}>{merchantInfo.status}</Tag>
                      </Space>
                    </Col>
                    <Col flex={1}>
                      <Space>
                        <strong>Email:</strong>
                        <Text>{merchantInfo.email}</Text>
                      </Space>
                    </Col>
                    <Col flex={1}>
                      <Space>
                        <strong>Commission:</strong>
                        <Text>
                          {(merchantInfo.config.commission ?? 0) * 100}%
                        </Text>
                      </Space>
                    </Col>
                    <Col flex={1}>
                      <Space>
                        <strong>Domain:</strong>
                        <Text>{merchantInfo.domain}</Text>
                      </Space>
                    </Col>
                    <Col flex={1}>
                      <Space>
                        <strong>Code:</strong>
                        <Text>{merchantInfo.code}</Text>
                        <Tooltip title={copiedCode ? 'Copied' : 'Copy code'}>
                          <Button
                            disabled={copiedCode}
                            type="ghost"
                            size="small"
                            icon={
                              copiedCode ? (
                                <CheckCircleOutlined
                                  style={{ color: '#52C41A' }}
                                />
                              ) : (
                                <CopyOutlined />
                              )
                            }
                            onClick={handleCopyCode}
                          ></Button>
                        </Tooltip>
                      </Space>
                    </Col>
                    <Col flex={1}>
                      <strong>Affiliate Link:</strong>
                      <Input.Group
                        compact
                        style={{ display: 'flex', marginTop: 8 }}
                      >
                        <Input
                          disabled
                          style={{ flex: '1' }}
                          value={getAffiliateLink(
                            merchantInfo.domain,
                            merchantInfo.code
                          )}
                        />
                        <Tooltip
                          title={
                            copiedAffiliateLink
                              ? 'Copied'
                              : 'Copy affiliate link'
                          }
                        >
                          <Button
                            disabled={copiedAffiliateLink}
                            style={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                              background: '#E6F4FF',
                            }}
                            onClick={handleCopyAffiliateLink}
                          >
                            {copiedAffiliateLink ? (
                              <CheckCircleOutlined
                                style={{ fontSize: '16px', color: '#52C41A' }}
                              />
                            ) : (
                              <CopyOutlined style={{ fontSize: '16px' }} />
                            )}
                          </Button>
                        </Tooltip>
                      </Input.Group>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col>
                <Button
                  block
                  size="large"
                  type="primary"
                  ghost
                  onClick={handleChangePassword}
                >
                  Change password
                </Button>
              </Col>
            </Row>
          )}
        </Drawer>
      </Header>
      <Layout>
        <AppSider />
        <Content
          style={{
            padding: '0 24px',
            maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflowY: 'auto',
          }}
        >
          <main>{props.children}</main>
          <Footer style={{ textAlign: 'center' }}>
            <Text disabled>{process.env.VERSION}</Text>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
}
