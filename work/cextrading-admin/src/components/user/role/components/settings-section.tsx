import React, { useMemo } from 'react';
import { Grid, GridItem, Flex, Box, Text } from '@chakra-ui/react';
import CheckboxField from 'components/form/checkbox-field';
import InputField from 'components/form/input-field';
import SelectMultipleField from 'components/form/select-multiple-field';
import { General } from 'components/settings/general/interface';
import { Exchange } from 'components/settings/exchange/interface';
import { Feature } from 'components/settings/feature/interface';
import { ISymbol } from 'components/settings/symbol/interface';
import { Resolution } from 'components/settings/resolution/interface';
import { FormState, UseFormSetValue } from 'react-hook-form';
import { CreateRole } from '../interface';

interface Props {
  generals: General[];
  exchanges: Exchange[];
  features: Feature[];
  symbols: ISymbol[];
  resolutions: Resolution[];
  errors: FormState<CreateRole>['errors'];
  generalIds: General['generalSettingId'][];
  exchangeIds: Exchange['exchangeName'][];
  featureIds: Feature['featureId'][];
  symbolIds: ISymbol['symbol'][];
  resolutionIds: Resolution['id'][];
  setValue: UseFormSetValue<CreateRole>;
  valueLimit: {
    value: string;
    id: General['generalSettingId'];
  }[];
}

export default function SettingsSection({
  generals,
  exchanges,
  features,
  symbols,
  resolutions,
  errors,
  generalIds,
  exchangeIds,
  symbolIds,
  featureIds,
  resolutionIds,
  setValue,
  valueLimit,
}: Props) {
  const handleChangeValueLimit =
    (f: General) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let valueLimits = valueLimit;
      const exist = valueLimits.find((v) => v.id === f.generalSettingId);
      if (e.target.value) {
        if (exist) {
          valueLimits = valueLimits.map((v) => {
            if (v.id === exist.id) {
              v.value = e.target.value;
              return v;
            }
            return v;
          });
        } else {
          valueLimits.push({
            value: e.target.value,
            id: f.generalSettingId,
          });
        }
      } else {
        if (exist) {
          valueLimits = valueLimits.filter((v) => v.id !== f.generalSettingId);
        }
      }

      setValue('valueLimit', valueLimits, {
        shouldValidate: true,
      });
    };

  const handleChangeChecbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    let generals = generalIds;
    let valueLimits = valueLimit;

    if (e.target.checked) {
      const existed = generals.some((f) => f === e.target.value);
      if (existed) {
        // uncheck general id
        generals = generals.filter((f) => f !== e.target.value);

        valueLimits = valueLimits.filter((v) => v.id !== e.target.value);
        setValue('valueLimit', valueLimits);
      } else {
        generals = [...generals, e.target.value];
      }
    } else {
      // uncheck general id
      generals = generals.filter((f) => f !== e.target.value);

      valueLimits = valueLimits.filter((v) => v.id !== e.target.value);
      setValue('valueLimit', valueLimits);
    }
    setValue('generalIds', generals);
  };

  // cache by memo
  const featureOptions = useMemo(
    () =>
      features.map((feature) => {
        return {
          value: feature.featureId,
          label: feature.featureName,
        };
      }),
    [features],
  );

  const featureIdsSelected = useMemo(
    () =>
      features
        .filter((res) => featureIds.includes(res.featureId))
        .map((feature) => {
          return {
            value: feature.featureId,
            label: feature.featureName,
          };
        }),
    [features, featureIds],
  );

  const exchangeOptions = useMemo(
    () =>
      exchanges.map((exchange) => {
        return {
          value: exchange.exchangeName,
          label: exchange.exchangeName,
        };
      }),
    [exchanges],
  );

  const exchangeIdsSelected = useMemo(
    () =>
      exchanges
        .filter((res) => exchangeIds.includes(res.exchangeName))
        .map((exchange) => {
          return {
            value: exchange.exchangeName,
            label: exchange.exchangeName,
          };
        }),
    [exchanges, exchangeIds],
  );

  const symbolOptions = useMemo(
    () =>
      symbols.map((symbol) => {
        return {
          value: symbol.symbol,
          label: symbol.symbol,
        };
      }),
    [symbols],
  );

  const symbolIdsSelected = useMemo(
    () =>
      symbols
        .filter((res) => symbolIds.includes(res.symbol))
        .map((symbol) => {
          return {
            value: symbol.symbol,
            label: symbol.symbol,
          };
        }),
    [symbols, symbolIds],
  );

  const resolutionOptions = useMemo(
    () =>
      resolutions.map((resolution) => {
        return {
          value: resolution.id,
          label: resolution.displayName,
        };
      }),
    [resolutions],
  );

  const resolutionIdsSelected = useMemo(
    () =>
      resolutions
        .filter((res) => resolutionIds.includes(res.id))
        .map((resolution) => {
          return {
            value: resolution.id,
            label: resolution.displayName,
          };
        }),
    [resolutions, resolutionIds],
  );
  return (
    <>
      {generals.length > 0 && (
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={12}>
            <Flex>
              <Text fontWeight={600}>Generals </Text>
            </Flex>
          </GridItem>

          {generals &&
            generals.map((f, i) => {
              const isChecked = generalIds.some(
                (rf) => rf === f.generalSettingId,
              );
              const valLimit = valueLimit.find(
                (v) => v.id === f.generalSettingId,
              )?.value;

              return (
                <GridItem colSpan={12} key={`${f.generalSettingId}-${i}`}>
                  <Flex alignItems={'center'}>
                    <Box height={'52px'} width={'50%'}>
                      <CheckboxField
                        value={f.generalSettingId}
                        isChecked={isChecked}
                        onChange={handleChangeChecbox}
                      >
                        {f.generalSettingName}
                      </CheckboxField>
                    </Box>
                    {isChecked && (
                      <Box width={'50%'}>
                        <InputField
                          id="valueLimit"
                          placeholder="Enter value limit"
                          type="number"
                          value={valLimit || ''}
                          onChange={handleChangeValueLimit(f)}
                          error={!valLimit && errors.valueLimit?.message}
                        />
                      </Box>
                    )}
                  </Flex>
                </GridItem>
              );
            })}
        </Grid>
      )}
      {features.length > 0 && (
        <GridItem colSpan={12}>
          <Flex>
            <SelectMultipleField
              id="features"
              label="Features"
              placeholder="Enter features"
              disabled={false}
              options={featureOptions}
              value={featureIdsSelected}
              setValue={(featuresSelected) => {
                const featureValueSelected = featuresSelected.map((r) => {
                  return r.value;
                });

                setValue('featureIds', featureValueSelected);
              }}
            />
          </Flex>
        </GridItem>
      )}
      {exchanges.length > 0 && (
        <GridItem colSpan={12}>
          <Flex>
            <SelectMultipleField
              id="exchanges"
              label="Exchanges"
              placeholder="Enter exchanges"
              disabled={false}
              options={exchangeOptions}
              value={exchangeIdsSelected}
              setValue={(exchangesSelected) => {
                const exchangeValueSelected = exchangesSelected.map((r) => {
                  return r.value;
                });

                setValue('exchangeIds', exchangeValueSelected);
              }}
            />
          </Flex>
        </GridItem>
      )}
      {symbols.length > 0 && (
        <GridItem colSpan={12}>
          <Flex>
            <SelectMultipleField
              id="symbols"
              label="Symbols"
              placeholder="Enter symbols"
              disabled={false}
              options={symbolOptions}
              value={symbolIdsSelected}
              setValue={(symbolsSelected) => {
                const symbolValueSelected = symbolsSelected.map((r) => {
                  return r.value;
                });

                setValue('symbolIds', symbolValueSelected);
              }}
            />
          </Flex>
        </GridItem>
      )}
      {resolutions.length > 0 && (
        <GridItem colSpan={12}>
          <Flex>
            <SelectMultipleField
              id="resolution"
              label="Resolution"
              placeholder="Enter resolution"
              disabled={false}
              options={resolutionOptions}
              value={resolutionIdsSelected}
              setValue={(resolutionsSelected) => {
                const resolutionIdsSelected = resolutionsSelected.map((r) => {
                  return r.value;
                });

                setValue('resolutionIds', resolutionIdsSelected);
              }}
            />
          </Flex>
        </GridItem>
      )}
    </>
  );
}
