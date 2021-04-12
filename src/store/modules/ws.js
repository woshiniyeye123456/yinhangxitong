const ws = {
  state: {
    ws: null,
    newMsg: false,
    todoNumber: 0,
  },
  
  mutations: {
    SET_NEWMSG: (state, newMsg) => {
      state.newMsg = newMsg
    },
    SET_WS: (state, ws) => {
      state.ws = ws;
    },
    SEND_MSG: (state, msg) => {
      if (state.ws) {
        state.ws.send(msg)
      }
    },
    SET_TODONUMBER: (state, num) => {
      if (num > 99) {
        num = '99+'
      }
      state.todoNumber = num
    },
  },
  
  actions: {}
}

export default ws
