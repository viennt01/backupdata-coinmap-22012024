import React, { UIEvent, useEffect, useState } from 'react';
import { Checkbox, Typography } from 'antd';
import styled from './index.module.scss';
import { DownOutlined, InfoOutlined } from '@ant-design/icons';
import CustomButton from '@/components/common/custom-button';
import useI18n from '@/i18n/useI18N';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import debounce from '@/utils/debounce';

const { Title } = Typography;
const DEVIATION = 2; //discrepancy between screens
interface PolicyProps {
  handleAcceptPolicy: () => void;
  loading: boolean;
  paymentPolicy: {
    content: string;
  };
}

export default function Policy({
  handleAcceptPolicy,
  loading,
  paymentPolicy,
}: PolicyProps) {
  const [disabledConfirmCheckbox, setDisabledConfirmCheckbox] = useState(true);
  const [checkedAgreedPolicy, setCheckedAgreedPolicy] = useState(false);
  const { translate: translatePayment } = useI18n('payment-form');

  useEffect(() => {
    const divElement = document.getElementById('policy');
    if (divElement) {
      const canNotScroll = divElement.scrollHeight <= divElement.clientHeight;
      // Check if the content of the policy is not scrollable, then automatically expand the tick mark
      if (canNotScroll) {
        setDisabledConfirmCheckbox(false);
      }
    }
  }, []);
  const onChange = (e: CheckboxChangeEvent) => {
    setCheckedAgreedPolicy(e.target.checked);
  };

  const handleScroll = debounce((event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      const positionOfScrollBar = target.offsetHeight + target.scrollTop;
      const scrollHeight = target.scrollHeight - DEVIATION;
      if (positionOfScrollBar >= scrollHeight) {
        setDisabledConfirmCheckbox(false);
      }
    }
  }, 400);

  const scrollPolicyToBottom = () => {
    const element = document.getElementById('policy');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  return (
    <div className={styled.modalContainer}>
      <Title>
        <InfoOutlined className={styled.icon} />
        {translatePayment('modal_policy.title')}
      </Title>
      <div className={styled.contentContainer}>
        <p>
          <strong>{translatePayment('modal_policy.subtitle')}</strong>
          <br />
          <div
            className={styled.content}
            id="policy"
            onScroll={handleScroll}
            dangerouslySetInnerHTML={{
              __html: paymentPolicy.content,
            }}
          />
        </p>
        <DownOutlined
          hidden={!disabledConfirmCheckbox}
          className={styled.scrollDownIndicator}
          onClick={scrollPolicyToBottom}
        />
      </div>
      <div className={styled.confirmCheckbox}>
        <Checkbox
          defaultChecked={false}
          onChange={onChange}
          checked={checkedAgreedPolicy}
          disabled={disabledConfirmCheckbox}
        >
          {translatePayment('modal_policy.accept_policy')}
        </Checkbox>
      </div>
      <div className={styled.footerContainer}>
        <CustomButton
          className={styled.actionButton}
          onClick={handleAcceptPolicy}
          disabled={!checkedAgreedPolicy}
          loading={loading}
        >
          {translatePayment('get_it')}
        </CustomButton>
      </div>
    </div>
  );
}
