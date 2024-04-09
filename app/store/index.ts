import { combineReducers } from 'redux'
import { diagramReducer } from './diagram/reducers'
import { DiagramState } from './diagram/types';

export interface AppState {
    diagram: DiagramState;
}


const rootReducer = combineReducers({
    diagram: diagramReducer
});

export default function configureStore() {
}