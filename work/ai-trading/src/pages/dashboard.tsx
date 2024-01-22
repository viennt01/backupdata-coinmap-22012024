import Head from 'next/head';
import getAppLayout from '@/components/layout';
import Dashboard from '@/components/dashboard-page';
import { LAYOUT_TYPES } from '@/constants/common';

function DashboardPage() {
  return (
    <>
      <Head>
        <title>A.I Trading | Dashboard</title>
      </Head>
      <Dashboard></Dashboard>
    </>
  );
}

DashboardPage.Layout = getAppLayout(LAYOUT_TYPES.DASHBOARD);

export default DashboardPage;
import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic([
  'common',
  'header',
  'dashboard',
  'connect-broker',
  'form',
  'disconnect-broker',
]);
