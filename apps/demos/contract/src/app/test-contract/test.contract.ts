import { Injectable, Injector } from '@angular/core';
import { Contract } from '@ngeth/contract';


const config = {
  addresses: {
    ropsten: '0x8481cd7f87077235cd5cae0cbcbf006463ed5bd5',
    kovan: '0xebd1480fc026331557a57ad37314abf1e15e5711'
  },
  abi: [
    {
      'constant': true,
      'inputs': [
        {
          'components': [
            {
              'name': 'num',
              'type': 'int256'
            },
            {
              'name': 'bytesList',
              'type': 'bytes'
            }
          ],
          'name': 'test',
          'type': 'tuple'
        }
      ],
      'name': 'getBytes',
      'outputs': [
        {
          'name': '',
          'type': 'bytes'
        }
      ],
      'payable': false,
      'stateMutability': 'pure',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'components': [
            {
              'name': 'num',
              'type': 'int256'
            },
            {
              'name': 'bytesList',
              'type': 'bytes'
            }
          ],
          'name': 'test',
          'type': 'tuple'
        }
      ],
      'name': 'getInt',
      'outputs': [
        {
          'name': '',
          'type': 'int256'
        }
      ],
      'payable': false,
      'stateMutability': 'pure',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': 'amount',
          'type': 'int256[]'
        }
      ],
      'name': 'getTest',
      'outputs': [
        {
          'name': '',
          'type': 'int256'
        }
      ],
      'payable': false,
      'stateMutability': 'pure',
      'type': 'function'
    }
  ]
};
@Injectable({ providedIn: 'root' })
export class TestContract extends Contract<any> {
  constructor(injector: Injector) {
    super(injector, config);
  }
}
