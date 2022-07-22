import React, { useEffect, useState } from "react";

import { AppBar, Box, Toolbar, Typography, Button, IconButton, Stack, Container, Card, CardContent, TextField, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { ethers } from 'ethers';
import { formatEther,parseUnits } from '@ethersproject/units';
import abi from './abi.json'

import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

const [metaMask, hooks] = initializeConnector((actions) => new MetaMask(actions))
const { useAccounts, useError, useIsActive, useProvider } = hooks
const contractChain = 55556
const contractAddress = '0xd446009Abe52E80d392a9Bfa95121a7f01E76aC1'

const getAddressTxt = (str, s = 6, e = 6) => {
  if (str) return `${str.slice(0, s)}...${str.slice(str.length - e)}`;

  return "";
};

function App() {
  const accounts = useAccounts()
  const error = useError()
  const isActive = useIsActive()
  const provider = useProvider()

  const [isLoading, setIsLoading] = useState(true)
  const [balance, setBalance] = useState('')
  const [reiValue, setReiValue] = useState(0)

  const handleSetReiValue = (event) => setReiValue(event.target.value)
  const handleBuy = async () => {
    if (reiValue === '' || parseFloat(reiValue) === 0) {
      alert('Please enter REI')
      return
    }

    try {
      const signer = provider.getSigner()
      const smartContract = new ethers.Contract(contractAddress, abi, signer)
      const txHash = await smartContract.buy({
        from: accounts[0],
        value: parseUnits(reiValue, 'ether')
      })

      smartContract.on('Buy', (from, to, tokens) => {
        console.log(from, to, tokens, txHash)
        setIsLoading(true)
      })
    } catch(err) {
        console.log(err)
    }
  }

  const connector = metaMask
  const handleLogin = () => connector.activate(contractChain)
  const handleLogout = () => connector.deactivate()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const signer = provider.getSigner()
        const smartContract = new ethers.Contract(contractAddress, abi, signer)
        const myBalance = await smartContract.balanceOf(accounts[0])
        setBalance(formatEther(myBalance))
      } catch (err) {
        console.log(err)
      }
    }

    if (isLoading) {
      void metaMask.connectEagerly()
      setIsLoading(false)
    }

    if (isActive && !isLoading) fetchBalance()
    if (error) alert(error.message)

  }, [error, isLoading, isActive, accounts, provider])

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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>KPT</Typography>
            {!isActive
              ? <Button color="inherit" onClick={handleLogin}>Connect</Button>
              :
              <>
                <Button color="inherit">{getAddressTxt(accounts[0])}</Button>
                <Button color="inherit" onClick={handleLogout}>Disconnect</Button>
              </>
            }
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ mt: 2 }}>
        { isActive &&
          <div>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" align="center">KPT</Typography>
                  <TextField
                    id="address"
                    label="Address"
                    value={accounts[0]}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    id="balance"
                    label="KPT Balance"
                    value={balance}
                    InputProps={{ readOnly: true }}
                  />
                  <Divider />
                  <Typography variant="body1">Buy KPT (1 REI = 10 KPT)</Typography>
                  <TextField
                    required
                    id="outlined-required"
                    label="REI"
                    defaultValue=""
                    type="number"
                    onChange={handleSetReiValue}
                  />
                  <Button variant="contained" onClick={handleBuy}>Buy</Button>
                </Stack>
              </CardContent>
            </Card>
          </div>
        }
      </Container>
      </Box>
    </div>
  );
}

export default App;
