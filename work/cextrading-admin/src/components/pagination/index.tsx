import {
  Box,
  Button,
  HStack,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useBgWhite, useTextColor } from 'components/hook';
import { FILTER_DEFAULT } from 'constants/index';
import React from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

interface Props {
  page: number;
  totalPage: number;
  handleChangePage: (page: number) => void;
  handleChangeSize: (size: number) => void;
  total: number;
  size: number;
}

const getPages = ({
  page,
  totalPage,
}: {
  page: Props['page'];
  totalPage: Props['totalPage'];
}): number[] => {
  switch (page) {
    case 1: {
      if (totalPage === 1 || totalPage === 0) {
        return [];
      }
      if (totalPage === 2) {
        return [page, page + 1];
      }
      if (totalPage > 2) {
        return [page, page + 1, page + 2];
      } else {
        return [page, page + 1];
      }
    }
    case totalPage: {
      if (totalPage === 1) {
        return [];
      }
      if (totalPage === 2) {
        return [1, 2];
      }
      return [totalPage - 2, totalPage - 1, totalPage];
    }
    default: {
      if (totalPage === 1) {
        return [];
      }
      if (totalPage === 2) {
        return [page, page + 1];
      }
      return [page - 1, page, page + 1];
    }
  }
};

export default function Pagination({
  totalPage,
  handleChangePage,
  handleChangeSize,
  page,
  total,
  size,
}: Props) {
  const bgWhite = useBgWhite();
  const color = useTextColor();
  const activeBg = useColorModeValue('teal.300', 'white');
  const activeColor = useColorModeValue('white', 'grya.900');

  const handleChange = (p: Props['page']) => {
    if (p === page) {
      return;
    }
    handleChangePage(p);
  };

  const handleSelectSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChangeSize(Number(e.target.value));
  };

  const renderButton = () => {
    return getPages({ page, totalPage }).map((p) => {
      const actived = page === p;
      return (
        <Button
          key={p}
          p="0px"
          border="1px"
          borderRadius="10px"
          _hover={{
            bg: 'teal.300',
            color: 'white',
          }}
          color={actived ? activeColor : color}
          bg={actived ? activeBg : bgWhite}
          onClick={() => handleChange(p)}
        >
          {p}
        </Button>
      );
    });
  };
  return (
    <HStack mt="12px" spacing="8px">
      <Text fontWeight={'bold'}>
        Show: {page * size > total ? total : page * size}/{total}
      </Text>
      <Button
        p="0px"
        border="1px"
        borderRadius="10px"
        _hover={{
          bg: 'teal.300',
          color: 'white',
        }}
        color={color}
        bg={bgWhite}
        disabled={page === 1}
        onClick={() => handleChangePage(1)}
      >
        <HiChevronDoubleLeft />
      </Button>
      {renderButton()}
      <Button
        p="0px"
        border="1px"
        borderRadius="10px"
        _hover={{
          bg: 'teal.300',
          color: 'white',
        }}
        color={color}
        bg={bgWhite}
        disabled={page === totalPage || totalPage === 0}
        onClick={() => handleChangePage(totalPage)}
      >
        <HiChevronDoubleRight />
      </Button>
      <Box>
        <Select
          border="1px"
          value={size || FILTER_DEFAULT.size}
          onChange={handleSelectSize}
        >
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
          <option value="500">1000</option>
          <option value="500">2000</option>
        </Select>
      </Box>
    </HStack>
  );
}
