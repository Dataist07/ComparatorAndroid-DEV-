import { StatusBar } from 'expo-status-bar';
import MainContainer from './navigation/MainContainer';
import store from './store/store';
import {Provider} from 'react-redux';

// redux persist
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
let persistor = persistStore(store);



export default function App() {
  return(
    
    <Provider store = {store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainContainer/>
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>    
    );
  }
