import { useState } from 'react';
import styled from './Card.module.scss';
import CustomButton from '@/components/Payment/CustomButton';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import { EXPIRE_STATUS } from '@/constant/codeConstants';
import BlurModal from '@/components/BlurModal';
import { calculateAmount } from '@/utils/payment';

function FreeTrial({ freeTrial, handleFreeTrial }) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <div className={styled.freeTrialContainer}>
        <h1 className={styled.freeTrialName}>
          Explore full our features in <span>14 days</span>
        </h1>
        <div className={styled.freeTrialButtonContainer}>
          <CustomButton
            className={styled.freeTrialButton}
            append={<SvgArrowRightLong />}
            onClick={() => setShowPopup(true)}
          >
            FREE TRIAL
          </CustomButton>
        </div>
      </div>
      <BlurModal open={showPopup} onClose={() => setShowPopup(false)}>
        <div className={styled.freeTrialPopup}>
          <h1 className={styled.freeTrialPopupTitle}>
            Explore full our features in <span>14 days</span>
          </h1>
          <p className={styled.freeTrialPopupDescription}>
            {freeTrial.description}
          </p>
          <FeatureList featureList={freeTrial.description_features.features} />
          <div className={styled.freeTrialPopupButtonContainer}>
            <CustomButton
              className={styled.freeTrialPopupButton}
              append={<SvgArrowRightLong />}
              onClick={() => {
                setShowPopup(false);
                handleFreeTrial();
              }}
            >
              FREE TRIAL
            </CustomButton>
          </div>
        </div>
      </BlurModal>
    </>
  );
}

function Title({ role }) {
  return (
    <div className={styled.titleWrapper}>
      <span className={styled.title}>{role.role_name}</span>
    </div>
  );
}

function ExpiredTag({ expiredAt }) {
  const now = new Date().getTime();
  if (expiredAt && Number(expiredAt) <= now) {
    return <div className={styled.expiredTag}>Expired</div>;
  }
  return null;
}

function Price({ role, monthSelected }) {
  return (
    <div className={styled.priceContainer}>
      {role.status === STATUS_CARD.OPEN && (
        <div className={styled.pricing}>
          <div className={styled.currency}>{role.currency}</div>
          <div className={styled.priceContainer}>
            <div className={styled.price}>
              {calculateAmount(
                role.price,
                1,
                monthSelected.discount_rate,
                monthSelected.discount_amount
              )}
            </div>
            <div className={styled.time}>/mo</div>
          </div>
        </div>
      )}
      {role.status === STATUS_CARD.COMINGSOON && (
        <div className={styled.comingSoon}>Coming soon</div>
      )}
      <ExpiredTag expiredAt={role.expires_at} />
    </div>
  );
}

function FeatureList({ featureList }) {
  return (
    <div className={styled.featureListContainer}>
      <div className={styled.keyFeatures}>Key Features</div>
      <ul className={styled.featureList}>
        {featureList &&
          featureList.length > 0 &&
          featureList.map((d) => (
            <li key={d} className={styled.featureItem}>
              <div>{d}</div>
            </li>
          ))}
      </ul>
    </div>
  );
}

function ActionButton({
  expiredAt,
  disabled,
  handleUpgradePackage,
  handleLaunchPackage,
}) {
  const renderButton = ({ label, className, handler }) => (
    <CustomButton
      disabled={disabled}
      className={[className, disabled ? styled.disabledButton : ''].join(' ')}
      append={<SvgArrowRightLong />}
      onClick={handler}
    >
      {label}
    </CustomButton>
  );

  switch (expiredAt) {
    case EXPIRE_STATUS.FIRST_BUY: {
      return renderButton({
        label: 'UPGRADE',
        className: styled.upgradeButton,
        handler: handleUpgradePackage,
      });
    }
    case EXPIRE_STATUS.UNLIMITED: {
      return renderButton({
        label: 'LAUNCH',
        className: styled.launchButton,
        handler: handleLaunchPackage,
      });
    }
    default: {
      const now = new Date().getTime();
      if (Number(expiredAt) > now) {
        return renderButton({
          label: 'LAUNCH',
          className: styled.launchButton,
          handler: handleLaunchPackage,
        });
      } else {
        return renderButton({
          label: 'RENEWAL',
          className: styled.upgradeButton,
          handler: handleUpgradePackage,
        });
      }
    }
  }
}

export const TYPE_CARD = {
  FREE: 'FREE',
  BEST_CHOICE: 'BEST_CHOICE',
};

export const STATUS_CARD = {
  OPEN: 'OPEN',
  COMINGSOON: 'COMINGSOON',
};

export const USER_STATUS = {
  PROCESSING: 'PROCESSING',
  CURRENT_PLAN: 'CURRENT_PLAN',
  DISABLED: 'DISABLED',
};

export default function Card({
  type,
  freeTrial,
  role,
  monthSelected,
  handleUpgradePackage,
  handleFreeTrial,
  handleLaunchPackage,
}) {
  const disabledCard = role.status !== STATUS_CARD.OPEN;

  switch (type) {
    case TYPE_CARD.FREE: {
      return (
        <div
          style={freeTrial && freeTrial.expires_at ? { height: '100%' } : {}}
          className={styled.cardFreeTrialContainer}
        >
          <div className={styled.cardContainer}>
            <div>
              <Title role={role} />
              <Price role={role} monthSelected={monthSelected} />
              <p className={styled.cardDescription}>{role.description}</p>
              <FeatureList featureList={role.description_features.features} />
            </div>
          </div>
          {freeTrial && !freeTrial.expires_at && (
            <FreeTrial
              handleFreeTrial={handleFreeTrial}
              freeTrial={freeTrial}
            />
          )}
        </div>
      );
    }
    case TYPE_CARD.BEST_CHOICE: {
      return (
        <div className={styled.cardBestContainer}>
          <div className={styled.bestLabel}></div>
          <div className={[styled.cardContainer, styled.best].join(' ')}>
            <div>
              <Title role={role} />
              <div className={styled.priceContainer}>
                <div className={styled.pricing}>
                  <div className={[styled.currency, styled.best].join(' ')}>
                    {role.currency}
                  </div>
                  <div className={styled.priceContainer}>
                    <div className={[styled.price, styled.best].join(' ')}>
                      {calculateAmount(
                        role.price,
                        1,
                        monthSelected.discount_rate,
                        monthSelected.discount_amount
                      )}
                    </div>
                    <div className={[styled.time, styled.best].join(' ')}>
                      /mo
                    </div>
                  </div>
                </div>
                <ExpiredTag expiredAt={role.expires_at} />
              </div>
              <p className={[styled.cardDescription, styled.best].join(' ')}>
                {role.description}
              </p>
              <div
                className={[styled.featureListContainer, styled.best].join(' ')}
              >
                <div className={[styled.keyFeatures, styled.best].join(' ')}>
                  Key Features
                </div>
                <ul className={[styled.featureList, styled.best].join(' ')}>
                  {role.description_features.features &&
                    role.description_features.features.length > 0 &&
                    role.description_features.features.map((d) => (
                      <li
                        key={d}
                        className={[styled.featureItem, styled.best].join(' ')}
                      >
                        {d}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className={styled.upgradeButtonContainer}>
              <ActionButton
                expiredAt={role.expires_at}
                disabled={disabledCard}
                handleUpgradePackage={() => handleUpgradePackage(role.id)}
                handleLaunchPackage={handleLaunchPackage}
              />
            </div>
          </div>
          <div className={styled.bottomBestCard}></div>
        </div>
      );
    }
    default: {
      return (
        <div className={styled.cardContainer}>
          <div>
            <Title role={role} />
            <Price role={role} monthSelected={monthSelected} />
            <p className={styled.cardDescription}>{role.description}</p>
            <FeatureList featureList={role.description_features.features} />
          </div>
          <div className={styled.upgradeButtonContainer}>
            <ActionButton
              expiredAt={role.expires_at}
              disabled={disabledCard}
              handleUpgradePackage={() => handleUpgradePackage(role.id)}
              handleLaunchPackage={handleLaunchPackage}
            />
          </div>
        </div>
      );
    }
  }
}
