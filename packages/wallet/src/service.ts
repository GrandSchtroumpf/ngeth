import { Injectable, Inject } from '@angular/core';
import { hdkey, Wallet } from './models';

// Etherum
import { Eth, Account } from 'web3/types';
import Web3 from 'web3';
import * as bip39 from 'bip39';
import * as HDKey from 'hdkey';

// NGETH
import { ETH } from './../../eth/src/token';

@Injectable()
export class WalletService {

    private hdpath = "m/44'/60'/0'/0/";

    constructor(@Inject(ETH) private eth) {}

    public getWallet(): Wallet {
        return this.eth.accounts.wallet;
    }

    /** Generate a bip39 based 12 words mnemonic */
    public mnemonic(): string {
        return bip39.generateMnemonic();
    }

    /**
     * Generate a hdkey based on 12 words
     * @param mnemonic BIP 39 mnemonic (12 words)
     */
    public hdkey(mnemonic: string): hdkey {
        if (!mnemonic) { throw new Error('Please provide 12 words as a string'); }
        const seed = bip39.mnemonicToSeed(mnemonic);
        return HDKey.fromMasterSeed(seed) as hdkey;
    }

    /**
     * Create an account based on the HDkey
     * @param hdkey the hdkey to be derived
     * @param index 
     */
    public accountFromKey(hdkey: hdkey, index?: number): Account {
        const childKey = hdkey.derive(this.hdpath + (index ? index : 0));
        const privKey = childKey._privateKey.toString('hex');
        return this.eth.accounts.privateKeyToAccount(privKey);
    }

    /**
     * Add an account from an hdkey to a web3 Wallet
     * @param hdkey The hdkey to derive the account from
     * @param wallet The wallet to fill with accounts
     * @param index The index of the account
     */
    public addToWallet(hdkey: hdkey, wallet, index) {
        const account = this.accountFromKey(hdkey, index);
        wallet.add(account);
    }
    
    /**
     * Create a wallet based on a mnemonic
     * @param mnemonic the 12 words based on bip39
     * @param amount the amount of account to fill the wallet with
     */
    public create(mnemonic: string, amount?: number): Wallet {
        const hdkey = this.hdkey(mnemonic);
        const wallet: Wallet = this.eth.accounts.wallet.create(0, undefined);
        for (let i = 0; i < (amount ? amount : 1); i++) {
            this.addToWallet(hdkey, wallet, i);
        }
        return wallet;
    }

    public save(password: string, keyName?: string) {
        return this.eth.accounts.wallet.save(password, keyName);
    }

    public remove(account: string | number): boolean {
        return this.eth.accounts.wallet.remove(account);
    };

    public clear(): Wallet {
        return this.eth.accounts.wallet.clear();
    };

    public load(password: string, keyName?: string): Wallet {
        return this.eth.accounts.wallet.load(password, keyName);
    };
    
    
}
    
