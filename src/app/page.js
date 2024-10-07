'use client';
import React, { useState, useContext, useEffect } from 'react';
import { CrowdFundingContext } from '../../Context/CrowdFunding';

export default function Home() {
  const { createCampaign, getCampaigns, currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [campaigns, setCampaigns] = useState([]); // Holds all campaigns

  useEffect(() => {
    // Set body background color to #0B103A
    document.body.style.backgroundColor = '#0B103A';
    
    // Cleanup function to reset the background color when the component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Fetch all campaigns initially
  const fetchCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('', error);
      setErrorMessage('');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle form submission for new donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCampaign = {
      title,
      description,
      amount,
      deadline,
    };

    try {
      await createCampaign(newCampaign);
      setErrorMessage('');
      
      // Add new campaign to the top of the existing campaigns
      setCampaigns([newCampaign, ...campaigns]);

      // Reset form values
      setTitle('');
      setDescription('');
      setAmount('');
      setDeadline('');
    } catch (error) {
      console.error('', error);
      setErrorMessage(error.message || '');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '10px', color: '#D4E300', textAlign: 'center' }}>MFund</h1>

      {!currentAccount ? (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            style={{ backgroundColor: 'yellow', color: '#0B103A', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ color: 'yellow', marginTop: '10px' }}>Connected Wallet: {currentAccount}</p>
        </div>
      )}

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px', color: 'yellow' }}>Make Donation</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', color: 'yellow' }}>Title:</label>
          <input
            style={{ width: '100%', padding: '10px' }}
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', color: 'yellow' }}>Description:</label>
          <textarea
            style={{ width: '100%', padding: '10px' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', color: 'yellow' }}>Amount:</label>
          <input
            style={{ width: '100%', padding: '10px' }}
            type='number'
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', color: 'yellow' }}>Deadline:</label>
          <input
            style={{ width: '100%', padding: '10px' }}
            type='date'
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>

        <button
          type='submit'
          style={{ backgroundColor: 'yellow', color: '#0B103A', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Make Donation
        </button>
        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      </form>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px', color: 'yellow' }}>Donations</h2>

      <div>
        {campaigns.map((campaign, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '20px', color: 'yellow' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{campaign.title}</h3>
            <p><strong>Description:</strong> {campaign.description}</p>
            <p><strong>Target Amount:</strong> {campaign.amount}</p> 
            <p><strong>Deadline:</strong> {new Date(campaign.deadline).toLocaleDateString()}</p>
            <p><strong>Send money to wallet address:</strong> {currentAccount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
