import style from './style.module.scss';
import { SvgCloseDialog } from '@/assets/images/svg';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

const PolicyDialog = ({ show, handleClose, ...props }) => {
  return (
    <Modal
      centered
      size="xl"
      show={show}
      onHide={handleClose}
      dialogClassName={style.modalPolicy}
      contentClassName={style.modalPolicyContent}
      {...props}
    >
      <Modal.Header bsPrefix={style.modalPolicyTitle}>
        <Modal.Title>TERMS OF SERVICE AND PAYMENT POLICY</Modal.Title>
        <SvgCloseDialog onClick={handleClose} />
      </Modal.Header>
      <Modal.Body bsPrefix={style.modalPolicyBody}>
        <ol>
          <h6>Last updated August 03, 2022</h6>
          <li>
            AGREEMENT TO TERMS
            <div>
              {`These Terms of Service constitute a binding agreement made between you, (“you, your, user”) and Coinmap ("Company," “we," “us," or “our”), concerning your access to and use of the coinmap.tech website. You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU DO NOT USE COINMAP.`}
            </div>
          </li>
          <li>
            CHANGES TO THE TERMS OF SERVICE
            <div>
              {`We may change these Terms of Service at any time. If you continue to use Coinmap after we post changes to these Terms of Service, you are signifying your acceptance of the new terms. You will always have access to our Terms of Service and will be able to check it at any time.`}
            </div>
          </li>
          <li>
            INTELLECTUAL PROPERTY RIGHTS
            <div>
              {`Coinmap grants all users of Coinmap.tech, to use images of Coinmap charts in analysis, press releases, books, articles, blog posts and other publications on the condition that images are clearly visible at all times when such charts and products are used.`}
            </div>
          </li>
          <li>
            USER REPRESENTATIONS
            <div>
              {`By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service; (4) you will not access the Site through automated or non-human means, whether through a bot, script, or otherwise; (5) you will not use the Site for any illegal or unauthorized purpose; and (6) your use of the Site will not violate any applicable law or regulation.`}
            </div>
            <div>
              {`If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof).`}
            </div>
          </li>
          <li>
            USER REGISTRATION
            <div>
              {`You are required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.`}
            </div>
          </li>
          <li>
            DISCLAIMER REGARDING CONTENT
            <div>
              {`Coinmap cannot and does not represent or guarantee that any of the information available through our services or on Coinmap is accurate, reliable, current, complete or appropriate for your needs. Various information available through our services may be specially obtained by from professional businesses or organizations, such as exchanges, news providers, market data providers and other content providers who are believed to be sources of reliable information (collectively, the "Data Providers"). Nevertheless, due to various factors — including the inherent possibility of human and mechanical error — the accuracy, completeness, timeliness, results obtained from use, and correct sequencing of information available through our services and website are not and cannot be guaranteed by Coinmap.`}
            </div>
          </li>
          <li>
            DISCLAIMER REGARDING INVESTMENT DECISIONS AND TRADING
            <div>
              {`Decisions to buy, sell, hold or trade in crypto, commodities, and other investments involve risk is yours. Under no circumstances shall we be liable for any loss or damage you incur as a result of any trading or investment activity that you engage in based on Coinmap.`}
            </div>
          </li>
          <li>
            DISCLAIMER REGARDING PAYMENT
            <div>
              {`No Liability for Errors/Omissions. You accept and acknowledge that we are not liable or responsible for any errors or omissions sent to the wrong cryptocurrency, currency wallet, or blockchain. We strongly encourage you to review your transaction details carefully before attempting to transfer a cryptocurrency.`}
            </div>
          </li>
          <li>
            PRIVACY POLICY
            <div>
              {`We care about data privacy and security. By using the Site, you agree to be bound by our Privacy Policy posted on the Site, which is incorporated into these Terms of Service.`}
            </div>
          </li>
          <li>
            PAYMENT POLICY
            <div>
              {`By ordering any subscription on Coinmap (including a free trial period) you confirm that you have read and accepted our Terms of Service.`}
            </div>
            <div>
              {`Each user can try any paid plan for 14 days free of charge. There are no refunds for monthly plans, even if the subscription is canceled on the same day of payment.`}
            </div>
            <div>
              {`The service is billed in advance on a monthly, annual. There will be no refunds or refunds for months unused with an open user account.`}
            </div>
            <div>
              {`After the due date, if no payment renewal is received, your subscription will be stopped.`}
            </div>
            <div>
              {`We do not offer refunds for initial payments by mistake. If you order the service for the first time, please make sure that the order is correct before the payment is made.`}
            </div>
            <div>
              {`We do not offer refunds for upgrades to a more expensive plan or a longer billing cycle. The remaining days are converted into an equivalent value of days on the new subscription.`}
            </div>
            <div>
              {`If you send funds that don't confirm by the timeout, please contact customer support:...............................`}
            </div>
            <div>
              {`If you don't send enough payment, that is OK.  You will receive an automatic email to remind send the remainder. Please send the remainder via the wallet address on email and we will combine them for you. You can also send from multiple wallets/accounts.`}
            </div>
            <div>
              {`If you send exceeded the payment amount, please contact customer support with the information below: `}
              <ol>
                <li>The transaction ID:</li>
                <li>The payment no:</li>
                <li>A payment address to send the funds to.</li>
              </ol>
              {`and it needs to be refunded by us manually there will be a refund fee of 5 USDT (including transaction fee and service fee). Please note that the refund claim must be sent with the email address used for the applicable Coinmap account. You must contact us within 14 Calendar days after an applicable CryptoCurrency Transaction for us to refund your cryptocurrency,  or it will be forfeited.`}
            </div>
          </li>
          <li>
            CONTACT US
            <div>
              {`In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:`}
              <div>
                <strong>Coinmap</strong>
              </div>
              <div>
                <strong>
                  <a
                    className={style.supportAnchor}
                    href="mailto:support@coinmap.tech"
                  >
                    support@coinmap.tech
                  </a>
                </strong>
              </div>
            </div>
          </li>
        </ol>
      </Modal.Body>
    </Modal>
  );
};

PolicyDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PolicyDialog;
