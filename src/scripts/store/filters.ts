import { Store } from '../utils'

const actions = {
  setFilters (context: any, payload: any) {
    context.commit('setFiltersArray', payload)
  }
}

const mutations = {
  setFiltersArray (state: any, payload: any) {
    state.activeFilters.push(payload)
    return state
  }
}

const initialState = {
  activeFilters: []
}

const filtersStore = new Store({
  actions,
  mutations,
  initialState,
})

export default filtersStore
