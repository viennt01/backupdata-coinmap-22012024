import React from 'react';
// Chakra imports
import {
  Box,
  Flex,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { myLocalStorage, useYupValidationResolver } from 'utils';
import InputField from 'components/form/input-field';
import { useForm } from 'react-hook-form';
import { adminLogin, RawAdminLogin } from './fetcher';
import { AdminLogin } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import useToastHook, { STATUS } from 'components/hook/toast';
import { validationSchema } from './validate';
import { useRouter } from 'next/router';
import { headers } from 'fetcher/utils';

function SignIn() {
  const resolver = useYupValidationResolver<AdminLogin>(validationSchema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLogin>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const toast = useToastHook();
  const router = useRouter();

  async function onSubmit(values: AdminLogin) {
    const data: RawAdminLogin = {
      email: values.email,
      password: values.password,
    };

    return adminLogin(data)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          myLocalStorage.set('token', res.payload.token);
          headers.setToken(res.payload.token);
          router.push('/admin');
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  }

  // Chakra color mode
  const titleColor = useColorModeValue('teal.300', 'teal.200');
  const textColor = useColorModeValue('gray.400', 'white');

  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box bg={bg} p="20px" borderRadius={15}>
        <Flex position="relative" mb="40px">
          <Flex
            h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
            w="100%"
            maxW="1044px"
            mx="auto"
            justifyContent="center"
            mb="30px"
            pt={{ sm: '100px', md: '0px' }}
          >
            <Flex
              alignItems="center"
              justifyContent="start"
              style={{ userSelect: 'none' }}
              w="50%"
            >
              <Flex
                direction="column"
                w="100%"
                background="transparent"
                p="48px"
                mt={{ md: '150px', lg: '80px' }}
              >
                <Heading color={titleColor} fontSize="32px" mb="10px">
                  Welcome Back
                </Heading>
                <Text
                  mb="36px"
                  ms="4px"
                  color={textColor}
                  fontWeight="bold"
                  fontSize="14px"
                >
                  Enter your email and password to sign in
                </Text>

                <InputField
                  id="email"
                  label="Email"
                  placeholder="Enter email"
                  required
                  {...register('email')}
                  error={errors.email?.message}
                />

                <InputField
                  id="password"
                  label="Password"
                  placeholder="Enter password"
                  required
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                />

                <Button
                  type="submit"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: 'teal.200',
                  }}
                  _active={{
                    bg: 'teal.400',
                  }}
                  isLoading={isSubmitting}
                >
                  SIGN IN
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </form>
  );
}

export default SignIn;
