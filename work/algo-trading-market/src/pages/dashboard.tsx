import Head from 'next/head';
import getAppLayout from '@/components/layout';
import Dashboard from '@/components/dashboard-page';
import { APP_NAME, LAYOUT_TYPES } from '@/constants/common';

function DashboardPage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Dashboard</title>
      </Head>
      <Dashboard></Dashboard>
    </>
  );
}

DashboardPage.Layout = getAppLayout(LAYOUT_TYPES.MAIN);

export default DashboardPage;
