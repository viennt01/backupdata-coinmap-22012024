import React from 'react';
import { Flex, Box, useColorModeValue, Heading } from '@chakra-ui/react';
import ListTradeHistory from './list-trade-history';
interface props {
  fetchTradeHistory: boolean;
}

export default function BotTradingHistory({ fetchTradeHistory }: props) {
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <>
      <Box bg={bg} p="20px" borderRadius={15} marginTop={'1rem'}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          TRADE HISTORY
        </Heading>
        <Flex flexDirection="column">
          <ListTradeHistory fetchTradeHistory={fetchTradeHistory} />
        </Flex>
      </Box>
    </>
  );
}
