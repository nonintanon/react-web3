import React, { useEffect } from "react";

import {
  AppBar, Box, Toolbar, Typography, Button, IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

const [metaMask, hooks] = initializeConnector((actions) => new MetaMask(actions))
const { useAccounts, useError, useIsActive } = hooks
const contractChain = 55556

const getAddressTxt = (str, s = 6, e = 6) => {
  if (str) {
    return `${str.slice(0, s)}...${str.slice(str.length - e)}`;
  }
  return "";
};

function App() {
  const accounts = useAccounts()
  const error = useError()
  const isActive = useIsActive()
  const connector = metaMask

  useEffect(() => {
    void metaMask.connectEagerly()
  }, [])

  const handleLogin = () => {
    connector.activate(contractChain)
  }

  const handleLogout = () => {
    connector.deactivate()
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MyToken
            </Typography>
            {!isActive ?
              <Button color="inherit" onClick={handleLogin}>Connect</Button>
              :
              <>
                <Button color="inherit">{getAddressTxt(accounts[0])}</Button>
                <Button color="inherit" onClick={handleLogout}>Disconnect</Button>
              </>
            }
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default App;
