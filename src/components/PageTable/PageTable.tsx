import React, { useState, useEffect, FC } from 'react';
import { Table, Button , message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterOptions from './FilterOptions';
import { IPageTableProps } from './interface';

import styles from './index.less';

const PageTable: FC<IPageTableProps> = props => {
  const {
    total,
    tableList,
    uniqueKey,
    getTableList,
    children,
    pageTitle,
    columns,
    filters = [],
    showRowSelection = false,
    exportFile,
    showCreate,
    showExtra,
    createTitle,
    createCallback,
    exportCallback,
    needExport,
    extraCallback,
    defaultCondtions = {},
    needRefresh,
  } = props;

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchConditons, setSearchConditions] = useState(defaultCondtions);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    refreshTableList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, searchConditons]);

  useEffect(() => {
    if (needRefresh) {
      refreshTableList();
    }
  }, [needRefresh]);

  const refreshTableList = () => {
    getTableList({
      pageNum,
      pageSize,
      ...searchConditons,
    });
  };

  const changePageNumAndSize = ({ num = pageNum, size = pageSize }) => {
    setPageNum(num);
    setPageSize(size);
  };

  const nColumns = columns.map(item => ({
    dataIndex: item.key,
    ...item,
  }));

  const handleSearchConditions = data => {
    setSearchConditions({ ...searchConditons, ...data });
    setPageNum(1);
    setPageSize(10);
  };

  const renderChildren = () => {
    const childrenComponent = React.Children.map(children, child => {
      return React.cloneElement(child, {
        refreshList: refreshTableList,
      });
    });

    return childrenComponent;
  };

  const onSelectChange = selectRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectRowKeys);
  };

  const rowSelection = needExport
    ? {
        selectedRowKeys,
        onChange: onSelectChange,
      }
    : undefined;

  const handleExport = () => {
    if(selectedRowKeys.length === 0) {
      message.error('请先选择要导出的数据');
    } else {
      exportCallback(selectedRowKeys);
    }
  };

  const handleCreate = () => {
    createCallback(searchConditons);
  };

  return (
    <PageHeaderWrapper>
      <div className={styles.pageTable}>
        <h3 className={styles.pageTitle}>{pageTitle}</h3>
        <div className={styles.pageFilters}>
          <div className={styles.filters}>
            <FilterOptions
              defaultCondtions={defaultCondtions}
              filters={filters}
              setFilterOpts={handleSearchConditions}
            />
          </div>

          {needExport ? (
            <Button className={styles.plus} onClick={handleExport} style={{ marginRight: '10px' }}>
              导出
            </Button>
          ) : null}

          {showCreate ? (
            <Button type="primary" className={styles.plus} onClick={handleCreate}>
              {createTitle}
            </Button>
          ) : null}
        </div>

        <Table
          bordered
          rowKey={record => record[`${uniqueKey}`]}
          columns={nColumns}
          dataSource={tableList}
          rowSelection={rowSelection}
          scroll={{ x: 1132 }}
          size="middle"
          pagination={{
            total,
            showQuickJumper: true,
            showTotal: total => `共有${total}条数据满足条件`,
            onChange: (page, pageSize) => changePageNumAndSize({ num: page, size: pageSize }),
            pageSize: 10,
            defaultCurrent: 1,
          }}
        />
        {renderChildren()}
      </div>
    </PageHeaderWrapper>
  );
};

PageTable.defaultProps = {
  filters: [],
  showCreate: false,
  needRefresh: false,
  needExport: false,
  uniqueKey: 'id',
};

export default PageTable;
