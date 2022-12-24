import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";
import Lottie from "lottie-react";
import waveHand from "./theme/wave-hand.json";

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");
  const [showCurrent, setshowCurrent] = useState("No Wallet Connected");
  //All state property to store all waves
  const [allWaves, setAllWaves] = useState([]);
  const [waveCount, setWaveCount] = useState(0);
  const [tweetValue, setTweetValue] = React.useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [buttonText, setButtonText] = useState("👋");

  /*
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xeE3AA8301a805327aCcaBd276F6E2EE2cee09Bac";
  /*
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  //Create a method that gets all waves from your contract
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waving = await wavePortalContract.getAllWaves();

        // push addy, timestamp and message to useState
        let wavesCleaned = [];
        waving.forEach((wave) => {
          wavesCleaned.unshift({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
        /*
         * Store our data in React State
         */
        console.log("Cleaned:", wavesCleaned);
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      getWaveCount();
      setCurrentAccount(accounts[0]);
      setshowCurrent(accounts[0]);
      getAddress();
      getAllWaves();
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        //Execute the actual wave from your smart contract
        const waveTxn = await wavePortalContract.wave(tweetValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);

        setTweetValue("");
        setShowAnimation(true);
        setButtonText("Waiving...");

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count); // This will set wave count to the state
        setButtonText("👋");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAddress = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      let addyAccounts = "";
      for (let i = 0; i < 5; i++) addyAccounts += accounts[0][i];
      addyAccounts += ".......";
      for (let i = accounts[0].length - 5; i < accounts[0].length; i++)
        addyAccounts += accounts[0][i];
      setshowCurrent(addyAccounts);
    } catch (error) {
      console.log(error);
    }
  };

  const getWaveCount = useCallback(async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const count = await wavePortalContract.getTotalWaves();
      setWaveCount(count); // This will set the wave count to the state
    }
  }, [contractAddress, contractABI]);

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    getAddress();
    getWaveCount();
  }, [getWaveCount]);

  // Animation timeout 3sec
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [showAnimation]);

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [contractABI]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div>
          {" "}
          <span className="topleft">{Number(waveCount)} total messages</span>
          <span onClick={connectWallet} className="topright">
            {showCurrent}
          </span>
        </div>
        <div>
          <h1 className="header"> A MSG TO WEB3 </h1>{" "}
          <p className="header2">📩 </p>
        </div>

        <div className="bio">
          Connect your Goerli wallet to wave at me 🙋‍♂️ <br></br> Drop me a msg ✍🏻
          while you're on it!
        </div>
        <br></br>

        {currentAccount ? (
          <textarea
            className="tweetArea"
            placeholder="Enter message here..."
            type="text"
            id="tweet"
            value={tweetValue}
            onChange={(e) => setTweetValue(e.target.value)}
          />
        ) : null}
        <br></br>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {currentAccount && (
          <button className="waveButton" onClick={wave}>
            {buttonText}
          </button>
        )}

        {showAnimation && (
          <Lottie
            className="waveHand"
            animationData={waveHand}
            autoplay={true}
            loop={true}
          />
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="messages">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>
                Message: <span className="msgfont">{wave.message}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
