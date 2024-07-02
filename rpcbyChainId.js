const axios = require('axios');

// Fetcher utility function
const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`);
    return [];
  }
};

// Function to populate chain data with TVL
const populateChain = (chain, chainTvls) => {
  const chainTvl = chainTvls.find(tvl => tvl.chainId === chain.chainId);
  return {
    ...chain,
    tvl: chainTvl ? chainTvl.tvl : 0
  };
};

// Example overwrittenChains array
const overwrittenChains = [
  // Your overwritten chain data here
];

// Function to generate chain data based on a specific chainId
const generateChainData = async (chainId) => {
  try {
    // Fetch list of all chains
    const chains = await fetcher("https://chainid.network/chains.json");

    // Fetch TVL data for all chains
    const chainTvls = await fetcher("https://api.llama.fi/chains");

    // Create a map of overwritten chainIds for efficient lookup
    const overwrittenIds = overwrittenChains.reduce((acc, curr) => {
      acc[curr.chainId] = true;
      return acc;
    }, {});

    // Filter and process chains based on provided chainId
    const filteredChains = chains
      .filter(c => c.status !== "deprecated" && (c.chainId === chainId || overwrittenIds[c.chainId]))
      .concat(overwrittenChains)
      .map(chain => populateChain(chain, chainTvls))
      .sort((a, b) => {
        return (b.tvl ?? 0) - (a.tvl ?? 0);
      });

    return filteredChains;
  } catch (error) {
    console.error('Error generating chain data:', error);
    return []; // Return an empty array if there's an error
  }
};

// Example usage of the generateChainData function with a specific chainId
const userProvidedChainId = 56; // Replace this with the actual chainId provided by the user
generateChainData(userProvidedChainId)
  .then((data) => {
    console.log("Chain Data:");
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
