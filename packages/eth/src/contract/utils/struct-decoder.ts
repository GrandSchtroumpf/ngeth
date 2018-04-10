import { ABIDataTypes, ABIOutput, ABIDefinition } from '../../types';
 
export interface Struct {
    [name: string]: string | number | boolean;
}

/**
 * Decode the Hex value returns by Solidity
 * @param result Hex value
 * @param abi Abi of the contract
 * @param name The name of the function in the abi
 */
export const decodeOutPutStruct = (result: string, abi: ABIDefinition[], name: string): Struct | Struct[] => {
    let str = result.substr(2, result.length - 2);      // Remove 0x
    str = str.substr(64, str.length - 64);              // Remove the HEAD
    const outputs = abi.find((def) => def.name === name).outputs[0].components;

    if (isTabStructFunction(name, abi)) {
        // Array of structs
        return decodeTabStruct(str, outputs);
    } else {
        // Struct
        return decodeStruct(str, outputs).struct;
    }
};

/**
 * Decode an array of struct
 * @param result The Hex value returned by Solidity
 * @param outputs An array describing the types returned by Solidity
 */
export const decodeTabStruct = (result: string, outputs: ABIOutput[]): Struct[] => {
    const amountOfStruct = hexToInt(result.substr(0, 64));    // How many struct in the struct array
    /** Hex that represents all structs */
    const allStruct = result.substr(amountOfStruct * 64 + 64, result.length);   
    /** The array to return */
    const arr: Struct[] = new Array();

    let numberOfLine = 0;
    for (let i = 0; i < amountOfStruct; i++) {
        const oneStruct = allStruct.substr(numberOfLine, allStruct.length - numberOfLine);
        const decodedStruct = decodeStruct(oneStruct, outputs);
        numberOfLine += decodedStruct.amountOfLine;
        arr.push(decodedStruct.struct);
    }
    return arr;
}

/**
 * Decode One Struct
 * @param result Hex Value for this struct
 * @param outputs An array describing the types returned by Solidity
 */
export const decodeStruct = (result: string, outputs: ABIOutput[]): {struct: Struct, amountOfLine: number} => {
    let str = result;
    let temp: any;
    let oneLine: string;
    let i = 0;
    let nbOfVariable = 0;
    let tempStringValue = 0;
    const struct: Struct = {};
    let name: string;

    let tab: (string | number | boolean)[] = new Array();
    nbOfVariable = outputs.length;  // Amount of variable in the struct

    for (let j = 0; j < nbOfVariable; j++) {
        oneLine = str.substr(i, 64);
        name = outputs[j].name;
        if (outputs[j].type.indexOf('int') !== -1) { outputs[j].type = 'number'; }
        switch (outputs[j].type) {
            case 'number':{
                struct[name] = hexToInt(oneLine);
                break;
            }
            case "string": {
                temp = hexToInt(oneLine);   // First line : Unknown...
                // Go to the end of the struct definition (into the string part)
                const valueString = nbOfVariable * 64; 
                oneLine = str.substr(valueString + tempStringValue, 64);
                tempStringValue += 64;
                // Recover the number of characters
                temp = hexToInt(oneLine);   

                struct[name] = '';
                let charAmount = temp * 2;   // amount of characters: (* 2) => ASCII 2*hex
                // Until there is no characters anymore
                while (charAmount > 0) {
                    // Go to next line : the string in an hex format
                    oneLine = str.substr(valueString + tempStringValue, 64);
                    tempStringValue += 64;
                    struct[name] += hexToString(oneLine, charAmount > 64 ? 64 : charAmount);
                    charAmount -= 64;
                }
                break;
            }
            case "bool": {
                struct[name] = hexToInt(oneLine) === 1 ? true : false;
                break;
            }
            case "address":{
                struct[name] = hexToAddresse(oneLine);
                break;
            }
        }
        // New Line
        i += 64;
        oneLine = str.substr(i, 64);
    }
    const amountOfLine = i + tempStringValue;   // Amount of lines that ddefines the struct

    return { struct, amountOfLine };
}


/**
 * Check if the method returns a struct or an array of struct
 * @param name Name of the method
 * @param abi ABI of the contract
 */
export const isTabStructFunction = (name: string, abi: any[]): boolean => {
    const tabTemp = new Array();
    for (let i = 0; i < abi.length; i++) {
        if (abi[i].name === name) {
            return abi[i].outputs[0].type !== 'tuple';
        }
    }
    return false;
}

/**
 * Transform an hex to number
 * @param hex hexadecimal value
 */
const hexToInt = (hex: string): number => {
    let number = 0;
    for (var i = 0; i < hex.length; i += 2) {
        number += parseInt(hex.substr(i, 2), 16);
    }
    return number;
}

/**
 * transform an Hex into a string
 * @param hex hexadecimal value
 * @param size amount of characters of the string
 */
const hexToString = (hex: string, size: number) => {
    let str = '';
    for (var i = 0; i < size; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

/**
 * Transform an hex into an address
 * @param hex hexadecimal value
 */
const hexToAddresse = (hex: string): string => {
    var str = '0x';
    let firstZero = true;
    str += hex.substr(24, 40);
    return str;
}


	/*
	
	0000000000000000000000000000000000000000000000000000000000000020 // ==> struture 
	
	0000000000000000000000000000000000000000000000000000000000000004 // => 4 => 4 le nombre de structure 
	
	0000000000000000000000000000000000000000000000000000000000000080 // ?? 128 -> 2 * 64
	0000000000000000000000000000000000000000000000000000000000000380 // ?? 896 -> 14 * 64 = (2 + 12) * 64 
	0000000000000000000000000000000000000000000000000000000000000680 // ?? 1664 -> 26 * 64 = (14 + 12) * 64 
	0000000000000000000000000000000000000000000000000000000000000980 // ?? 2432 -> 38 * 64 = (26 + 12) * 64 
    ////
    // START STRUCT
    ////
    // Start Struct Definition
	0000000000000000000000009ae5134e8dd5c4392a608bec74a554ff39ae9237 // adresse 
	0000000000000000000000000000000000000000000000000000000000000000 // int => 0
	00000000000000000000000000000000000000000000000000000000000001c0 // string 1 => go to end of struct 
	0000000000000000000000000000000000000000000000000000000000000200 // string 2 => 
	0000000000000000000000000000000000000000000000000000000000000002
	0000000000000000000000000000000000000000000000000000000000000003
	0000000000000000000000000000000000000000000000000000000000000004
	0000000000000000000000009ae5134e8dd5c4392a608bec74a554ff39ae9237
	0000000000000000000000000000000000000000000000000000000000000001
	0000000000000000000000000000000000000000000000000000000000000240
	0000000000000000000000000000000000000000000000000000000000000280
	00000000000000000000000000000000000000000000000000000000000002c0
	0000000000000000000000009ae5134e8dd5c4392a608bec74a554ff39ae9237
	0000000000000000000000000000000000000000000000000000000000000004 // 
	// end of struct definition
	
	// Liste de string
	// remarque si plus de 32 caractere string encodé sur 2 lignes 
	0000000000000000000000000000000000000000000000000000000000000003 // nombre de caractere du string 1 
	6c6f6c0000000000000000000000000000000000000000000000000000000000 // String  1  en ascii 
	
	0000000000000000000000000000000000000000000000000000000000000007 // nombre string 2 
	73796d626f6c6500000000000000000000000000000000000000000000000000 // string 2
	
	000000000000000000000000000000000000000000000000000000000000000a
	6964656e74696669657200000000000000000000000000000000000000000000
	0000000000000000000000000000000000000000000000000000000000000096
	1737365745479706500000000000000000000000000000000000000000000000
	0000000000000000000000000000000000000000000000000000000000000077
	6657273696f6e000000000000000000000000000000000000000000000000000
    ////
    // END STRUCT
    ///
	
	000000000000000000000009ae5134e8dd5c4392a608bec74a554ff39ae92370
	0000000000000000000000000000000000000000000000000000000000000010
	0000000000000000000000000000000000000000000000000000000000001c00
	0000000000000000000000000000000000000000000000000000000000002000...
	
	*/