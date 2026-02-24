import React from 'react';
import TopPerformingCrypto from '../components/TopPerformingCrypto';

const Market = () => {
  return (
    <div className="p-2 md:p-4">
      <TopPerformingCrypto title="Top Performing Cryptocurrencies (24h)" limit={32} />
    </div>
  );
};

export default Market;
