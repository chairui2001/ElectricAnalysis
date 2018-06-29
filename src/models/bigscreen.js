import { bigscreenData } from '../services/api';

export default {
  namespace: 'bigscreen',

  state: {
    tradeData: [],
    userData: [],
    greenData: [],
    cpiData: [],
    priceData: [],
    trendData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(bigscreenData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        tradeData: [],
        userData: [],
        greenData: [],
        cpiData: [],
        priceData: [],
        trendData: [],
      };
    },
  },
};
