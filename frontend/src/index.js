import React , {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducers/auth';
import thunk from 'redux-thunk'
import { Spin } from 'antd';
const composeEnhances = window.__REDUX_DEVTOOLS_EXTINSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhances(
    applyMiddleware(thunk)
))

const app = (
    <Suspense fallback={(
        <div style={{ right: '680px', position: 'absolute', top: '300px', }}>

            <Spin size="large" tip="Loading...">

            </Spin>
        </div>   
           
    )}>
    <Provider store={store}>
        <App />
    </Provider>
    </Suspense>
)

ReactDOM.render(app, document.getElementById('root'));
