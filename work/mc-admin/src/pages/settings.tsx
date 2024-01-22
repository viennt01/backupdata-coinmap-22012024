import Head from 'next/head';
import { Inter } from '@next/font/google';
import SettingsPage from '@/components/settings';
import withAuthentication from '@/hook/useAuthentication';

const inter = Inter({ subsets: ['latin'] });

function Settings() {
  return (
    <>
      <Head>
        <title>Merchants | Settings</title>
      </Head>
      <main className={inter.className}>
        <SettingsPage />
      </main>
    </>
  );
}

export default withAuthentication(Settings);
