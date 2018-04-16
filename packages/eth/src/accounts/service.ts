import { Injectable, Inject } from '@angular/core';
// Web3
import { ETH } from '../token';

// RXJS
import { Observable, bindNodeCallback, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class EthAccounts {

    constructor(@Inject(ETH) private eth) { }

    get defaultAccount(): string { return this.eth.defaultAccount; }
    set defaultAccount(account: string) { this.eth.defaultAccount = account; }

    /** Returns all accounts available */
    public getAccounts(): Observable<string[]> {
        return bindNodeCallback<string[]>(this.eth.getAccounts)();
    }

    /** Get the current account */
    public currentAccount(): Observable<string | Error> {
        if (this.eth.defaultAccount) {
            return of(this.eth.defaultAccount);
        } else {
            return this.getAccounts().pipe(
                tap((accounts: string[]) => {
                    if (accounts.length === 0) { throw new Error('No accounts available'); }
                }),
                map((accounts: string[]) => accounts[0]),
                tap((account: string) => this.eth.defaultAccount = account),
                catchError((err: Error) => of(err))
            );
        }
    }
}