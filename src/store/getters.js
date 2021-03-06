const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  all_routers: state => state.permission.all_routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  user: state => state.user.user,
  modules: state => state.permission.modules,
  todoNumber: state => state.ws.todoNumber,
  newMsg: state => state.ws.newMsg,
  wfEditableTabs: state => state.wf.wfEditableTabs,
};
export default getters
