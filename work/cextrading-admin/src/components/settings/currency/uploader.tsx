import { Button } from '@chakra-ui/button';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Image,
  Input,
} from '@chakra-ui/react';
import { ERROR_CODE } from 'fetcher/interface';
import React, { useEffect, useState } from 'react';
import useToastHook, { STATUS } from 'components/hook/toast';
import { uploadImage } from './fetcher';

interface Props {
  setUrl: (url: string) => void;
  url?: string;
}

export default function FileUploader({ setUrl, url }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(url);
  const toast = useToastHook();
  useEffect(() => {
    setImageUrl(url);
  }, [url]);
  function handleOnchangeImabe(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      return uploadImage(formData)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            setImageUrl(res.payload.file_url);
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
  function handleSave() {
    if (imageUrl) {
      setUrl(imageUrl);
      onClose();
    }
  }
  return (
    <>
      <Button bg="teal.300" onClick={() => onOpen()}>
        Choose Image
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Choose Image
            </AlertDialogHeader>
            <AlertDialogBody>
              <Image
                borderRadius="full"
                boxSize="50px"
                src={imageUrl}
                alt=""
                mr="10px"
              />
              <Input
                placeholder="Enter your image url"
                onChange={(event) => setImageUrl(event.target.value)}
                value={imageUrl}
              />
              <input type="file" onChange={handleOnchangeImabe} />
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
              <Button bg="teal.300" onClick={handleSave} ml={3}>
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
