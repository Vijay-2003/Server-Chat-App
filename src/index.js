import React from 'react';
import ReactDOM from 'react-dom/client';
import Chatappmain from './Chatappmain';
import {ChakraProvider} from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
    <Chatappmain />
    </ChakraProvider>
  </React.StrictMode>
);

