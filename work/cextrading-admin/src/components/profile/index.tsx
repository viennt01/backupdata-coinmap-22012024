import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Grid,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { normalizeAdmin } from 'components/admin/fetcher';
import { AdminList } from 'components/admin/interface';
import { ERROR_CODE } from 'fetcher/interface';
import { headers } from 'fetcher/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { HiLogout } from 'react-icons/hi';
import { myLocalStorage } from 'utils';
import ActionSection from './components/action-section';

import Header from './components/header';
import PlatformSettings from './components/platform-settings';
import ProfileInformation from './components/profile-information';
import { getUserProfile } from './fetcher';
import { connect } from '../../websocket';

export default function Profile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<AdminList | null>(null);

  const fetchData = () => {
    getUserProfile().then((res) => {
      if (res && res.error_code === ERROR_CODE.SUCCESS) {
        const user = normalizeAdmin(res.payload);
        setUserProfile(user);
        connect();
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const bgProfile = useColorModeValue(
    'hsla(0,0%,100%,.8)',
    'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)',
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  const handleSignOut = () => {
    myLocalStorage.delete('token');
    headers.removeToken();
    router.push('/sign-in');
  };

  if (!userProfile) return null;
  return (
    <Flex flexDirection="column" pt="75px">
      <Header
        backgroundHeader={'/images/profile-bg.png'}
        backgroundProfile={bgProfile}
        avatarImage={''}
        name={userProfile.firstName + ' ' + userProfile.lastName}
        email={userProfile.email}
        tabs={[
          {
            onClick: () => onOpen(),
            name: 'Sign out',
            icon: <HiLogout width="100%" height="100%" />,
          },
        ]}
      />
      <Grid templateColumns={{ sm: '1fr', xl: 'repeat(3, 1fr)' }} gap="22px">
        <ProfileInformation
          title={'Profile Information'}
          description={''}
          name={userProfile.firstName + ' ' + userProfile.lastName}
          mobile={userProfile.phone}
          email={userProfile.email}
          location={userProfile.address}
        />
        <PlatformSettings
          userProfile={userProfile}
          title={'User role'}
          subtitle1={'Role'}
          subtitle2={'Permissions'}
        />
        <ActionSection title={'Action'} />
      </Grid>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Sign out
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You cant undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleSignOut} ml={3}>
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
