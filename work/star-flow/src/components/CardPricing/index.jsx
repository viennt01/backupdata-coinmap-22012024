import Card, { TYPE_CARD } from './components/Card';
import styled from './index.module.scss';

function getTypeCard(price, type) {
  if (price == 0) {
    return TYPE_CARD.FREE;
  }
  return type;
}

export default function CardPricing({
  roleList,
  freeTrial,
  monthSelected,
  handleUpgradePackage,
  handleFreeTrial,
  handleLaunchPackage,
}) {
  return (
    <div className={styled.cardPricing}>
      {roleList &&
        roleList.map((r) => {
          return (
            <div
              key={r.id}
              style={{ width: `${100 / roleList.length}%` }}
              className={styled.cardPricingItem}
            >
              <div>
                <Card
                  role={r}
                  freeTrial={freeTrial}
                  monthSelected={monthSelected}
                  type={getTypeCard(r.price, r.type)}
                  handleUpgradePackage={handleUpgradePackage}
                  handleFreeTrial={handleFreeTrial}
                  handleLaunchPackage={handleLaunchPackage}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
