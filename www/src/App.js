import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';

import Main from './pages/Main';
import Checkout from './pages/Checkout';
import Finished from './pages/Finished';

import Footer from './Components/Footer';

smoothscroll.polyfill();

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  function handleEmail(email) {
    setEmail(email);
  }

  function handleStatus(status) {
    setStatus(status);
  }
  return (
    <BrowserRouter>
      <Route exact path="/" render={props => <Main {...props} handleEmail={handleEmail} />} />
      <Route
        exact
        path="/inscricao"
        render={props => <Checkout {...props} email={email} handleStatus={handleStatus} />}
        handleEmail={handleEmail}
      />
      <Route exact path="/obrigado" render={props => <Finished {...props} status={status} />} />
      <Footer />
    </BrowserRouter>
  );
}
