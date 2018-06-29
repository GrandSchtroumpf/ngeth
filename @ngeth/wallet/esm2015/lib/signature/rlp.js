/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { WalletModule } from '../wallet.module';
import * as assert from 'assert';
import { Buffer } from 'buffer';
import * as i0 from "@angular/core";
import * as i1 from "../wallet.module";
/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This private takes in a data, convert it to buffer if not, and a length for recursion
 *
 * @param data - will be converted to buffer
 * @return - returns buffer of encoded data
 *
 */
export class RLP {
    /**
     * @param {?} input
     * @return {?}
     */
    encode(input) {
        if (input instanceof Array) {
            const /** @type {?} */ output = [];
            for (let /** @type {?} */ i = 0; i < input.length; i++) {
                output.push(this.encode(input[i]));
            }
            const /** @type {?} */ buf = Buffer.concat(output);
            return Buffer.concat([this.encodeLength(buf.length, 192), buf]);
        }
        else {
            input = this.toBuffer(input);
            if (input.length === 1 && input[0] < 128) {
                return input;
            }
            else {
                return Buffer.concat([this.encodeLength(input.length, 128), input]);
            }
        }
    }
    /**
     * @param {?} v
     * @param {?} base
     * @return {?}
     */
    safeParseInt(v, base) {
        if (v.slice(0, 2) === '00') {
            throw (new Error('invalid RLP: extra zeros'));
        }
        return parseInt(v, base);
    }
    /**
     * @param {?} len
     * @param {?} offset
     * @return {?}
     */
    encodeLength(len, offset) {
        if (len < 56) {
            return Buffer.from([len + offset]);
        }
        else {
            const /** @type {?} */ hexLength = this.intToHex(len);
            const /** @type {?} */ lLength = hexLength.length / 2;
            const /** @type {?} */ firstByte = this.intToHex(offset + 55 + lLength);
            return Buffer.from(firstByte + hexLength, 'hex');
        }
    }
    /**
     * RLP Decoding based on: {\@link https://github.com/ethereum/wiki/wiki/RLP}
     * @param {?} input
     * @param {?=} stream
     * @return {?} - returns decode Array of Buffers containg the original message
     *
     */
    decode(input, stream) {
        if (!input || input.length === 0) {
            return Buffer.from([]);
        }
        input = this.toBuffer(input);
        const /** @type {?} */ decoded = this._decode(input);
        if (stream) {
            return /** @type {?} */ (decoded);
        }
        assert.equal(decoded.remainder.length, 0, 'invalid remainder');
        return decoded.data;
    }
    /**
     * @param {?} input
     * @return {?}
     */
    getLength(input) {
        if (!input || input.length === 0) {
            return Buffer.from([]);
        }
        input = this.toBuffer(input);
        const /** @type {?} */ firstByte = input[0];
        if (firstByte <= 0x7f) {
            return input.length;
        }
        else if (firstByte <= 0xb7) {
            return firstByte - 0x7f;
        }
        else if (firstByte <= 0xbf) {
            return firstByte - 0xb6;
        }
        else if (firstByte <= 0xf7) {
            // a list between  0-55 bytes long
            return firstByte - 0xbf;
        }
        else {
            // a list  over 55 bytes long
            const /** @type {?} */ llength = firstByte - 0xf6;
            const /** @type {?} */ length = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            return llength + length;
        }
    }
    /**
     * @param {?} input
     * @return {?}
     */
    _decode(input) {
        let /** @type {?} */ length, /** @type {?} */ llength, /** @type {?} */ data, /** @type {?} */ innerRemainder, /** @type {?} */ d;
        const /** @type {?} */ decoded = [];
        const /** @type {?} */ firstByte = input[0];
        if (firstByte <= 0x7f) {
            // a single byte whose value is in the [0x00, 0x7f] range, that byte is its own RLP encoding.
            return {
                data: input.slice(0, 1),
                remainder: input.slice(1)
            };
        }
        else if (firstByte <= 0xb7) {
            // string is 0-55 bytes long. A single byte with value 0x80 plus the length of the string followed by the string
            // The range of the first byte is [0x80, 0xb7]
            length = firstByte - 0x7f;
            // set 0x80 null to 0
            if (firstByte === 0x80) {
                data = Buffer.from([]);
            }
            else {
                data = input.slice(1, length);
            }
            if (length === 2 && data[0] < 0x80) {
                throw new Error('invalid rlp encoding: byte must be less 0x80');
            }
            return {
                data: data,
                remainder: input.slice(length)
            };
        }
        else if (firstByte <= 0xbf) {
            llength = firstByte - 0xb6;
            length = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            data = input.slice(llength, length + llength);
            if (data.length < length) {
                throw (new Error('invalid RLP'));
            }
            return {
                data: data,
                remainder: input.slice(length + llength)
            };
        }
        else if (firstByte <= 0xf7) {
            // a list between  0-55 bytes long
            length = firstByte - 0xbf;
            innerRemainder = input.slice(1, length);
            while (innerRemainder.length) {
                d = this._decode(innerRemainder);
                decoded.push(d.data);
                innerRemainder = d.remainder;
            }
            return {
                data: decoded,
                remainder: input.slice(length)
            };
        }
        else {
            // a list  over 55 bytes long
            llength = firstByte - 0xf6;
            length = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            const /** @type {?} */ totalLength = llength + length;
            if (totalLength > input.length) {
                throw new Error('invalid rlp: total length is larger than the data');
            }
            innerRemainder = input.slice(llength, totalLength);
            if (innerRemainder.length === 0) {
                throw new Error('invalid rlp, List has a invalid length');
            }
            while (innerRemainder.length) {
                d = this._decode(innerRemainder);
                decoded.push(d.data);
                innerRemainder = d.remainder;
            }
            return {
                data: decoded,
                remainder: input.slice(totalLength)
            };
        }
    }
    /**
     * HELPERS : TO REMOVE
     * @param {?} str
     * @return {?}
     */
    isHexPrefixed(str) {
        return str.slice(0, 2) === '0x';
    }
    /**
     * @param {?} str
     * @return {?}
     */
    stripHexPrefix(str) {
        if (typeof str !== 'string') {
            return str;
        }
        return this.isHexPrefixed(str) ? str.slice(2) : str;
    }
    /**
     * @param {?} i
     * @return {?}
     */
    intToHex(i) {
        let /** @type {?} */ hex = i.toString(16);
        if (hex.length % 2) {
            hex = '0' + hex;
        }
        return hex;
    }
    /**
     * @param {?} a
     * @return {?}
     */
    padToEven(a) {
        if (a.length % 2)
            a = '0' + a;
        return a;
    }
    /**
     * @param {?} i
     * @return {?}
     */
    intToBuffer(i) {
        const /** @type {?} */ hex = this.intToHex(i);
        return Buffer.from(hex, 'hex');
    }
    /**
     * @param {?} v
     * @return {?}
     */
    toBuffer(v) {
        if (!Buffer.isBuffer(v)) {
            if (typeof v === 'string') {
                if (this.isHexPrefixed(v)) {
                    v = Buffer.from(this.padToEven(this.stripHexPrefix(v)), 'hex');
                }
                else {
                    v = Buffer.from(v);
                }
            }
            else if (typeof v === 'number') {
                if (!v) {
                    v = Buffer.from([]);
                }
                else {
                    v = this.intToBuffer(v);
                }
            }
            else if (v === null || v === undefined) {
                v = Buffer.from([]);
            }
            else if (v.toArray) {
                // converts a BN to a Buffer
                v = Buffer.from(v.toArray());
            }
            else {
                throw new Error('invalid type');
            }
        }
        return v;
    }
}
RLP.decorators = [
    { type: Injectable, args: [{ providedIn: WalletModule },] },
];
/** @nocollapse */ RLP.ngInjectableDef = i0.defineInjectable({ factory: function RLP_Factory() { return new RLP(); }, token: RLP, providedIn: i1.WalletModule });
function RLP_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    RLP.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    RLP.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmxwLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3dhbGxldC8iLCJzb3VyY2VzIjpbImxpYi9zaWduYXR1cmUvcmxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDOzs7Ozs7Ozs7OztBQVVoQyxNQUFNOzs7OztJQUNHLE1BQU0sQ0FBQyxLQUE0QztRQUN4RCxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMzQix1QkFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLEdBQUcsQ0FBQyxDQUFDLHFCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDbkM7WUFDRCx1QkFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO1NBQ2hFO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxL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QUMsQ0FBQztvQkFDTixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDeEI7YUFDRjtZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTthQUNwQjtZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7Z0JBRXJCLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO2FBQzdCO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTthQUNoQztTQUNGO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQTs7OztZQWhPWCxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLi93YWxsZXQubW9kdWxlJztcclxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcblxyXG4vKipcclxuICogUkxQIEVuY29kaW5nIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2lraS93aWtpLyU1QkVuZ2xpc2glNUQtUkxQXHJcbiAqIFRoaXMgcHJpdmF0ZSB0YWtlcyBpbiBhIGRhdGEsIGNvbnZlcnQgaXQgdG8gYnVmZmVyIGlmIG5vdCwgYW5kIGEgbGVuZ3RoIGZvciByZWN1cnNpb25cclxuICpcclxuICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICogQHJldHVybnMgIC0gcmV0dXJucyBidWZmZXIgb2YgZW5jb2RlZCBkYXRhXHJcbiAqKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBXYWxsZXRNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIFJMUCB7XHJcbiAgcHVibGljIGVuY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nIHwgbnVtYmVyIHwgQXJyYXk8YW55Pikge1xyXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgY29uc3Qgb3V0cHV0ID0gW11cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG91dHB1dC5wdXNoKHRoaXMuZW5jb2RlKGlucHV0W2ldKSlcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBidWYgPSBCdWZmZXIuY29uY2F0KG91dHB1dClcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGJ1Zi5sZW5ndGgsIDE5MiksIGJ1Zl0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbnB1dCA9IHRoaXMudG9CdWZmZXIoaW5wdXQpO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID09PSAxICYmIGlucHV0WzBdIDwgMTI4KSB7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGlucHV0Lmxlbmd0aCwgMTI4KSwgaW5wdXRdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNhZmVQYXJzZUludCAodiwgYmFzZSkge1xyXG4gICAgaWYgKHYuc2xpY2UoMCwgMikgPT09ICcwMCcpIHtcclxuICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFA6IGV4dHJhIHplcm9zJykpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyc2VJbnQodiwgYmFzZSlcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW5jb2RlTGVuZ3RoIChsZW4sIG9mZnNldCkge1xyXG4gICAgaWYgKGxlbiA8IDU2KSB7XHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShbbGVuICsgb2Zmc2V0XSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGhleExlbmd0aCA9IHRoaXMuaW50VG9IZXgobGVuKVxyXG4gICAgICBjb25zdCBsTGVuZ3RoID0gaGV4TGVuZ3RoLmxlbmd0aCAvIDJcclxuICAgICAgY29uc3QgZmlyc3RCeXRlID0gdGhpcy5pbnRUb0hleChvZmZzZXQgKyA1NSArIGxMZW5ndGgpXHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShmaXJzdEJ5dGUgKyBoZXhMZW5ndGgsICdoZXgnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUkxQIERlY29kaW5nIGJhc2VkIG9uOiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9STFB9XHJcbiAgICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICAgKiBAcmV0dXJucyAtIHJldHVybnMgZGVjb2RlIEFycmF5IG9mIEJ1ZmZlcnMgY29udGFpbmcgdGhlIG9yaWdpbmFsIG1lc3NhZ2VcclxuICAgKiovXHJcbiAgcHVibGljIGRlY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nLCBzdHJlYW0/OiBib29sZWFuKTogQnVmZmVyIHwgQXJyYXk8YW55PiB7XHJcbiAgICBpZiAoIWlucHV0IHx8IGlucHV0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5fZGVjb2RlKGlucHV0KTtcclxuXHJcbiAgICBpZiAoc3RyZWFtKSB7XHJcbiAgICAgIHJldHVybiBkZWNvZGVkIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQuZXF1YWwoZGVjb2RlZC5yZW1haW5kZXIubGVuZ3RoLCAwLCAnaW52YWxpZCByZW1haW5kZXInKTtcclxuICAgIHJldHVybiBkZWNvZGVkLmRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0TGVuZ3RoKGlucHV0OiBzdHJpbmcgfCBCdWZmZXIpOiBudW1iZXIgfCBCdWZmZXIge1xyXG4gICAgaWYgKCFpbnB1dCB8fCBpbnB1dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dClcclxuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGlucHV0WzBdXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgcmV0dXJuIGlucHV0Lmxlbmd0aFxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiNykge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHg3ZlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIHJldHVybiBmaXJzdEJ5dGUgLSAweGJmXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBhIGxpc3QgIG92ZXIgNTUgYnl0ZXMgbG9uZ1xyXG4gICAgICBjb25zdCBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhmNlxyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICByZXR1cm4gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZGVjb2RlIChpbnB1dDogQnVmZmVyKSB7XHJcbiAgICBsZXQgbGVuZ3RoLCBsbGVuZ3RoLCBkYXRhLCBpbm5lclJlbWFpbmRlciwgZDtcclxuICAgIGNvbnN0IGRlY29kZWQgPSBbXVxyXG4gICAgY29uc3QgZmlyc3RCeXRlID0gaW5wdXRbMF1cclxuXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgLy8gYSBzaW5nbGUgYnl0ZSB3aG9zZSB2YWx1ZSBpcyBpbiB0aGUgWzB4MDAsIDB4N2ZdIHJhbmdlLCB0aGF0IGJ5dGUgaXMgaXRzIG93biBSTFAgZW5jb2RpbmcuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogaW5wdXQuc2xpY2UoMCwgMSksXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZSgxKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGZpcnN0Qnl0ZSA8PSAweGI3KSB7XHJcbiAgICAgIC8vIHN0cmluZyBpcyAwLTU1IGJ5dGVzIGxvbmcuIEEgc2luZ2xlIGJ5dGUgd2l0aCB2YWx1ZSAweDgwIHBsdXMgdGhlIGxlbmd0aCBvZiB0aGUgc3RyaW5nIGZvbGxvd2VkIGJ5IHRoZSBzdHJpbmdcclxuICAgICAgLy8gVGhlIHJhbmdlIG9mIHRoZSBmaXJzdCBieXRlIGlzIFsweDgwLCAweGI3XVxyXG4gICAgICBsZW5ndGggPSBmaXJzdEJ5dGUgLSAweDdmXHJcblxyXG4gICAgICAvLyBzZXQgMHg4MCBudWxsIHRvIDBcclxuICAgICAgaWYgKGZpcnN0Qnl0ZSA9PT0gMHg4MCkge1xyXG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gaW5wdXQuc2xpY2UoMSwgbGVuZ3RoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobGVuZ3RoID09PSAyICYmIGRhdGFbMF0gPCAweDgwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCBlbmNvZGluZzogYnl0ZSBtdXN0IGJlIGxlc3MgMHg4MCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgICBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICBkYXRhID0gaW5wdXQuc2xpY2UobGxlbmd0aCwgbGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgaWYgKGRhdGEubGVuZ3RoIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFAnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHJlbWFpbmRlcjogaW5wdXQuc2xpY2UobGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIGxlbmd0aCA9IGZpcnN0Qnl0ZSAtIDB4YmZcclxuICAgICAgaW5uZXJSZW1haW5kZXIgPSBpbnB1dC5zbGljZSgxLCBsZW5ndGgpXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGRlY29kZWQsXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZShsZW5ndGgpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGEgbGlzdCAgb3ZlciA1NSBieXRlcyBsb25nXHJcbiAgICAgIGxsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGY2XHJcbiAgICAgIGxlbmd0aCA9IHRoaXMuc2FmZVBhcnNlSW50KGlucHV0LnNsaWNlKDEsIGxsZW5ndGgpLnRvU3RyaW5nKCdoZXgnKSwgMTYpXHJcbiAgICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgICBpZiAodG90YWxMZW5ndGggPiBpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmxwOiB0b3RhbCBsZW5ndGggaXMgbGFyZ2VyIHRoYW4gdGhlIGRhdGEnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpbm5lclJlbWFpbmRlciA9IGlucHV0LnNsaWNlKGxsZW5ndGgsIHRvdGFsTGVuZ3RoKVxyXG4gICAgICBpZiAoaW5uZXJSZW1haW5kZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCwgTGlzdCBoYXMgYSBpbnZhbGlkIGxlbmd0aCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGVjb2RlZCxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKHRvdGFsTGVuZ3RoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSEVMUEVSUyA6IFRPIFJFTU9WRVxyXG4gICAqL1xyXG5cclxuICBwcml2YXRlIGlzSGV4UHJlZml4ZWQoc3RyKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnXHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmVzIDB4IGZyb20gYSBnaXZlbiBTdHJpbmdcclxuICBwcml2YXRlIHN0cmlwSGV4UHJlZml4KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gc3RyXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5pc0hleFByZWZpeGVkKHN0cikgPyBzdHIuc2xpY2UoMikgOiBzdHJcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW50VG9IZXgoaTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGxldCBoZXggPSBpLnRvU3RyaW5nKDE2KVxyXG4gICAgaWYgKGhleC5sZW5ndGggJSAyKSB7XHJcbiAgICAgIGhleCA9ICcwJyArIGhleFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYWRUb0V2ZW4oYTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChhLmxlbmd0aCAlIDIpIGEgPSAnMCcgKyBhXHJcbiAgICByZXR1cm4gYVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnRUb0J1ZmZlcihpOiBudW1iZXIpOiBCdWZmZXIge1xyXG4gICAgY29uc3QgaGV4ID0gdGhpcy5pbnRUb0hleChpKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGhleCwgJ2hleCcpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvQnVmZmVyKHY6IGFueSk6IEJ1ZmZlciB7XHJcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2KSkge1xyXG4gICAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNIZXhQcmVmaXhlZCh2KSkge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHRoaXMucGFkVG9FdmVuKHRoaXMuc3RyaXBIZXhQcmVmaXgodikpLCAnaGV4JylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGlmICghdikge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2ID0gdGhpcy5pbnRUb0J1ZmZlcih2KVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHYgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIGlmICh2LnRvQXJyYXkpIHtcclxuICAgICAgICAvLyBjb252ZXJ0cyBhIEJOIHRvIGEgQnVmZmVyXHJcbiAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYudG9BcnJheSgpKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==