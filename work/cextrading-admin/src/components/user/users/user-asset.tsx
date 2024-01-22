import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import React, { useState } from 'react';
import { createBotAsset, deleteBotAsset } from '../role/fetcher';
import { CreateBotAsset, DeleteBotAsset } from '../role/interface';
interface Props {
  open: boolean;
  setVisibleModal: any;
  create: string;
  userId: string;
  category: string;
  assetId: string;
}

const CreateUserAsset = ({
  open,
  setVisibleModal,
  create,
  userId,
  category,
  assetId,
}: Props) => {
  const toast = useToastHook();
  const [quantity, setQuantity] = useState('1');
  const [valueType, setValueType] = useState('DAY');

  const handleCreateBotAsset = () => {
    const botAsset: CreateBotAsset = {
      user_id: userId,
      category: category,
      asset_id: assetId,
      quantity: Number(quantity),
      type: valueType,
    };
    return createBotAsset(botAsset)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
        }
        setQuantity('1');
        setValueType('DAY');
        setVisibleModal(false);
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const handleDeleteBotAsset = () => {
    const botAsset: DeleteBotAsset = {
      user_id: userId,
      category: category,
      asset_id: assetId,
    };
    return deleteBotAsset(botAsset)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
        }
        setVisibleModal(false);
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };
  return (
    <>
      <Modal
        closeOnOverlayClick={true}
        isOpen={open}
        onClose={() => setVisibleModal(false)}
      >
        <ModalOverlay
          backdropInvert="90%"
          backdropBlur="2px"
          bg="blackAlpha.300"
          backdropFilter="blur(0.4px) hue-rotate(30deg)"
        />
        {create == 'create' ? (
          <ModalContent>
            <ModalHeader>Add user asset</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} paddingBottom={'0px'}>
              <Input
                isRequired
                type="number"
                value={quantity}
                marginBottom={'10px'}
                placeholder="Quantity(number)"
                onChange={(item: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(item.target.value)
                }
              />
              <Select
                onChange={(item) => setValueType(item.target.value)}
                defaultValue={valueType}
              >
                <option value="DAY">DAY</option>
                <option value="MONTH">MONTH</option>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                mr={1}
                onClick={handleCreateBotAsset}
              >
                Save
              </Button>
              <Button onClick={() => setVisibleModal(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>Delete user asset</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} paddingBottom={'0px'}>
              Are you sure you want to delete?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={1} onClick={handleDeleteBotAsset}>
                Ok
              </Button>
              <Button onClick={() => setVisibleModal(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};
export default CreateUserAsset;
