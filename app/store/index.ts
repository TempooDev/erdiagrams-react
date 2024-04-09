import { combineReducers } from 'redux'
import { diagramReducer } from './diagram/reducers'
import { DiagramState } from './diagram/types';
import { InspectorState } from './inspector/types';
import { inspect } from 'util';
import { inspectorReducer } from './inspector/reducers';
import { createStore } from '@reduxjs/toolkit';

export interface AppState {
    diagram: DiagramState;
    inspector: InspectorState;
}


const rootReducer = combineReducers({
    diagram: diagramReducer,
    inspector: inspectorReducer
});

export default function configureStore() {
    const store = createStore(rootReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
    return store;
}