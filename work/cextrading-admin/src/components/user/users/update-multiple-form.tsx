// Chakra imports
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Text,
  Flex,
} from '@chakra-ui/react';
// Custom components
import useToastHook, { STATUS } from 'components/hook/toast';
import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import InputField from 'components/form/input-field';
import { PACKAGE_TIME_TYPE, UPDATE_TYPE } from '../package/interface';
import { addMultipleRoleToUser, removeMultipleRoleToUser } from './fetcher';
import { ERROR_CODE } from 'fetcher/interface';
import { MESSAGE } from 'constants/message';

interface Props {
  usersSelected: { value: string; label: string }[];
  handleCheckUser: (id: string, checked: boolean) => void;
  setUpdatedMultiple: (data: boolean) => void;
  userOptions: { value: string; label: string }[];
  setUsersSelected: (data: { value: string; label: string }[]) => void;
  setEmailInputChange: (data: boolean) => void;
  emailInputChange: boolean;
  roleOptions: { value: string; label: string }[];
}

const typeUpdateOptions = [
  { value: UPDATE_TYPE.ADD_ROLE, label: 'Add roles' },
  { value: UPDATE_TYPE.REMOVE_ROLE, label: 'Remove roles' },
];
const typePackageUnlimited = 'UNLIMITED';
const typePackageOptions = [
  { value: PACKAGE_TIME_TYPE.MONTH, label: 'Month' },
  { value: PACKAGE_TIME_TYPE.DAY, label: 'Day' },
  { value: typePackageUnlimited, label: 'Unlimited' },
];

const UpdateMultipleForm = ({
  usersSelected,
  handleCheckUser,
  setUpdatedMultiple,
  userOptions,
  setUsersSelected,
  setEmailInputChange,
  emailInputChange,
  roleOptions,
}: Props) => {
  const toast = useToastHook();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [userExisted, setUserExisted] = useState<boolean>(false);
  const [typeUpdateSelected, setTypeUpdateSelected] = useState<{
    value: string;
    label: string;
  }>(typeUpdateOptions[0]);
  const [typePackageSelected, setTypePackageSelected] = useState<{
    value: string;
    label: string;
  }>(typePackageOptions[0]);
  const [disabledSaveBtn, setDisabledSaveBtn] = useState<boolean>(true);
  const [rolesSelected, setRolesSelected] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [emailList, setEmailList] = useState<string>('');

  const onSubmit = () => {
    if (typeUpdateSelected.value === UPDATE_TYPE.ADD_ROLE) {
      const data = {
        user_ids: usersSelected.map((u) => u.value),
        role_ids: rolesSelected.map((r) => r.value),
        quantity: quantity,
        type: typePackageSelected.value,
      };
      setLoading(true);
      addMultipleRoleToUser(data)
        .then((rawRes) => {
          if (rawRes.error_code === ERROR_CODE.SUCCESS) {
            toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          }
        })
        .catch((err) => {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        })
        .finally(() => {
          onClose();
          setLoading(false);
          setUpdatedMultiple(true);
        });
    } else {
      const data = {
        user_ids: usersSelected.map((u) => u.value),
        role_ids: rolesSelected.map((r) => r.value),
      };
      setLoading(true);
      removeMultipleRoleToUser(data)
        .then((rawRes) => {
          if (rawRes.error_code === ERROR_CODE.SUCCESS) {
            toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          }
        })
        .catch((err) => {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        })
        .finally(() => {
          onClose();
          setLoading(false);
          setUpdatedMultiple(true);
        });
    }
  };

  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('teal.300', 'gray.700');
  const bgRedColor = useColorModeValue('red.300', 'gray.700');
  const handleChangeUser = (option: { value: string; label: string }) => {
    setUserSelected(option);
    const user = usersSelected.find((u) => u.value === option.value);
    if (user) {
      setUserExisted(true);
    } else {
      setUserExisted(false);
    }
  };
  const handleAddUser = () => {
    if (userSelected) {
      handleCheckUser(userSelected.value, true);
      setUserExisted(true);
      setUserSelected(null);
    }
  };
  const handleRemoveUser = () => {
    if (userSelected) {
      handleCheckUser(userSelected.value, false);
      setUserExisted(false);
      setUserSelected(null);
    }
  };

  const handleInputEmail = (text: string) => {
    // usersSelected.map((u) => `${u.label}`).join('\n')
    setEmailInputChange(true);
    const formatText = text.replace(/ /g, '\n');
    setEmailList(formatText);
  };
  const checkEmailInput = () => {
    const newSelected: { value: string; label: string }[] = [];
    emailList.split('\n').forEach((e) => {
      const option = userOptions.find((o) => o.label === e);
      if (option && !newSelected.includes(option)) {
        newSelected.push(option);
      }
    });
    setUsersSelected(newSelected);
    setEmailInputChange(false);
  };

  useEffect(() => {
    const emailStringTemp = usersSelected.map((u) => `${u.label}`).join('\n');
    setEmailList(emailStringTemp);
  }, [usersSelected]);

  useEffect(() => {
    if (emailInputChange) {
      setDisabledSaveBtn(true);
      return;
    }
    if (typePackageSelected.value === typePackageUnlimited) {
      setQuantity(0);
    }
    if (typeUpdateSelected.value === UPDATE_TYPE.ADD_ROLE) {
      if (
        usersSelected.length > 0 &&
        rolesSelected.length > 0 &&
        (quantity > 0 || typePackageSelected.value === typePackageUnlimited)
      ) {
        return setDisabledSaveBtn(false);
      }
    } else {
      if (usersSelected.length > 0 && rolesSelected.length > 0) {
        return setDisabledSaveBtn(false);
      }
    }
    setDisabledSaveBtn(true);
  }, [
    typeUpdateSelected,
    rolesSelected,
    usersSelected,
    quantity,
    typePackageSelected,
    emailInputChange,
  ]);

  return (
    <>
      <Button
        onClick={onOpen}
        color={'white'}
        bg={bgColor}
        variant="solid"
        fontSize="sm"
        shadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
      >
        Update Multiple
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update user role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent="space-between">
              <Flex margin={2}>{usersSelected.length}</Flex>

              <Flex flex={1} display="block" mr={3}>
                <Select
                  options={userOptions}
                  value={userSelected}
                  onChange={(e) => e && handleChangeUser(e)}
                />
              </Flex>
              {userExisted ? (
                <Button
                  disabled={userSelected ? false : true}
                  onClick={handleRemoveUser}
                  color={textColor}
                  bg={bgRedColor}
                  variant="solid"
                  fontSize="sm"
                  shadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
                >
                  Remove
                </Button>
              ) : (
                <Button
                  disabled={userSelected ? false : true}
                  onClick={handleAddUser}
                  color={textColor}
                  bg={bgColor}
                  variant="solid"
                  fontSize="sm"
                  shadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
                >
                  Add
                </Button>
              )}
            </Flex>
            <Flex position={'relative'}>
              <Textarea
                mt={3}
                mb={3}
                cols={90}
                rows={5}
                value={emailList}
                size="sm"
                onChange={(e) => handleInputEmail(e.target.value)}
              />
              <Flex position={'absolute'} bottom={3} right={0}>
                <Button
                  disabled={emailInputChange ? false : true}
                  onClick={checkEmailInput}
                  color={textColor}
                  bg={bgColor}
                  variant="solid"
                  fontSize="sm"
                  borderRadius={30}
                  shadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
                  zIndex={1}
                >
                  Ok
                </Button>
              </Flex>
            </Flex>

            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Type Update:
            </Text>
            <Select
              options={typeUpdateOptions}
              value={typeUpdateSelected}
              onChange={(e) => e && setTypeUpdateSelected(e)}
            />
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Select Roles:
            </Text>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={roleOptions}
              value={rolesSelected}
              onChange={(e) => e && setRolesSelected(e)}
            />
            {typeUpdateSelected.value === UPDATE_TYPE.ADD_ROLE && (
              <Flex mt={3}>
                {typePackageSelected.value === typePackageUnlimited ? (
                  <InputField
                    disabled
                    id="firstName"
                    placeholder="Enter quantity"
                    type="number"
                    value={quantity.toString()}
                    onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  />
                ) : (
                  <InputField
                    id="firstName"
                    placeholder="Enter quantity"
                    type="number"
                    value={quantity.toString()}
                    onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  />
                )}

                <Flex display={'block'} width={200} ml={3}>
                  <Select
                    options={typePackageOptions}
                    value={typePackageSelected}
                    onChange={(e) => e && setTypePackageSelected(e)}
                  />
                </Flex>
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              disabled={disabledSaveBtn}
              onClick={onSubmit}
              isLoading={loading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateMultipleForm;
