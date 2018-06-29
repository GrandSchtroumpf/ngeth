import { Account, Eth } from '@ngeth/provider';
import { Wallet } from '@ngeth/wallet';
import { Component, OnInit } from '@angular/core';
import { EncoderTestContract, TestEventContract } from '@ngeth/contract';
const bytecode = require('./test-event/bytecode.json');
import { tap, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    public eth: Eth,
    public account: Account,
    public wallet: Wallet,
    public encoderTest: EncoderTestContract,
    public testEvent: TestEventContract
  ) {}

  public deploy() {
    this.account.getAccounts().pipe(
      map(accounts => accounts[0]),
      tap(account => this.account.defaultAccount = account),
      switchMap(account => this.testEvent.deploy(bytecode.object))
    ).subscribe(tx => console.log('tx deploy', tx));
  }

  ngOnInit() {
    const pwd = 'toto';
    const account = this.wallet.create();
    console.log(account);
    const keystore = this.wallet.encrypt(account.privateKey, pwd);
    const result = this.wallet.decrypt(keystore, pwd);
    console.log('result', account);
    this.wallet.save(account, pwd);
    this.wallet.getAccounts().subscribe(console.log);
    //// EVENTS
    /*
    this.testEvent.events.IndexedEventString()
        .subscribe((event) => console.log('IndexedEventString', event));
    this.testEvent.events.IndexedEventUint()
        .subscribe((event) => console.log('IndexedEventUint', event));
    this.testEvent.events.IndexedEventUintString()
        .subscribe((event) => console.log('IndexedEventUintString', event));
    this.testEvent.events.MaxLimitIndexedEvent()
        .subscribe((event) => console.log('MaxLimitIndexedEvent', event));
    this.testEvent.events.NonIndexedEvent()
        .subscribe((event) => console.log('NonIndexedEvent', event));
    this.testEvent.events.NormalAndOnlyStatictStructEvent()
        .subscribe((event) => console.log('NormalAndOnlyStatictStructEvent', event));
    this.testEvent.events.NormalStructEvent()
        .subscribe((event) => console.log('NormalStructEvent', event));
    this.testEvent.events.OnlyStaticStructEvent()
        .subscribe((event) => console.log('OnlyStaticStructEvent', event));
    */

    //// CALLS
 /*
    this.encoderTest.calls.getAddress('0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c')
      .subscribe(address => console.log('address', address));
    this.encoderTest.calls.getBool(true)
      .subscribe(bool => console.log('bool', bool));
    this.encoderTest.calls.getDynamicTuple({num: 1, str: 'Hello World', dynamicBytes: '0x456789'})
      .subscribe(dynamicTuple => console.log('dynamicTuple', dynamicTuple));
    this.encoderTest.calls.getDynamicTupleArrayInsideTuple({
      isTrue: true,
      dynamicTuple: [{
        num: 1,
        str: 'Hello World',
        dynamicBytes: '0x456789'
      }, {
        num: 2,
        str: 'Coucou',
        dynamicBytes: '0x123456'
      }]
    }).subscribe(dynamicTupleArrayInsideTuple => console.log('dynamicTupleArrayInsideTuple', dynamicTupleArrayInsideTuple));

    this.encoderTest.calls.getDynamicTupleArrayInsideTupleArray([
      {
        isTrue: true,
        dynamicTuple: [{
          num: 1,
          str: 'Hello World',
          dynamicBytes: '0x123456'
        }, {
          num: 2,
          str: 'Coucou',
          dynamicBytes: '0x456789'
        }]
      }, {
        isTrue: false,
        dynamicTuple: [{
          num: 3,
          str: 'Hello World',
          dynamicBytes: '0x123456'
        }, {
          num: 4,
          str: 'Coucou',
          dynamicBytes: '0x456789'
        }],
      }
    ]).subscribe(dynamicTupleArrayInsideTupleArray => console.log('dynamicTupleArrayInsideTupleArray', dynamicTupleArrayInsideTupleArray));
    this.encoderTest.calls.getDynamicBytes('0x123456789abcdef0')
      .subscribe(dynamicBytes => console.log('dynamicBytes', dynamicBytes));

    this.encoderTest.calls.getFixedDynamicTupleArray([{
      num: 1,
      str: 'Hello World',
      dynamicBytes: '0x123456'
    }, {
      num: 2,
      str: 'Coucou',
      dynamicBytes: '0x654321'
    }, {
      num: 3,
      str: 'Toto',
      dynamicBytes: '0xabcdef'
    }]).subscribe(fixedDynamicTupleArray => console.log('fixedDynamicTupleArray', fixedDynamicTupleArray));

   this.encoderTest.calls.getUnfixedUintArray([6, 7, 8])
    .subscribe(unfixedUintArray => console.log('unfixedUintArray', unfixedUintArray));
    this.encoderTest.calls.getUnfixedStaticTupleArray([
      {
        num: 1,
        isTrue: true,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c'
      }, {
        num: 2,
        isTrue: false,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c'
      }, {
        num: 3,
        isTrue: true,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c'
      },
    ]).subscribe(unfixedStaticTupleArray => console.log('unfixedStaticTupleArray', unfixedStaticTupleArray));

  this.encoderTest.calls.getFixedUintArray([35, 47, 85])
    .subscribe(fixedUintArray => console.log('fixedUintArray', fixedUintArray));

  this.encoderTest.calls.getFixedStaticTupleArray([
    {
      num: 35,
      isTrue: true,
      to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54a'
    }, {
      num: 46,
      isTrue: false,
      to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54b'
    }, {
      num: 57,
      isTrue: true,
      to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c'
    },
  ]).subscribe(fixedStaticTupleArray => console.log('fixedStaticTupleArray', fixedStaticTupleArray));

  this.encoderTest.calls.getStaticTupleArrayInsideTuple({
    isTrue: true,
    staticTuple: [{
      num: 35,
      isTrue: true,
      to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54a'
    }, {
      num: 46,
      isTrue: false,
      to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54b'
    }]
  }).subscribe(staticTupleArrayInsideTuple => {
    console.log('staticTupleArrayInsideTuple', staticTupleArrayInsideTuple);
  });

  this.encoderTest.calls.getDynamicTupleArrayInsideTuple({
    isTrue: true,
    dynamicTuple: [{
      num: 35,
      str: 'Hello',
      dynamicBytes: '0x1234'
    }, {
      num: 46,
      str: 'World',
      dynamicBytes: '0x5678'
    }]
  }).subscribe(dynamicTupleArrayInsideTuple => {
    console.log('dynamicTupleArrayInsideTuple', dynamicTupleArrayInsideTuple);
  });

  this.encoderTest.calls.getUnfixedDynamicTupleArray([{
      num: 35,
      str: 'Hello',
      dynamicBytes: '0x1234'
    }, {
      num: 46,
      str: 'World',
      dynamicBytes: '0x5678'
  }]).subscribe(unfixedDynamicTupleArray => console.log('unfixedDynamicTupleArray', unfixedDynamicTupleArray));

  this.encoderTest.calls.getUnfixedStaticTupleArray([{
    num: 35,
    isTrue: true,
    to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54a'
  }, {
    num: 46,
    isTrue: false,
    to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54b'
  }, {
    num: 57,
    isTrue: true,
    to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c'
  }]).subscribe(unfixedStaticTupleArray => console.log('unfixedStaticTupleArray', unfixedStaticTupleArray));

  this.encoderTest.calls.getFixedStaticTupleArray([{
    num: 35,
    isTrue: true,
    to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54a'
  }, {
    num: 46,
    isTrue: false,
    to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54b'
  }, {
    num: 57,
    isTrue: true,
    to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c'
  }]).subscribe(fixedStaticTupleArray => console.log('fixedStaticTupleArray', fixedStaticTupleArray));

  this.encoderTest.calls.getUnfixedUintArray([35, 47, 85])
    .subscribe(unfixedUintArray => console.log('unfixedUintArray', unfixedUintArray));

  this.encoderTest.calls.getUnfixedStringArray(['Hello', 'World', '!'])
    .subscribe(unfixedStringArray => console.log('unfixedStringArray', unfixedStringArray));

  this.encoderTest.calls.getFixedStringArray(['Hello', 'World', '!'])
    .subscribe(fixedStringArray => console.log('fixedStringArray', fixedStringArray));

  this.encoderTest.calls.getFixedDynamicTupleArray([{
    num: 1,
    str: 'Hello',
    dynamicBytes: '0x12'
  }, {
    num: 2,
    str: 'World',
    dynamicBytes: '0x34'
  }, {
    num: 3,
    str: '!',
    dynamicBytes: '0x56'
  }]).subscribe(fixedDynamicTupleArray => console.log('fixedDynamicTupleArray', fixedDynamicTupleArray));

 this.encoderTest.calls.getDynamicTupleArrayInsideTupleArray([
  // Static tuple 1
  {
    isTrue: true,
    dynamicTuple: [{
      num: 35,
      str: 'Hello',
      dynamicBytes: '0x1234'
    }]
  },
  // Static Tuple 2
  {
    isTrue: true,
    dynamicTuple: [{
      num: 35,
      str: 'Hello',
      dynamicBytes: '0x1234'
    }, {
      num: 46,
      str: 'World',
      dynamicBytes: '0x5678'
    }]
  },
  // Static Tuple 3
  {
    isTrue: true,
    dynamicTuple: [{
      num: 35,
      str: 'Hello',
      dynamicBytes: '0x1234'
    }, {
      num: 46,
      str: 'World',
      dynamicBytes: '0x5678'
    }, {
      num: 57,
      str: '!!!',
      dynamicBytes: '0xabcd'
    }]
  }]).subscribe(dynamicTupleArrayInsideTupleArray => {
    console.log('dynamicTupleArrayInsideTupleArray', dynamicTupleArrayInsideTupleArray);
  });

  this.encoderTest.calls.getStaticTupleArrayInsideTupleArray([
    // Static tuple 1
    {
      isTrue: true,
      staticTuple: [{
        num: 35,
        isTrue: true,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54a'
      }]
    },
    // Static Tuple 2
    {
      isTrue: true,
      staticTuple: [{
        num: 35,
        isTrue: true,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54a'
      }, {
        num: 46,
        isTrue: false,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54b'
      }]
    },
    // Static Tuple 3
    {
      isTrue: true,
      staticTuple: [{
        num: 35,
        isTrue: true,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54a'
      }, {
        num: 46,
        isTrue: false,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54b'
      }, {
        num: 57,
        isTrue: true,
        to: '0xbEbDCB7685ab170E24215B45c81d9FFE00BBa54c'
      }]
    }]).subscribe(staticTupleArrayInsideTupleArray => {
      console.log('staticTupleArrayInsideTupleArray', staticTupleArrayInsideTupleArray);
    });
  */
  }
}
