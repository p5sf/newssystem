import {createStore,combineReducers} from "redux";
import { collapsedReducer} from "./reducers/CollapsedReducer";

const reducer=combineReducers({

  collapsedReducer
})

const store = createStore(reducer);
export default store;
