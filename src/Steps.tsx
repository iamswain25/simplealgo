import * as React from "react";

import { FormControl } from "baseui/form-control";
import { Spinner } from "baseui/spinner";

import { Card, StyledBody } from "baseui/card";

import { Textarea } from "baseui/textarea";
import * as Algosdk from "algosdk";
import { SimpleAlgoProps, Txn } from "./type";
import { ProgressSteps, NumberedStep } from "baseui/progress-steps";
import { Button, ButtonProps } from "baseui/button";
import { Input } from "baseui/input";
import { Notification, KIND } from "baseui/notification";
import { useStyletron } from "baseui";
const SpacedButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => ({
            marginLeft: $theme.sizing.scale200,
            marginRight: $theme.sizing.scale200,
            marginTop: $theme.sizing.scale200
          })
        }
      }}
    />
  );
};
const Address = ({ addr = "" }) => {
  if (addr.length) {
    return (
      <Notification
        overrides={{
          Body: { style: { width: "auto", wordBreak: "break-word" } }
        }}
      >
        <u>{addr}</u>
      </Notification>
    );
  }
  return null;
};

export default ({ url, token, port }: SimpleAlgoProps) => {
  const [current, setCurrent] = React.useState(0);
  const algod = React.useMemo(() => new Algosdk.Algod(token, url, port), [
    url,
    token,
    port
  ]);
  // algod.healthCheck().then(console.log);
  // algod.status().then(console.log);
  // algod.block(2183732).then(console.log);
  const [wallet, setWallet] = React.useState({
    addr: "",
    sk: new Uint8Array(),
    mnemonic: ""
  });
  const [mneError, setMneError] = React.useState(false);
  const [isLogin, setLogin] = React.useState(false);
  const createAccountHandler = React.useCallback(() => {
    const { addr, sk } = Algosdk.generateAccount();
    const mnemonic = Algosdk.secretKeyToMnemonic(sk);
    console.log(addr, sk);
    setWallet({ addr, sk, mnemonic });
    setCurrent(1);
    setLogin(false);
  }, []);
  const loginHander = React.useCallback(() => {
    setLogin(true);
    setCurrent(1);
  }, []);
  function saveMnemonic() {
    window.localStorage.setItem("algo-mnemonic", wallet.mnemonic);
  }
  function retrieveMnemonic() {
    const mnemonic = window.localStorage.getItem("algo-mnemonic") || "";
    setMneError(false);
    setWallet({ ...wallet, mnemonic });
  }
  function verifyMnemonic() {
    try {
      const { addr, sk } = Algosdk.mnemonicToSecretKey(wallet.mnemonic);
      const validAddr = Algosdk.isValidAddress(addr);
      if (validAddr) {
        setWallet({ ...wallet, addr, sk });
        setCurrent(2);
      } else {
        setMneError(true);
      }
    } catch (error) {
      alert(error);
      setMneError(true);
    }
  }
  const [algoAmount, setAlgoAmount] = React.useState<number | null>(null);
  const [txn, setTxn] = React.useState<Txn>({ fee: "0", isLoading: false });
  const getTxnParams = React.useCallback(() => {
    setTxn({ ...txn, isLoading: true });
    Promise.all([algod.status(), algod.versions()]).then(([res1, res2]) => {
      console.log(res1, res2);
      setTxn({
        ...txn,
        firstRound: String(res1.lastRound),
        lastRound: String(res1.lastRound + 100),
        genesisHash: res2.genesis_hash_b64,
        genesisID: res2.genesis_id,
        isLoading: false
      });
    });
  }, [txn, algod, setTxn]);
  React.useEffect(() => {
    if (wallet.addr.length && current === 2) {
      algod.accountInformation(wallet.addr).then((res: { amount: number }) => {
        console.log(res);
        setAlgoAmount(res.amount);
      });
    }
  }, [current, algod, wallet.addr]);

  function getSuggestedFee() {
    setTxn({ ...txn, isLoading: true });
    algod.suggestedFee().then(({ fee }: { fee: number }) => {
      setTxn({ ...txn, isLoading: false, fee: String(fee) });
    });
  }
  function signSend() {
    const rawTxn: Algosdk.Txn = {};
    const signedTxn = Algosdk.signTransaction(rawTxn, wallet.sk);
    console.log(signedTxn);
  }

  const [useCss, theme] = useStyletron();
  return (
    <ProgressSteps current={current}>
      <NumberedStep title="Get your Account">
        <div className={useCss({ ...theme.typography.font300 })}>
          Create a new account or login with an existing mnemonic
        </div>
        <SpacedButton onClick={createAccountHandler}>Create</SpacedButton>
        <SpacedButton onClick={loginHander}>Login</SpacedButton>
      </NumberedStep>
      <NumberedStep title="Remeber your mnemonic">
        <Card>
          <StyledBody>
            <div style={{ display: !isLogin ? "block" : "none" }}>
              <div>
                <i>Your Wallet address is:</i>
                <Address addr={wallet.addr} />
                and below is the password to your Algo wallet, never lose it!
                <div style={{ display: "flex" }}>
                  <Notification
                    kind={KIND.positive}
                    overrides={{
                      Body: {
                        style: { width: "auto", wordBreak: "break-word" }
                      }
                    }}
                  >
                    {wallet.mnemonic}
                  </Notification>
                  <Button onClick={saveMnemonic}>Save to browser</Button>
                </div>
              </div>
              <SpacedButton onClick={() => setCurrent(0)}>
                Previous
              </SpacedButton>
              <SpacedButton onClick={() => setCurrent(2)}>Next</SpacedButton>
            </div>
            <div style={{ display: isLogin ? "block" : "none" }}>
              input your mnemonic below
              <div style={{ display: "flex" }}>
                <Textarea
                  value={wallet.mnemonic}
                  error={mneError}
                  onChange={event =>
                    setWallet({
                      ...wallet,
                      mnemonic: event.currentTarget.value
                    })
                  }
                />
                <Button onClick={retrieveMnemonic}>
                  Retrieve from browser
                </Button>
              </div>
              <SpacedButton onClick={() => setCurrent(0)}>
                Previous
              </SpacedButton>
              <SpacedButton onClick={verifyMnemonic}>Next</SpacedButton>
            </div>
          </StyledBody>
        </Card>
      </NumberedStep>
      <NumberedStep title="Check the amount of Algo in the wallet">
        <div className={useCss({ ...theme.typography.font300 })}>
          {algoAmount === null ? (
            <Spinner />
          ) : (
            <Card>
              Amount (MicroAlgos):
              <StyledBody>{algoAmount}</StyledBody>
              in your Algo wallet address:
              <Address addr={wallet.addr} />
            </Card>
          )}
        </div>
        <SpacedButton onClick={() => setCurrent(1)}>Previous</SpacedButton>
        <SpacedButton
          onClick={() => {
            setCurrent(3);
            getTxnParams();
          }}
        >
          Next
        </SpacedButton>
      </NumberedStep>
      <NumberedStep title="Sign a transaction">
        <div className={useCss({ ...theme.typography.font300 })}>
          <FormControl label="to">
            <Input
              value={txn.to}
              onChange={e => setTxn({ ...txn, to: e.currentTarget.value })}
            />
          </FormControl>
          <FormControl label="amount">
            <Input
              value={txn.amount}
              onChange={e => setTxn({ ...txn, amount: e.currentTarget.value })}
            />
          </FormControl>
          <FormControl label="firstRound">
            <Input
              value={txn.firstRound}
              onChange={e =>
                setTxn({ ...txn, firstRound: e.currentTarget.value })
              }
            />
          </FormControl>
          <FormControl label="lastRound">
            <Input
              value={txn.lastRound}
              onChange={e =>
                setTxn({ ...txn, lastRound: e.currentTarget.value })
              }
            />
          </FormControl>
          <FormControl label="genesisID">
            <Input
              value={txn.genesisID}
              onChange={e =>
                setTxn({ ...txn, genesisID: e.currentTarget.value })
              }
            />
          </FormControl>
          <FormControl label="genesisHash">
            <Input
              value={txn.genesisHash}
              onChange={e =>
                setTxn({ ...txn, genesisHash: e.currentTarget.value })
              }
            />
          </FormControl>
          {/* <FormControl label="closeRemainderTo">
            <Input
              value={txn.closeRemainderTo}
              onChange={e =>
                setTxn({ ...txn, closeRemainderTo: e.currentTarget.value })
              }
            />
          </FormControl> */}
          <FormControl label="note">
            <Textarea
              value={txn.note}
              onChange={e => setTxn({ ...txn, note: e.currentTarget.value })}
            />
          </FormControl>
          <FormControl label="Fee">
            <div style={{ display: "flex" }}>
              <Input
                value={txn.fee}
                onChange={e => setTxn({ ...txn, fee: e.currentTarget.value })}
              />
              <Button onClick={getSuggestedFee} isLoading={txn.isLoading}>
                Suggested Fee?
              </Button>
            </div>
          </FormControl>
        </div>

        <SpacedButton onClick={() => setCurrent(2)}>Previous</SpacedButton>
        <SpacedButton onClick={signSend}>Sign and Send</SpacedButton>
      </NumberedStep>
      <NumberedStep title="Sending complete!">
        <div className={useCss({ ...theme.typography.font300 })}>
          wait and see if the transaction is successful
        </div>

        <SpacedButton onClick={() => setCurrent(3)}>Sign another</SpacedButton>
      </NumberedStep>
    </ProgressSteps>
  );
};
