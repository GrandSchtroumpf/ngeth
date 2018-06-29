export interface ABIDefinition {
  constant?: boolean;
  payable?: boolean;
  anonymous?: boolean;
  inputs?: Array<ABIInput>;
  name?: string;
  outputs?: Array<ABIOutput>;
  type: 'function' | 'constructor' | 'event' | 'fallback';
}

export type ABIDataTypes =
  | 'uint256'
  | 'boolean'
  | 'string'
  | 'bytes'
  | 'tuple'
  | 'tuple[]'
  | string; // TODO complete list

export type ABIParam = (ABIInput | ABIOutput);

export interface ABIInput {
  name: string;
  type: ABIDataTypes;
  indexed?: boolean;
  components: ABIInput[];
}

export interface ABIOutput {
  name: string;
  type: ABIDataTypes;
  components: ABIOutput[];
}
