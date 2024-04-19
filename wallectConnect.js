"use strict";

// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WallectConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;

//Address of the selected account
let selectedAccount;

function init() {
  if (location.protocol !== "https:") {
    const alert = document.querySelector("#alert-error-https");
    document.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
    return;
  }

  const providerOptions = {
    walletconnect: {
        package: WallectConnectProvider,
        options: {
            infuraId: ""
        }
    },

    fortmatic: {
        package: Fortmatic,
        options: {
            key: "",
        }
    }
  }
}
