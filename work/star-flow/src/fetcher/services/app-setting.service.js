import { withMinDelay } from '../utils';

const { get, put } = require('..');

const GATEWAY = 'API_USER_ROLES_GW';

const client = {
  get: get({
    gw: GATEWAY,
  }),
  put: (url, data) =>
    withMinDelay(
      put({
        gw: GATEWAY,
        data,
      })
    )(url),
};

/* -------------------------------------------------------------------------- */

/**
 * General response from API
 * @typedef {{
 *   error_code: 'UNKNOWN' | 'SUCCESS',
 *   message: string,
 * }} GeneralRes
 */

/**
 * Get list
 * @return {Promise<{
 *   error_code: string,
 *   message: string,
 *   payload: Array,
 * }>} result
 */
const getSettingsList = () => {
  return client.get('/user/app-setting/list');
};

/**
 * Get setting value by id
 * @param {string} id id of setting. Ex: ON_OFF_REGISTER
 * @return {Promise<{
 *   error_code: string,
 *   message: string,
 *   payload: { name: string, value: string },
 * }>} result
 */
const getSettingById = (id) => {
  return client.get(`/user/app-setting/${id}`);
};

/**
 * Query list of signals
 * @param {{
 *   name: string,
 *   value: string,
 *   description?: string,
 * }} setting
 * @return {Promise<{
 *    payload: Object,
 *    error_code: 'UNKNOWN' | 'SUCCESS',
 *    message: string
 * }>}
 */
const updateSetting = (setting) => {
  return client.put('/user/app-setting', setting);
};

/* -------------------------------------------------------------------------- */

const AppSettingService = {
  getSettingsList,
  getSettingById,
  updateSetting,
};
export default AppSettingService;
