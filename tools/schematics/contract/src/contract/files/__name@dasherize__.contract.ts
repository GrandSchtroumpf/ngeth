import { Contract, ContractClass } from '@ngeth/contract';
import { I<%= classify(name)%>Contract } from './<%= dasherize(name) %>.models';
import * as abi from './<%= dasherize(name) %>.abi'

@Contract<I<%= classify(name)%>Contract>({
  abi: abi,
  addresses: {}
})
export class <%= classify(name)%>Contract extends ContractClass<I<%= classify(name)%>Contract> {}
