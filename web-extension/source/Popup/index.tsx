import * as React from 'react';
import ReactDOM from 'react-dom';
import { Suspense } from "react";
import "../ContentScript/i18n";
import Popup from './Popup';

ReactDOM.render(
  <Suspense fallback={<div>Loading... </div>}>
    <Popup />
  </Suspense>,
  document.getElementById("popup-root")
);
