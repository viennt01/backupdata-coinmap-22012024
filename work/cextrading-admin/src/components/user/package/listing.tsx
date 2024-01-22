// Chakra imports
import {
  Table,
  Tbody,
  Text,
  Thead,
  Tr,
  Flex,
  useColorModeValue,
  Button,
  Td,
} from '@chakra-ui/react';
// Custom components
import { HiPlus } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ERROR_CODE } from 'fetcher/interface';
import TablePackageTimeRow from './table-row';
import { MyTh } from 'components/tables';
import useToastHook, { STATUS } from 'components/hook/toast';
import useMyAbility from 'hook/ability';
import { PackageTime } from './interface';
import { getPackageTimeList, normalizePackageTime } from './fetcher';

interface Props {
  title: string;
  captions: string[];
  data: PackageTime[];
  handleEditing: (id: PackageTime['id']) => void;
}

const PackageTimeTable = ({ title, captions, data, handleEditing }: Props) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} borderRadius={15}>
      <CardHeader p="6px 0px 22px 0px">
        <Text fontSize="xl" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody maxHeight="50vh" overflow="auto">
        <Table size="sm" variant="simple" color={textColor}>
          <Thead>
            <Tr whiteSpace={'nowrap'} my=".8rem" pl="0px" color="gray.400">
              {captions.map((caption, idx) => {
                return <MyTh key={idx}>{caption}</MyTh>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((row) => {
                return (
                  <TablePackageTimeRow
                    key={row.id}
                    packageTime={row}
                    handleEditing={() => handleEditing(row.id)}
                  />
                );
              })
            ) : (
              <Tr>
                <Td
                  textAlign={'center'}
                  color="gray.400"
                  colSpan={captions.length}
                >
                  No Data
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

const PackageTimeListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [packageTimeList, setPackageTimeList] = useState<PackageTime[] | null>(
    null,
  );

  const fetchData = () => {
    getPackageTimeList()
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const res = rawRes.payload.map((row) => {
            return normalizePackageTime(row);
          });
          setPackageTimeList(res);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleCreate = () => {
    router.push('/user/package/create');
  };

  const handleEditing = (id: PackageTime['id']) => {
    router.push(`/user/package/${id}`);
  };

  return (
    <>
      <Flex align="center" justifyContent="end" mb="20px">
        {ability.can('ROLE', ability.permissions.CREATE_PACKAGE) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <PackageTimeTable
        title={'User List'}
        captions={[
          'Package name',
          'Quantity',
          'Discount Amount',
          'Discount Rate',
          'Status',
          'Update date',
          'Create date',
          '',
        ]}
        data={packageTimeList || []}
        handleEditing={handleEditing}
      />
    </>
  );
};

export default PackageTimeListing;
