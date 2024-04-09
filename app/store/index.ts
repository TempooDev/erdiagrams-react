import { combineReducers, createStore } from 'redux'
import { diagramReducer } from './diagram/reducers'
import { DiagramState } from './diagram/types';
import { InspectorState } from './inspector/types';
import { inspect } from 'util';
import { inspectorReducer } from './inspector/reducers';


export interface AppState {
    diagram: DiagramState;
    inspector: InspectorState;
}


const rootReducer = combineReducers({
    diagram: diagramReducer,
    inspector: inspectorReducer
});

export default function configureStore() {
    const store = createStore(rootReducer);
    return store;
}