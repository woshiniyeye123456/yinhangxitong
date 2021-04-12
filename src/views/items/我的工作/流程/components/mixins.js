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

import FileSaver from 'file-saver';

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
      statusList: ['开发中', '已启用', '已作废'],
      riskLevel: ['高', '中', '低'],
      runMode: ['自动', '手动'],
      strengtheningType: ['Android', 'iOS'],
      strengthening: [
        {
          id: 1,
          name: '通用app安全加固',
        },
        {
          id: 2,
          name: '金融行业app安全加固 V2',
        },
        {
          id: 3,
          name: '金融行业app安全加固 V3',
        },
        {
          id: 4,
          name: '金融行业app安全加固(含环境安全检查) V3',
        },
      ]
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
    
    getBaselineView(baselines, filters) {
      let reportDetails = '';
      let editableTabs = [];
      baselines.forEach(item => {
        let tab = editableTabs.find(tab => {
          return tab.group_name === item.group;
        });
        if (tab) {
          tab.baselines.push(item);
          tab.baseline_ids.push(item.id);
        } else {
          editableTabs.push({
            group_name: item.group,
            name: editableTabs.length + 1 + '',
            isReady: false,
            baseline_ids: [item.id],
            baselines: [item],
          })
        }
      });
      editableTabs.forEach((item, index) => {
        reportDetails += `<h1>${ index + 1 }. ${ item.group_name }</h1>`;
        if (this.params.testResult) {
          reportDetails += `<h2>${ this.params.testResult }</h2>`
        }
        if (item.baselines && item.baselines.length) {
          item.baselines.forEach((line, i) => {
            reportDetails += this.$common.filterBaseline(line, filters, i + 1);
          });
        }
      });
      return reportDetails;
    },
    
    downloadApp(e, filters) {
      let content = this.getBaselineView(this.params.baselines, filters);
      let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, this.$common.getThisTime() + ".doc");
    },
    
    filterParams(params) {
      if (params.masterPM_item) {
        params._masterPM = params.masterPM_item.real_name + ' (' + params.masterPM_item.name + ')' + ' (' + (params.masterPM_item.departments ? params.masterPM_item.departments[0].name : '') + ')';
        if (params.masterPM_item.roles) {
          let role = [];
          params.masterPM_item.roles.forEach(ro => {
            role.push(ro.name)
          });
          params._masterPM += ` (${ role.join(',') })`;
        }
      } else {
        params._masterPM = '';
      }
      if (this.params.pm_item) {
        params._pm = params.pm_item.real_name + ' (' + params.pm_item.name + ')' + ' (' + params.pm_item.department_name + ')';
        if (params.pm_item.roles) {
          let role = [];
          params.pm_item.roles.forEach(ro => {
            role.push(ro.name)
          });
          params._pm += ` (${ role.join(',') })`;
        }
      } else {
        params._pm = '';
      }
      if (params.taskOwner_item) {
        params._taskOwner = params.taskOwner_item.real_name + ' (' + params.taskOwner_item.name + ')' + ' (' + params.taskOwner_item.department_name + ')';
        if (params.taskOwner_item.roles) {
          let role = [];
          params.taskOwner_item.roles.forEach(ro => {
            role.push(ro.name)
          });
          params._taskOwner += ` (${ role.join(',') })`;
        }
      } else {
        params._taskOwner = '';
      }
      return params
    },
    
  }
}
