import {
  Box,
  FormControl,
  FormLabel,
  Switch,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
} from '@chakra-ui/react';
import { useBgWhite } from 'components/hook';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { PERMISSION_LIST } from 'constants/permission-id';
import { ERROR_CODE } from 'fetcher/interface';
import React, { useEffect, useState } from 'react';
import InputField from 'components/form/input-field';
import { HiCheckCircle } from 'react-icons/hi';
import {
  createAppSetting,
  CreateAppSetting,
  getAppSettings,
  normalizeAppSetting,
  updateAppSetting,
} from './fetcher';
import { AppSeting, BrokerServer, ON_OFF, SETTING_NAME } from './interface';

export default function CextradingSetting() {
  const toast = useToastHook();
  const BrokerServers = {
    xm: ['XMGlobal-Demo'],
    axi: ['Axi.SVG-US10-Live', 'Axi.SVG-US03-Demo', 'Axi.SVG-US888-Demo'],
  };
  const [appSettings, setAppSettings] = useState<AppSeting[] | null>(null);
  const [isDataChange, setIsDataChange] = useState<boolean>(true);
  const [brokerServers, setBrokerServers] =
    useState<BrokerServer>(BrokerServers);
  const [brokerServer, setBrokerServer] = useState<AppSeting | null>(null);
  const [axiServer, setAxiServer] = useState<string>('');
  const [xmServer, setXMServer] = useState<string>('');

  const fetchAppSettings = () => {
    getAppSettings().then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const appSettings = normalizeAppSetting(res.payload);
        setAppSettings(appSettings);
        if (appSettings) {
          const data = appSettings.find(
            (a) => a.name === SETTING_NAME.BROKER_SERVER,
          );
          if (data) {
            try {
              setBrokerServers(JSON.parse(data.value));
              setBrokerServer(data);
            } catch (error) {}
          }
        }
      }
    });
  };

  useEffect(() => {
    fetchAppSettings();
  }, []);

  // useEffect(() => {
  //   if(isDataChange) {
  //     setIsDataChange(false)
  //   }
  // }, [brokerServers]);

  const onOffRegister: AppSeting | undefined = (() => {
    if (appSettings)
      return appSettings.find(
        (a) => a.name === PERMISSION_LIST.ON_OFF_REGISTER,
      );
    return undefined;
  })();

  const handleChangeOnOff = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ON register
    const data: CreateAppSetting = {
      name: SETTING_NAME.ON_OFF_REGISTER,
      value: ON_OFF.ON,
      description: '',
    };
    if (onOffRegister) {
      if (!e.target.checked) {
        data.value = ON_OFF.OFF;
      }
      // update
      updateAppSetting(data, onOffRegister.id)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });

            fetchAppSettings();
          }
        })
        .catch((err) => {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        });
    } else {
      // create
      createAppSetting(data)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });

            fetchAppSettings();
          }
        })
        .catch((err) => {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        });
    }
  };

  function removeBrokerServer(code: string, index: number) {
    const newBrokerServers = { ...brokerServers };
    newBrokerServers[code].splice(index, 1);
    setBrokerServers(newBrokerServers);
    setIsDataChange(false);
  }
  function addBrokerServer(code: string) {
    const newBrokerServers = { ...brokerServers };
    if (code === 'axi') {
      if (axiServer) {
        newBrokerServers.axi.push(axiServer);
        setBrokerServers(newBrokerServers);
        setAxiServer('');
      }
    } else {
      if (xmServer) {
        newBrokerServers.xm.push(xmServer);
        setBrokerServers(newBrokerServers);
        setXMServer('');
      }
    }
    setIsDataChange(false);
  }
  function saveBrokerServer() {
    // ON register
    const data: CreateAppSetting = {
      name: SETTING_NAME.BROKER_SERVER,
      value: JSON.stringify(brokerServers),
      description: '',
    };
    if (brokerServer) {
      // update
      updateAppSetting(data, brokerServer.id)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });

            fetchAppSettings();
          }
        })
        .catch((err) => {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        });
    } else {
      // create
      createAppSetting(data)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });

            fetchAppSettings();
          }
        })
        .catch((err) => {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        });
    }
  }

  const bg = useBgWhite();
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgBadge = useColorModeValue('teal.300', '#1a202c');
  return (
    <Box bg={bg} p="22px" rounded={15}>
      <div>
        <FormControl display="flex" alignItems="center" marginBottom={'16px'}>
          <Switch
            onChange={handleChangeOnOff}
            isChecked={
              onOffRegister ? onOffRegister.value === ON_OFF.ON : false
            }
            id="on-off-register"
          />
          <FormLabel htmlFor="on-off-register" mb="0" ml="12px">
            On/off register
          </FormLabel>
        </FormControl>

        <FormControl display="flex" alignItems="center" mt="10px" mb="24px">
          <Flex direction="column">
            <Text fontWeight="bold" mb="3px">
              Brokers:
            </Text>
            <Button
              bg="teal.300"
              width={150}
              disabled={isDataChange}
              rightIcon={<HiCheckCircle />}
              onClick={() => saveBrokerServer()}
              style={{ marginBottom: '24px' }}
            >
              Save Change
            </Button>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={6}>
                <Flex direction="column">
                  <Text fontWeight="bold" mb="3px">
                    AXI: AxiCorp Financial Services Pty Ltd
                  </Text>
                  {brokerServers &&
                    brokerServers.axi.map((e, i) => {
                      return (
                        <Text key={i}>
                          <Badge
                            p="7px"
                            borderRadius="5px"
                            margin={'5px'}
                            key={i}
                            bg={bgBadge}
                            color={textBadgeColor}
                            position="relative"
                          >
                            {e}
                            <Badge
                              position="absolute"
                              top="-1"
                              cursor="pointer"
                              onClick={() => removeBrokerServer('axi', i)}
                            >
                              x
                            </Badge>
                          </Badge>
                        </Text>
                      );
                    })}
                  <Flex>
                    <InputField
                      value={axiServer}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setAxiServer(event.target.value)
                      }
                    />
                    <Button
                      ml="5"
                      borderRadius="5px"
                      colorScheme="teal"
                      bg="teal.300"
                      onClick={() => addBrokerServer('axi')}
                    >
                      Add Server
                    </Button>
                  </Flex>
                </Flex>
              </GridItem>
              <GridItem colSpan={6}>
                <Flex direction="column">
                  <Text fontWeight="bold" mb="3px">
                    XM: XmCorp Financial Services Pty Ltd
                  </Text>
                  {brokerServers &&
                    brokerServers.xm.map((e, i) => {
                      return (
                        <Text key={i}>
                          <Badge
                            p="7px"
                            borderRadius="5px"
                            margin={'5px'}
                            key={i}
                            bg={bgBadge}
                            color={textBadgeColor}
                            position="relative"
                          >
                            {e}
                            <Badge
                              position="absolute"
                              top="-1"
                              cursor="pointer"
                              onClick={() => removeBrokerServer('xm', i)}
                            >
                              x
                            </Badge>
                          </Badge>
                        </Text>
                      );
                    })}
                  <Flex>
                    <InputField
                      value={xmServer}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setXMServer(event.target.value)
                      }
                    />
                    <Button
                      ml="5"
                      borderRadius="5px"
                      colorScheme="teal"
                      bg="teal.300"
                      onClick={() => addBrokerServer('xm')}
                    >
                      Add Server
                    </Button>
                  </Flex>
                </Flex>
              </GridItem>
            </Grid>
          </Flex>
        </FormControl>
      </div>
    </Box>
  );
}
