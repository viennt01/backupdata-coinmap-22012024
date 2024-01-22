import styled from './ChooseYourPlan.module.scss';
import { Radio } from 'antd';

export default function ChooseYourPlan({
  packageList,
  monthSelected,
  handleChangePackage,
}) {
  return (
    <div className={styled.chooseYourPlanContainer}>
      <div className={styled.chooseYourPlan}>Choose a plan</div>
      {packageList &&
        packageList.map((p) => {
          return (
            <div key={p.name} className={styled.pricePackage}>
              <Radio
                className={styled.checkbox}
                onChange={() => handleChangePackage(p)}
                checked={monthSelected.id === p.id}
              >
                <div className={styled.namePricePackage}>
                  <div className={styled.name}>{p.name}</div>
                  {p.discount_rate > 0 && (
                    <div className={styled.saving}>
                      Saving{' '}
                      <span className={styled.savingPercentage}>
                        {p.discount_rate * 100}%
                      </span>
                    </div>
                  )}
                </div>
              </Radio>
            </div>
          );
        })}
    </div>
  );
}
