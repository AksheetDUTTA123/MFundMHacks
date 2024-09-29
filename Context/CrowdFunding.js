'use client'
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// INTERNAL IMPORTS
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from "./Constants";

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CROWDFUNDING_ADDRESS, CROWDFUNDING_ABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding";
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState(null);

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.createCampaign(
        title,
        description,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime()
      );
      await transaction.wait();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const campaigns = await contract.getCampaigns();
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.amount.toString()), // Corrected line
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));
  
    return parsedCampaigns;
  };
  
  const ifWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        setError("Install Metamask");
        return false;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        return true;
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("Something wrong while connecting to the wallet ", error);
      return false;
    }
  };

  useEffect(() => {
    ifWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Install Metamask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Something wrong while connecting to the wallet", error);
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        connectWallet,
        createCampaign,
        getCampaigns,
        error,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
