import React, { useEffect } from 'react'

import { AppBar, Toolbar, Typography, Button, Chip, Stack } from '@mui/material';

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
  const connector = metaMask
  const isActive = useIsActive()
  const error = useError()

  useEffect(() => {
    void metaMask.connectEagerly()
    if (error) {
      alert(error.message)
    }
  }, [error])

  const handleConnect = () => {
    connector.activate(contractChain)
  }

  const handleDisconnect = () => {
    connector.deactivate()
  }

  return (
    <div>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My DApp
          </Typography>

          {!isActive ?
            <Button variant="contained"
              color="inherit"
              onClick={handleConnect}
            >
              Connect to Wallet
            </Button>
            :
            <Stack direction="row" spacing={1}>
              <Chip label={getAddressTxt(accounts[0])} />
              <Button variant="contained"
                color="inherit"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </Stack>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
