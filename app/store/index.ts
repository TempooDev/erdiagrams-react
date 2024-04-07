import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { AppState } from '../interfaces/states'



const rootReducer = combineReducers<AppState>({
    diagram: diagramReducer,
})
export default configureStore({
    reducer: {},
})