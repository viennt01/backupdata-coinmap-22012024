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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
// Custom components
import { HiPlus } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteFeature, getFeatures, normalizeFeature } from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { Feature } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import TableFeatureRow from './table-row';
import { MESSAGE } from 'constants/message';
import { MyTh } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  title: string;
  captions: string[];
  data: Feature[];
  handleDelete: (featureId: Feature['featureId']) => void;
  handleEdit: (featureId: Feature['featureId']) => void;
}

const FeaturesTable = ({
  title,
  captions,
  data,
  handleDelete,
  handleEdit,
}: Props) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} borderRadius={15} overflowX={{ sm: 'scroll', xl: 'hidden' }}>
      <CardHeader p="6px 0px 22px 0px">
        <Text fontSize="xl" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody maxHeight="50vh" overflow="auto">
        <Table size={'sm'} variant="simple" color={textColor}>
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
                  <TableFeatureRow
                    key={row.featureId}
                    featureId={row.featureId}
                    featureName={row.featureName}
                    description={row.description}
                    action={row.action}
                    createdAt={row.createdAt}
                    handleDelete={() => handleDelete(row.featureId)}
                    handleEdit={() => handleEdit(row.featureId)}
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

const FeatureListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [featureIdSelected, setFeatureIdSeleted] = useState<
    Feature['featureId'] | null
  >(null);

  const fetchData = () => {
    getFeatures()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const features = normalizeFeature(res.payload);
          setFeatures(features);
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
  }, []);

  const handleCreate = () => {
    router.push('/settings/feature/create');
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDelete = (featureId: Feature['featureId']) => {
    onOpen();
    setFeatureIdSeleted(featureId);
  };
  const handleEdit = (featureId: Feature['featureId']) => {
    router.push(`/settings/feature/${featureId}`);
  };

  const handleDeleteFeature = () => {
    if (!featureIdSelected) return;
    setLoading(true);
    deleteFeature(featureIdSelected)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          fetchData();
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          onClose();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Flex align="center" justify="end" mb="20px">
        {ability.can('ROLE', ability.permissions.CREATE_FEATURE) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <FeaturesTable
        title={'Feature List'}
        captions={[
          'Feature_ID',
          'Feature Name',
          'Description',
          'Action',
          'Create date',
          '',
        ]}
        data={features || []}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Feature
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                bg="gray.300"
                color={'gray.800'}
                variant="no-hover"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                isLoading={loading}
                colorScheme="red"
                onClick={handleDeleteFeature}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default FeatureListing;
