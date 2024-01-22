import Head from 'next/head';
import Profile from '@/components/profile-page';
import getAppLayout from '@/components/layout';
import { LAYOUT_TYPES } from '@/constants/common';

function ProfilePage() {
  return (
    <>
      <Head>
        <title>A.I Trading | Profile</title>
      </Head>
      <Profile />
    </>
  );
}

ProfilePage.Layout = getAppLayout(LAYOUT_TYPES.DEFAULT);
import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic([
  'common',
  'header',
  'profile',
  'plan',
  'payment',
  'form',
]);

export default ProfilePage;
