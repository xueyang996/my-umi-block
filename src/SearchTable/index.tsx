import React, { useState, Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import PageTable from '@/components/PageTable';
import MyForm from '@/components/MyFormV4';

import { beginDownloadDeclare } from '@/services/manageDeclareEx';
// import DeclareExModal from './DeclareExModal';
import { message, Form, Modal } from 'antd';
import { Link } from 'umi';
import styles from './ManageDeclareEx.less';
import moment from 'moment';
import { history } from 'umi';
import searchOption from './config';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export interface TableProps {
  currentItems: any[];
  columns: any[];
  modalVisible: boolean;
  currentTitleModal: string;
  currentOkText: string;
  currentCancelText: string;
  currentModalAction: object;
  currentModalData: object;
  formItemArray: any[];

  pageTitle: string;
  deleteTitle: string;
  tableId: number;
  createText: string;
  createLink: string;
  showCreate: boolean;
  total: number;
  tableLoading: boolean;
  options: any[];
  pageSize: number;
  defaultParams: object;
  deleteItem: string;
  rangeDate: string;
  tableList: string;
  getPublisher: (params: any) => Promise<any>;
  getTableList: (params: any) => Promise<any>;
  getItemInfo: (params: any) => Promise<any>;
  updateState: (params: any) => Promise<any>;
  handleTableAction: (params: any) => Promise<any>;
  // 更新弹窗中字段
  updateModalInfo: (params: any) => Promise<any>;
  location: object;
  typeText: string;
}

export const ManageDeclareEx: React.SFC<TableProps> = props => {
  const {
    currentItems = [],
    columns = [],
    modalVisible,
    currentTitleModal,
    currentOkText,
    currentCancelText,
    formItemArray,
    currentModalAction = {},
    currentModalData = {},
    pageTitle,
    deleteTitle,
    tableId,
    createText,
    createLink,
    showCreate,
    total,
    tableLoading,
    pageSize,
    defaultParams,
    deleteItem,
    rangeDate = [],

    tableList,
    getPublisher,
    getTableList,
    getItemInfo,
    updateState,
    updateModalInfo,
    handleTableAction,
    options = [],
    location = { pathname: '' },
    typeText,
  } = props;
  if (columns.length > 0 && !columns[columns.length - 1].render) {
    const element = columns[columns.length - 1];
    columns[columns.length - 1].render = (text, record) => {
      return (
        <div>
          {element.__editConfig.map(item => {
            return (
              <span
                style={{
                  cursor: 'pointer',
                  color: '#0090fb',
                  marginRight: '5px',
                }}
                key={item.text}
                onClick={() => {
                  handelAction(item, record);
                }}
              >
                {item.text}
              </span>
            );
          })}
        </div>
      );
    };
  }
  console.log(columns, '#######');
  const handelAction = (item: any, record: any) => {
    if (item.type === 'warn') {
      Modal.confirm({
        title: item.text,
        content: item.warnText,
        onOk() {
          handleTableAction({ action: item, data: record });
        },
        onCancel() {},
      });
    } else {
      updateModalInfo({ type: item.type, data: record });
    }
  };
  const modalCancel = () => {
    updateState({ modalVisible: false });
  };
  const createCallBack = () => {
    updateModalInfo({ type: 'create' });
  };
  const onCreate = (values: object) => {
    handleTableAction({
      action: currentModalAction,
      data: currentModalData,
      sendData: values,
    });
  };
  const [form] = Form.useForm();
  return (
    <div>
      <PageTable
        total={total}
        pageTitle={pageTitle}
        tableList={currentItems}
        getTableList={getTableList}
        columns={columns}
        filters={options}
        showCreate={true}
        createTitle={'新增部门'}
        createCallback={createCallBack}
      ></PageTable>
      <Modal
        visible={modalVisible}
        title={currentTitleModal}
        okText={currentOkText}
        cancelText={currentCancelText}
        onCancel={modalCancel}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              // form.resetFields();
              onCreate(values);
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <MyForm
          form={form}
          labelAlign="left"
          formLayout={formItemLayout}
          formItemArray={formItemArray}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ mySearchTable }: { mySearchTable: TableProps }) =>
  mySearchTable;

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getTableList: params =>
      dispatch({ type: 'mySearchTable/fetchList', payload: params }),
    getItemInfo: params =>
      dispatch({ type: 'mySearchTable/queryItemInfo', payload: params }),
    getPublisher: params =>
      dispatch({ type: 'mySearchTable/queryFilterOpts', payload: params }),
    updateState: (params: any) =>
      dispatch({ type: 'mySearchTable/updateState', payload: params }),
    updateModalInfo: (params: any) =>
      dispatch({ type: 'mySearchTable/updateModalInfo', payload: params }),
    handleTableAction: (params: any) =>
      dispatch({ type: 'mySearchTable/handleTableAction', payload: params }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDeclareEx);
