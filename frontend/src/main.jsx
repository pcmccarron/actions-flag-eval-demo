import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { v4 as uuidv4 } from 'uuid';
import ls from 'local-storage';

function getUserId() {
  let id;
  console.log(import.meta.env.VITE_LD_CLIENT_KEY)
  if (ls.get('LD_User_Key')) {
    id = ls.get('LD_User_Key');
  } else {
    id = uuidv4();
    ls.set('LD_User_Key', id)
  }
  return id;
}

let id = getUserId();

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: import.meta.env.VITE_LD_CLIENT_KEY,
    key: 'anonymous'
  });

  ReactDOM.render(
    <LDProvider>
      <App />
    </LDProvider>,

    document.getElementById('root')
  );
})
  ();