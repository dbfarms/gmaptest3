export default (state = [], action) => {
    switch(action.type) {
      case 'GET_DRAWING_SUCCESS':
        return action //categories.data
      default:
        return state
    }
  }