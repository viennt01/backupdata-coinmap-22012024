import styled from './PaymentMethod.module.scss';
import { Form, Radio, Alert } from 'antd';
import PropTypes from 'prop-types';

export default function PaymentMethod({ paymentMethods }) {
  return (
    <div className={styled.container}>
      <h1 className={styled.header}>Payment method</h1>
      <div className={styled.content}>
        <Alert
          className={styled.warning}
          type="warning"
          showIcon
          message="Please ensure your receiving platform supports the token and network
            you are choosing."
        />
        <Form.Item
          className={styled.buyCurrency}
          name="buy_currency"
          rules={[{ required: true, message: 'Please select payment method' }]}
        >
          <Radio.Group className={styled.groupSelect}>
            {paymentMethods.map((method) => {
              return (
                <Radio
                  className={styled.groupItem}
                  value={method.currency}
                  key={method.id}
                >
                  <div className={styled.info}>
                    <img width={32} height={32} src={method.image_url} alt="" />
                    <div className={styled.name}>{method.name}</div>
                  </div>
                  <div className={styled.network}>{method.currency}</div>
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
}

PaymentMethod.propTypes = {
  paymentMethods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
    })
  ).isRequired,
};
