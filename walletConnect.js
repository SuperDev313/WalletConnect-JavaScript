"use strict";

// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;

//Address of the selected account
let selectedAccount;

function init() {
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log(
    "window.web3 is",
    window.web3,
    "window.ethereum is",
    window.ethereum
  );

  // if (location.protocol !== "https:") {
  //   const alert = document.querySelector("#alert-error-https");
  //   alert.style.display = "block";
  //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
  //   return;
  // }

  // select wallet
  // const providerOptions = {
  //   walletconnect: {
  //     package: WalletConnectProvider,
  //     options: {
  //       infuraId: "",
  //     },
  //   },

  //   fortmatic: {
  //     package: Fortmatic,
  //     options: {
  //       key: "",
  //     },
  //   },
  // };

  web3Modal = new Web3Modal({
    cacheProvider: false,
    // providerOptions,
    disableInjectedProvider: false,
  });

  console.log("Web3Modal instanse is", web3Modal);
}

async function fetchAccountData() {
  const web3 = new Web3(provider);

  const chainId = await web3.eth.getChainId();
  console.log(chainId);
  const chainData = evmChains.getChain(chainId);
  console.log(chainData);
  document.querySelector("#network-name").textContent = chainData.name;

  const accounts = await web3.eth.getAccounts();

  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  document.querySelector("#selected-account").textContent = selectedAccount;

  const template = document.querySelector("#template-balance");
  const accountContainer = document.querySelector("#accounts");

  accountContainer.innerHTML = "";

  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

    const clone = template.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".address").textContent = humanFriendlyBalance;
    accountContainer.appendChild(clone);
  });

  await Promise.all(rowResolvers);

  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = " block";
}

async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  document.querySelector("#btn-connect").setAttribute("disabled", "disabled");

  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled");
}

async function onConnect() {
  console.log("Opening a diglog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  provider.on("networkChanged", (chainId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

async function onDisconnect() {
  console.log("Killing the wallet connection", provider);
  if (provider.close) {
    await provider.close();

    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

window.addEventListener("load", async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document
    .querySelector("#btn-disconnect")
    .addEventListener("click", onDisconnect);
});
