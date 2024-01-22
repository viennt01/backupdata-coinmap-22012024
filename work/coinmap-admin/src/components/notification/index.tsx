import { Tabs } from 'antd';
import { useState } from 'react';
import CustomCard from '../commons/custom-card';
import NotificationEmail from './email';

const items = [
  {
    label: 'Email',
    key: '1',
    children: <NotificationEmail />,
  },
];
export default function Notification() {
  const [activeTab, setActiveTab] = useState('1');
  return (
    <CustomCard>
      <Tabs
        type="line"
        defaultActiveKey={activeTab}
        onChange={(tab) => setActiveTab(tab)}
        items={items}
      />
    </CustomCard>
  );
}
