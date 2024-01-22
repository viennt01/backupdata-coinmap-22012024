import { withMinDelay } from '../utils';

const { get, post, deleteGW } = require('..');

const GATEWAY = 'API_USER_ROLES_GW';

const client = {
  get: withMinDelay(
    get({
      gw: GATEWAY,
    })
  ),
  post: withMinDelay(
    post({
      gw: GATEWAY,
    })
  ),
  delete: withMinDelay(
    deleteGW({
      gw: GATEWAY,
    })
  ),
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
 * Get list bots
 * @return {Promise<{
 *   error_code: string,
 *   message: string,
 *   payload: Array,
 * }>} result
 */
const getBotList = () => {
  return client.get('/user/bot/list');
};

/**
 * Get list paid bots
 * @return {Promise<{
 *   error_code: string,
 *   message: string,
 *   payload: Array,
 * }>} result
 */
const getPaidBotList = () => {
  return client.get('/user/bot/paid');
};

/**
 * Query list of signals
 * @param {{
 *   page?: number,
 *   size?: number,
 *   exchanges?: string,
 *   resolutions?: string,
 *   types?: string,
 *   symbols?: string,
 *   from?: number,
 *   to?: number,
 *   bot_ids?: string,
 * }} query
 * @return {Promise<{
 *    payload: { total: number, rows: Object[] },
 *    error_code: 'UNKNOWN' | 'SUCCESS',
 *    message: string
 * }>}
 */
const getSignals = (query) => {
  const queryStr = new URLSearchParams(query).toString();
  return client.get(`/user/bot/signals?${queryStr}`);
};

/**
 * Favorite a signal by id
 *
 * @param {string} id
 * @return {Promise<GeneralRes>}
 */
const favoriteSignal = (id) => {
  return client.post(`/user/bot/favorite-signal/${id}`);
};

/**
 * Remove favorite mark of a signal by id
 *
 * @param {string} id
 * @return {Promise<GeneralRes>}
 */
const unFavoriteSignal = (id) => {
  return client.delete(`/user/bot/favorite-signal/${id}`);
};

/* -------------------------------------------------------------------------- */

const BotService = {
  getBotList,
  getPaidBotList,
  getSignals,
  favoriteSignal,
  unFavoriteSignal,
};
export default BotService;
