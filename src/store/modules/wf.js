const wf = {
  state: {
    wfEditableTabs: null,
  },
  
  mutations: {
    SET_WFEDITABLETABS: (state, editableTabs) => {
      state.wfEditableTabs = editableTabs
    },
    clear_WFEDITABLETABS: (state) => {
      state.wfEditableTabs = null;
    },
  },
  
  actions: {}
}

export default wf
