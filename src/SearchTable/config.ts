import { exchangeDeclareStatus } from '@/constants/notice';

const declareOptions = [
  {
    type: 'search',
    placeholder: '申报ID',
    filter: 'id',
    width: '25%',
  },
  {
    type: 'search',
    placeholder: '申报依据',
    filter: 'noticeTitleLike',
    width: '25%',
  },
  {
    type: 'search',
    placeholder: '申报对象',
    filter: 'enterpriseNameLike',
    width: '25%',
  },
  {
    type: 'select',
    placeholder: '申报进度',
    filter: 'applyStatusList',
    filterType: 'array',
    width: '25%',
    key: '',
    options: [
      {
        key: '材料已提交',
        value: 1,
      },
      {
        key: '审核通过',
        value: 3,
      },
      {
        key: '审核不通过',
        value: 4,
      },
    ],
  },
  {
    type: 'select',
    placeholder: '受理部门',
    filter: 'noticePublisher',
    width: '25%',
    options: [],
  },
  {
    type: 'rangepicker',
    filter: ['startTime', 'endTime'],
    width: '25%',
  },
];

const exchangeOptions = [
  {
    type: 'search',
    placeholder: '兑现ID',
    filter: 'noticeTitle',
    width: '25%',
  },
  {
    type: 'search',
    placeholder: '兑现名称',
    filter: 'noticeTitleLike',
    width: '25%',
  },
  {
    type: 'search',
    placeholder: '兑现对象',
    filter: 'enterpriseNameLike',
    width: '25%',
  },
  {
    type: 'select',
    placeholder: '兑现进度',
    filter: 'applyStatusList',
    filterType: 'array',
    width: '25%',
    options: [
      {
        key: '材料已提交',
        value: 1,
      },
      {
        key: '银行处理中',
        value: 2,
      },
      // {
      //   key: '审核通过',
      //   value: 3,
      // },
      {
        key: '审核不通过',
        value: 4,
      },
      {
        key: '已到账',
        value: 5,
      },
    ],
  },
  {
    type: 'select',
    placeholder: '受理部门',
    filter: 'noticePublisher',
    width: '25%',
    options: [],
  },
  {
    type: 'rangepicker',
    filter: ['startTime', 'endTime'],
    width: '25%',
  },
];

export const baseInfoArray = [
  { key: 'ID：', value: 'id', hasPrefixText: true },
  { key: '对象：', value: 'enterpriseName', hasPrefixText: true },
  { key: '联系人：', value: 'username' },
  { key: '联系电话：', value: 'phone' },
  {
    key: '依据：',
    value: 'noticeTitle',
    hasPrefixText: true,
    isLink: true,
    target: '_blank',
    linkId: 'noticeId',
    linkUrl: '/policy/notice/',
  },
  { key: '受理部门：', value: 'noticePublisher' },
  { key: '生效日期：', value: 'noticeActiveStart' },
  { key: '截止日期：', value: 'noticeActiveEnd' },
  { key: '材料提交时间：', value: 'materialSubmittedTime' },
];

export const DOWNLOAD_STATUS: any = {
  1: {
    name: '初始化',
    value: 1,
    color: '#488DFF',
    bg: 'rgba(72,141,255,0.1)',
    colorDe: '#fff',
    bgDe: '#3D7EFF',
  },
  2: {
    name: '导出中',
    value: 2,
    color: '#FF7E3B',
    bg: 'rgba(255,126,59,0.1)',
    colorDe: '#fff',
    bgDe: '#FF9E3D',
  },
  3: {
    name: '导出成功',
    value: 3,
    color: '#00B145',
    bg: 'rgba(0,177,69,0.1)',
    colorDe: '#fff',
    bgDe: '#31CC31',
  },
  4: {
    name: '导出失败',
    value: 4,
    color: '#FF574B',
    bg: 'rgba(255,87,75,0.1)',
    colorDe: '#fff',
    bgDe: '#FF3D3D',
  },
};

export default {
  declareOptions,
  exchangeOptions,
  declareStatus: exchangeDeclareStatus,
  exchangeStatus: exchangeDeclareStatus,
};
