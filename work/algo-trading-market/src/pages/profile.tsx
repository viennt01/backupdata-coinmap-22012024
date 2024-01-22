import Head from 'next/head';
import Profile from '@/components/profile-page';
import getAppLayout from '@/components/layout';
import { APP_NAME, LAYOUT_TYPES } from '@/constants/common';

function ProfilePage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Profile</title>
      </Head>
      <Profile />
    </>
  );
}

ProfilePage.Layout = getAppLayout(LAYOUT_TYPES.PROFILE);

export default ProfilePage;
