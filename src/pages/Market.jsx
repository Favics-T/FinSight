import React from 'react';
import TopPerformingCrypto from '../components/TopPerformingCrypto';

const Market = () => {
  return (
    <TopPerformingCrypto title="Top Performing Cryptocurrencies (24h)" limit={32} />
  );
};

export default Market;
