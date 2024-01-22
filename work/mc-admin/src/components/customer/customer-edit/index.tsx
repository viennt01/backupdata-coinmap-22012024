import { useRouter } from 'next/router';

import CustomerCreateForm from '../components/customer-create-form';
import { FormValues } from '../components/customer-create-form';
import { updateCustomer, updateNumberOfBot } from '../fetcher';
import { errorToast, successToast } from '@/hook/toast';
import { ERROR_CODE } from '@/constant/error-code';
import { NameOfBot, NumberOfBot, UserCreate } from '../interface';
import { useContext } from 'react';
import { AppContext } from '@/app-context';

export default function CustomerEdit() {
  const router = useRouter();
  const { merchantInfo } = useContext(AppContext);

  const { id } = router.query;
  // update guest info
  const handleSubmit = (formValues: FormValues) => {
    const userCusstomer: Omit<UserCreate, 'password'> = {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      gender: formValues.gender,
    };

    // handle update customer
    updateCustomer(userCusstomer, id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Update  successfully');
          return;
        }
        errorToast(res.message);
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed');
        console.log(e);
      });

    // update if merchant has update user bot permission
    if (merchantInfo && merchantInfo.config.update_user_bot) {
      const numberBotOfUser: NumberOfBot = {
        name: NameOfBot.NUMBER_OF_TBOT,
        value: formValues.number_of_tbot.toString(),
        description: '',
      };

      // handle update bot number
      updateNumberOfBot(numberBotOfUser, id as string);
    }
  };

  return (
    <div>
      <CustomerCreateForm editing handleSubmit={handleSubmit} />
    </div>
  );
}
