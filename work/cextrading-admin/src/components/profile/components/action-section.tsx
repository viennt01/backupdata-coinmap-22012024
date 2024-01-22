// Chakra imports
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';
import InputField from 'components/form/input-field';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useYupValidationResolver } from 'utils';
import { AdminUpdate, updateAdmin } from '../fetcher';
import { validationSchema } from './validate';

interface Props {
  title: string;
}

interface ChangePassword {
  oldPassword: string;
  repeatPassword: string;
  password: string;
}

const ActionSection = ({ title }: Props) => {
  const resolver = useYupValidationResolver<ChangePassword>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePassword>({
    resolver,
    defaultValues: {
      oldPassword: '',
      repeatPassword: '',
      password: '',
    },
  });

  const toast = useToastHook();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = (values: ChangePassword) => {
    const data: AdminUpdate = {
      password: values.password,
      old_password: values.oldPassword,
    };
    updateAdmin(data)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          reset();
          onClose();
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('teal.300', 'gray.700');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <>
      <Card bg={bg} borderRadius={15} p="16px" my={{ sm: '24px', xl: '0px' }}>
        <CardHeader p="12px 5px" mb="12px">
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            {title}
          </Text>
        </CardHeader>
        <CardBody px="5px">
          <Flex direction="column">
            <Button
              onClick={onOpen}
              color={textColor}
              bg={bgColor}
              variant="solid"
              fontSize="sm"
              shadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
            >
              Change Password
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <InputField
                id="oldPassword"
                label="Current Password"
                placeholder="Enter your password"
                type="password"
                required
                {...register('oldPassword')}
                error={errors.oldPassword?.message}
              />

              <InputField
                id="email"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                required
                {...register('password')}
                error={errors.password?.message}
              />

              <InputField
                id="repeatPassword"
                label="Repeat password"
                placeholder="Enter confirm password"
                required
                type="password"
                {...register('repeatPassword')}
                error={errors.repeatPassword?.message}
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button isLoading={isSubmitting} type="submit" bg={bgColor}>
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActionSection;
