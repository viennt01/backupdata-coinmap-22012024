import {
  Badge,
  Button,
  Flex,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { PackageTime, PACKAGE_TIME_ACTIVE } from './interface';
import { HiPencil } from 'react-icons/hi';
import { MyTd } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  packageTime: PackageTime;
  handleEditing: () => void;
}

function TablePackageTimeRow(props: Props) {
  const { packageTime, handleEditing } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('teal.300', '#1a202c');
  const bgRedStatus = useColorModeValue('red.300', '#1a202c');

  return (
    <Tr>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {packageTime.name}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {packageTime.quantity}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {packageTime.discountAmount || 0} USD
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {packageTime.discountRate || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Flex justifyContent={'center'}>
          <Badge
            p="5px 10px"
            borderRadius="8px"
            bg={packageTime.status ? bgStatus : bgRedStatus}
            color={textBadgeColor}
          >
            {packageTime.status
              ? PACKAGE_TIME_ACTIVE.ACTIVE
              : PACKAGE_TIME_ACTIVE.DEACTIVE}
          </Badge>
        </Flex>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {packageTime.updatedAt}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} textAlign="center" fontWeight="bold">
          {packageTime.createdAt}
        </Text>
      </MyTd>
      <MyTd>
        {ability.can('ROLE', ability.permissions.UPDATE_PACKAGE) && (
          <Button onClick={handleEditing} p="0px" variant="no-hover">
            <HiPencil />
          </Button>
        )}
      </MyTd>
    </Tr>
  );
}

export default TablePackageTimeRow;
