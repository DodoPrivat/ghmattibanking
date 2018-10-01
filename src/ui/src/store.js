import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    // language
    i18n: {
      lombank: 'Lombank',
      fleeca: 'Fleeca',
      'maze-bank': 'Maze-Bank',
    },
    // settings
    config: {
      locale: 'en-US',
      currency: 'USD',
    },
    // functionality
    display: 'account-select',
    isAtm: false,
    // bank data (passed to nui)
    bankName: 'fleeca',
    date: 'Mon, 07:32',
    location: 'Aguja Street - Vespucci Canals',
    user: '',
    currentAccount: 0,
    caOwner: '',
    caName: '',
    caNumber: '',
    caBank: '',
    caBalance: 0,
    caTransactions: [],
    accounts: [],
    // autocompleteData
    autocompleteTransfer: [],
    autocompleteAccess: [],
    autocompleteAccessValues: [],
  },
  mutations: {
    setDisplay(_, payload) {
      this.state.display = payload;
    },
    changeAccount(_, payload) {
      this.state.currentAccount = payload;
    },
    // make as action
    updateCA() {
      if (this.state.accounts.length > 0) {
        this.state.caOwner = this.state.accounts[this.state.currentAccount].owner;
        this.state.caName = this.state.accounts[this.state.currentAccount].accountname;
        this.state.caNumber = this.state.accounts[this.state.currentAccount].accountnumber;
        this.state.caBank = this.state.accounts[this.state.currentAccount].bank;
        this.state.caBalance = this.state.accounts[this.state.currentAccount].balance;
      } else {
        this.state.caOwner = '';
        this.state.caName = '';
        this.state.caNumber = '0000000000000000';
        this.state.caBank = 'fleeca';
        this.state.caBalance = 0;
      }
    },
    updateCATransactions() {
      if (this.state.accounts.length > 0) {
        this.state.caTransactions = this.state.accounts[this.state.currentAccount].transactions;
      } else {
        this.state.caTransactions = [];
      }
    },
    setDate(_, payload) {
      const date = new Date(payload.string);
      this.state.date = date.toLocaleTimeString(this.state.config.locale, {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    setLocation(_, payload) {
      this.state.location = payload.string;
    },
    setBankState(_, payload) {
      this.state.bankName = payload.bankName;
      this.state.isAtm = payload.isAtm;
    },
    setUser(_, payload) {
      this.state.user = payload.user;
    },
    updateAccountData(_, payload) {
      payload.accounts.forEach((currentAccount) => {
        const account = currentAccount;
        const index = this.state.accounts.findIndex(acc => acc.id === account.id);
        account.transactions = [];
        if (index > -1) this.state.accounts[index] = account;
        else this.state.accounts.push(account);
      });
    },
    updateTransactionData(_, payload) {
      payload.transactions.forEach((transaction) => {
        // find proper account id in accounts
        const index = this.state.accounts.findIndex(acc => acc.id === transaction.account);
        if (index > -1) this.state.accounts[index].transactions.push(transaction);
      });
    },
    removeAccount(_, payload) {
      this.state.accounts = this.state.accounts.filter(acc => payload.id !== acc.id);
    },
    setAutocompleteAccessData(_, payload) {
      this.state.autocompleteAccess = payload.data;
    },
    setAutocompleteAccessValues(_, payload) {
      this.state.autocompleteAccessValues = payload.data;
    },
    setAutocompleteTransferData(_, payload) {
      this.state.autocompleteTransfer = payload.data;
    },
    setConfig(_, payload) {
      this.state.config = payload.config;
      this.state.i18n = payload.locale;
    },
  },
  actions: {
    updateAccountData({ commit }, payload) {
      commit('updateAccountData', payload);
      commit('updateCA');
    },
    changeAccount({ commit }, payload) {
      commit('changeAccount', payload);
      commit('updateCA');
      commit('updateCATransactions');
    },
    updateTransactionData({ commit }, payload) {
      commit('updateTransactionData', payload);
      commit('updateCATransactions');
    },
  },
});
