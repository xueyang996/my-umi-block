import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';

import * as CONST from '@/constantTable';
import searchTableConfig from '@/constantTable/tableConfig';
import pathToRegexp from 'path-to-regexp';
import moment from 'moment';
import {
  getOptionFromObj,
  getOptionFromArray,
  deepCloneF,
} from '@/utils/tableHandler';

import { fetchCommonAsync } from './service';

export default modelExtend(model, {
  namespace: 'mySearchTable',
  state: {
    total: 0,
    current: 1,
    pageSize: CONST.PAGE_SIZE_20,
    showCreate: false,
    deleteWarnModal: false,
    deleteTitle: '',
    deleteId: '',
    createText: '新建线索',
    defaultParams: {},
    options: [],
    columns: [],
    currentIds: [],
    currentItems: [],
    currentModalAction: {},
    currentModalData: {},
  },
  subscriptions: {
    setup({ dispatch, history }: any) {
      history.listen((location: Location) => {
        const match = pathToRegexp('/searchTable/:type').exec(
          location.pathname,
        );
        if (match) {
          const type = match[1];
          const config = searchTableConfig[type] || {};
          console.log(type, config);
          const { selectOptions: options = [], columns } = config;
          dispatch({
            type: 'updateState',
            payload: {
              options,
              columns,
            },
          });
          // return false;
          // 权限说明： 3 管理员， 2：律所  1： 律师
          const roleLevel = /public/.test(type)
            ? 3
            : /company/.test(type)
            ? 2
            : 1;
          dispatch({
            type: 'clear',
            payload: {
              total: 0,
              current: 1,
              pageSize: CONST.PAGE_SIZE_20,
              roleLevel,
              createText: '新建线索',
            },
          });
          const params = location.query || { page: 1 };
          const defaultParams = deepCloneF(params);
          const { rangeDate = [] } = config;
          // 已选择日期
          if (rangeDate.length > 0 && params[rangeDate[0]]) {
            defaultParams.rangeDate = [
              moment(params[rangeDate[0]]),
              moment(params[rangeDate[1]]),
            ];
          }

          dispatch({
            type: 'updateState',
            payload: {
              showCreate: /(public)|(companylawyerList)/.test(type),
              defaultParams,
              ...config,
            },
          });
          dispatch({
            type: 'fetchList',
            payload: params,
          });
          dispatch({
            type: 'queryOption',
            payload: {
              options: config.selectOptions,
            },
          });
        }
      });
    },
  },
  reducers: {
    clear(state, { payload }: any) {
      return {
        ...payload,
      };
    },
  },
  effects: {
    // 列表中获取数据
    *fetchList({ payload }, { call, put, select }) {
      console.log(payload);
      const {
        fetchUrl,
        fetchMethod = 'post',
        rangeDate,
        pageSize,
        roleLevel,
      } = yield select(state => state.mySearchTable);
      if (payload.rangeDate && payload.rangeDate.length > 0) {
        payload[rangeDate[0]] = moment(payload.rangeDate[0]).format(
          CONST.DATE_FORMAT,
        );
        payload[rangeDate[1]] = moment(payload.rangeDate[1]).format(
          CONST.DATE_FORMAT,
        );
      }
      delete payload.rangeDate;
      const data = yield call(fetchCommonAsync, {
        url: fetchUrl,
        ...payload,
        method: fetchMethod,
        pageSize,
      });
      console.log(data, '?????????/');
      const current = Number(payload.page) || 1;
      if (data instanceof Array) {
        yield put({
          type: 'updateState',
          payload: { currentItems: data, total: data.length, current },
        });
      } else {
        const {
          total = 10,
          records: currentItems = [
            {
              userName: 'reprehenderit in',
              userId: 'ex Duis',
              departmentId: -11336295.696878865,
              departmentName: 'nisi',
              departmentType: 30475047.602144122,
              petitionManager: 'Duis Lorem occaecat consectetur',
              roleId: -38288757.42732043,
              roleName: 'irur',
              status: 52806526.61542326,
            },
          ],
        } = data;
        yield put({
          type: 'updateState',
          payload: { total, current, currentItems },
        });
      }
    },
    // 列表中获取数据
    *queryOption({ payload: { options = [] } }, { call, put, select }) {
      for (let index = 0; index < options.length; index++) {
        const item: any = options[index];
        if (item.optionUrl) {
          const optionAll = yield select(state => state[CONST.OPTION_INFO]);
          const data = optionAll[item.optionGolbalName];
          if (data) {
            let resultOptions = getOptionFromArray(data, item.transKey);
            item.options = resultOptions;
          } else {
            let data;
            if (item.option2CurrentUser) {
              const { id } = yield select(state => state[CONST.ACCOUNT_INFO]);
              const dataObj = yield call(fetchCommonAsync, {
                url: item.optionUrl,
                method: item.optionMethod,
                roleCompanyId: id,
                currentPage: 1,
                pageSize: 1000,
              });
              data = dataObj.records || [];
            } else {
              const dataFetch = yield call(fetchCommonAsync, {
                url: item.optionUrl,
                method: 'get',
              });
              data = dataFetch.data;
            }
            if (!data) {
              continue;
            }
            let resultOptions = getOptionFromArray(data, item.transKey);
            console.log(resultOptions);
            item.options = resultOptions;
            yield put({
              type: `${CONST.OPTION_INFO}/updateState`,
              payload: {
                [item.optionGolbalName]: data,
              },
            });
          }
        }
      }
      yield put({ type: 'updateState', payload: { options } });
    },
    *handleTableAction({ payload }, { call, put, select }) {
      const { action, data, sendData } = payload;
      const { id, url, method } = action;
      let urlFetch = url;
      if (id) {
        urlFetch = url.replace(':id', data[id]);
      }
      yield call(fetchCommonAsync, {
        url: urlFetch,
        method,
        ...sendData,
      });
      yield put({
        type: 'updateState',
        payload: { modalVisible: false },
      });
      yield put({
        type: 'fetchList',
        payload: {
          page: 1,
        },
      });
    },
    // 删除item
    *deleteItem({ payload }, { call, put, select }) {
      const {
        deleteUrl,
        deleteId,
        deleteMethod,
        deleteParams = { deleteId: 'clueId' },
      } = yield select(state => state[CONST.TABLE_SEARCH_NAME_SPACE]);
      const url = deleteUrl.replace(':id', deleteId);
      yield call(fetchCommonAsync, {
        url,
        deleteId,
        deleteParams,
        deleteMethod,
      });
      yield put({
        type: 'updateState',
        payload: { deleteWarnModal: false, deleteId: '', deleteTitle: '' },
      });
      yield put({
        type: 'fetchList',
        payload: {
          page: 1,
        },
      });
    },
    *updateModalInfo(
      { payload }: { payload: { type: string; data: object } },
      { call, put, select },
    ) {
      if (payload.type === 'create' || payload.type === 'update') {
        const totalInfo = yield select(state => state.mySearchTable);
        const handleModal = totalInfo[`${payload.type}Modal`];
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: true,
            currentModalAction: handleModal,
            currentModalData: payload.data || {},
            currentTitleModal: handleModal.title,
            currentOkText: handleModal.okText,
            currentCancelText: handleModal.cancelText,
            formItemArray: handleModal.formItemArray,
          },
        });
      }
    },
  },
});
