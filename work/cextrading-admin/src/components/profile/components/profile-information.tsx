// Chakra imports
import { Flex, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

interface Props {
  title: string;
  description: string;
  name: string;
  mobile: string;
  email: string;
  location: string;
}

const ProfileInformation = ({
  title,
  description,
  name,
  mobile,
  email,
  location,
}: Props) => {
  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} borderRadius={15} p="16px" my={{ sm: '24px', xl: '0px' }}>
      <CardHeader p="12px 5px" mb="12px">
        <Text fontSize="lg" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody px="5px">
        <Flex direction="column">
          <Text fontSize="md" color="gray.500" fontWeight="400" mb="30px">
            {description}
          </Text>
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Full Name:{' '}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {name}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Mobile:{' '}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {mobile}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Email:{' '}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {email}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Location:{' '}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {location}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Affiliate:{' '}
            </Text>
            <Flex>
              <Link
                href="#"
                color="teal.300"
                fontSize="lg"
                me="10px"
                _hover={{ color: 'teal.300' }}
              >
                <Icon as={FaFacebook} />
              </Link>
              <Link
                href="#"
                color="teal.300"
                fontSize="lg"
                me="10px"
                _hover={{ color: 'teal.300' }}
              >
                <Icon as={FaInstagram} />
              </Link>
              <Link
                href="#"
                color="teal.300"
                fontSize="lg"
                me="10px"
                _hover={{ color: 'teal.300' }}
              >
                <Icon as={FaTwitter} />
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ProfileInformation;
