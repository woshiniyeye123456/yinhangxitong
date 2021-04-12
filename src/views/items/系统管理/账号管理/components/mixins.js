import common from '../../../../../apis/common'
const LIKE = [
  'name',
  'number',
  'coding',
  'version',
  'security_scene',
  'creator',
  'updated_by',
];

const IN = [
  'property_label_id',
  'automation',
  'source',
  'risk_level',
];

const GreaterOrEqual = [
  'start_time'
];

const lessThanOrEqual = [
  'end_time'
];

import {
  getWeekFirstDay,
  getWeekLastDay,
  getMonthFirstDay,
  getMonthLastDay,
  getSeasonFirstDay,
  getSeasonLastDay,
  getYearFirstDay,
  getYearLastDay,
  addDay,
} from '../../../../../apis/date'

export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [common.getThisDay(), addDay(common.getThisDay(), 1)]);
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', [getWeekFirstDay(), addDay(getWeekLastDay(), 1)]);
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [getMonthFirstDay(), addDay(getMonthLastDay(), 1)]);
            }
          },
          {
            text: '本季',
            onClick(picker) {
              picker.$emit('pick', [getSeasonFirstDay(), addDay(getSeasonLastDay(), 1)]);
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', [getYearFirstDay(), addDay(getYearLastDay(), 1)]);
            }
          },
        ]
      },
      yesorno: ['是', '否'],
      sources: [
        {
          text: '是',
          label: 2,
        },
        {
          text: '否',
          label: 1,
        },
      ],
      statusList: ['开发中', '已启用', '已作废'],
      riskLevel: ['高', '中', '低'],
      runMode: ['自动', '手动'],
    }
  },
  methods: {
    addSearch(params) {
      let conds = [];
      if (params) {
        for (let key in params) {
          if (params[key]) {
            // console.log(key, params[key]);
            if (LIKE.indexOf(key) !== -1) {
              conds.push(key + ' LIKE ' + params[key])
            } else if (IN.indexOf(key) !== -1) {
              let len = params[key].length;
              if (len) {
                if (len === 1) {
                  conds.push(key + ' = ' + params[key][0])
                } else {
                  conds.push(key + ' IN [' + params[key].join(',') + ']')
                }
              }
            } else if (GreaterOrEqual.indexOf(key) !== -1) {
              conds.push(key + ' >= ' + params[key])
            } else if (lessThanOrEqual.indexOf(key) !== -1) {
              conds.push(key + ' <= ' + params[key])
            } else {
              conds.push(key + ' = ' + params[key])
            }
          }
        }
      }
      return conds;
    },
  }
}
