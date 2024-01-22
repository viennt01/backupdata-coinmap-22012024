import withAuthentication from '@/hook/useAuthentication';
import { PageWithNoLayout } from '@/layout/no-layout';
import Component from '@/components/change-password-page/change-password-page';

function ChangePassword() {
  return <Component />;
}

const ChangePasswordPage = withAuthentication(ChangePassword);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
ChangePasswordPage.Layout = PageWithNoLayout;

export default ChangePasswordPage;
