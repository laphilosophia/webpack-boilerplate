import { Store } from '../utils'

type InitialState = {
  selectedColor: string
}

const actions = {
  setColor (context: any, payload: any) {
    context.commit('setActiveColor', payload)
  }
}

const mutations = {
  setActiveColor (state: any, payload: any) {
    state.selectedColor = payload
    return state
  }
}

const initialState: InitialState = {
  selectedColor: ''
}

const colorStore = new Store({
  actions,
  mutations,
  initialState,
})

export default colorStore
