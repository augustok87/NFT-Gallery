import { useState } from "react";
import { NFTCard } from "../components/NftCard";
import { Pagination } from "../components/Pagination";

const Home = () => {
  const [wallet, setWalletAddress] = useState(
    "0xbC01E2E5d8a2fd1a0d347C07255664E4B7b5F944"
  );
  const [collection, setCollectionAddress] = useState(
    "0x27787755137863Bb7f2387Ed34942543C9F24EFE"
  );
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = process.env.API_KEY;
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: "GET",
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM";
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;

      let startToken = "0";
      let hasNextPage = true;
      let totalNftsFound = 0;
      let fullNFTs = [];

      async function callGetNFTsForCollectionOnce(startToken = "") {
        const url = `${baseURL}/?contractAddress=${collection}&startToken=${startToken}&withMetadata=${"true"}`;
        const presentNfts = await fetch(url, requestOptions).then((data) =>
          data.json()
        );
        // console.log("presentNfts", presentNfts);
        return presentNfts;
      }

      while (hasNextPage) {
        const { nfts, nextToken } = await callGetNFTsForCollectionOnce(
          startToken
        );

        if (nfts) {
          fullNFTs = await fullNFTs.concat(nfts);
        }
        console.log("fullNFTs", fullNFTs)
        await setNFTs(fullNFTs);
        

        if (!nextToken) {
          // When nextToken is not present, then there are no more NFTs to fetch.
          hasNextPage = false;
        }

        startToken = nextToken;
        totalNftsFound += nfts.length;
      }
    }
  };

  console.log("NFTsNFTsNFTs", NFTs);

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection}
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }}
        >
          Let's go!{" "}
        </button>
      </div>

      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {/* {NFTs.length &&
          NFTs.map((nft, i) => {
            return (
              <>
                <NFTCard nft={nft} key={i} collection={collection}></NFTCard>
              </>
            );
          })} */}

        {NFTs.length && (
          <>
            <Pagination
              data={NFTs}
              RenderComponent={NFTCard}
              // title="NFTs"
              pageLimit={5}
              dataLimit={15}
              collection={collection}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

// Challenge!
// 1. Make a small icon next to the contract address of each NFT so that if you click on it it get's copied to the clipboard.
// 2. Using startToken parameter from getNFTsForCollection function, make a pagination of 100 items per page.
