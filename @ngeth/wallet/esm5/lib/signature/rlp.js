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
var RLP = /** @class */ (function () {
    function RLP() {
    }
    /**
     * @param {?} input
     * @return {?}
     */
    RLP.prototype.encode = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (input instanceof Array) {
            var /** @type {?} */ output = [];
            for (var /** @type {?} */ i = 0; i < input.length; i++) {
                output.push(this.encode(input[i]));
            }
            var /** @type {?} */ buf = Buffer.concat(output);
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
    };
    /**
     * @param {?} v
     * @param {?} base
     * @return {?}
     */
    RLP.prototype.safeParseInt = /**
     * @param {?} v
     * @param {?} base
     * @return {?}
     */
    function (v, base) {
        if (v.slice(0, 2) === '00') {
            throw (new Error('invalid RLP: extra zeros'));
        }
        return parseInt(v, base);
    };
    /**
     * @param {?} len
     * @param {?} offset
     * @return {?}
     */
    RLP.prototype.encodeLength = /**
     * @param {?} len
     * @param {?} offset
     * @return {?}
     */
    function (len, offset) {
        if (len < 56) {
            return Buffer.from([len + offset]);
        }
        else {
            var /** @type {?} */ hexLength = this.intToHex(len);
            var /** @type {?} */ lLength = hexLength.length / 2;
            var /** @type {?} */ firstByte = this.intToHex(offset + 55 + lLength);
            return Buffer.from(firstByte + hexLength, 'hex');
        }
    };
    /**
     * RLP Decoding based on: {\@link https://github.com/ethereum/wiki/wiki/RLP}
     * @param {?} input
     * @param {?=} stream
     * @return {?} - returns decode Array of Buffers containg the original message
     *
     */
    RLP.prototype.decode = /**
     * RLP Decoding based on: {\@link https://github.com/ethereum/wiki/wiki/RLP}
     * @param {?} input
     * @param {?=} stream
     * @return {?} - returns decode Array of Buffers containg the original message
     *
     */
    function (input, stream) {
        if (!input || input.length === 0) {
            return Buffer.from([]);
        }
        input = this.toBuffer(input);
        var /** @type {?} */ decoded = this._decode(input);
        if (stream) {
            return /** @type {?} */ (decoded);
        }
        assert.equal(decoded.remainder.length, 0, 'invalid remainder');
        return decoded.data;
    };
    /**
     * @param {?} input
     * @return {?}
     */
    RLP.prototype.getLength = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (!input || input.length === 0) {
            return Buffer.from([]);
        }
        input = this.toBuffer(input);
        var /** @type {?} */ firstByte = input[0];
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
            var /** @type {?} */ llength = firstByte - 0xf6;
            var /** @type {?} */ length_1 = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            return llength + length_1;
        }
    };
    /**
     * @param {?} input
     * @return {?}
     */
    RLP.prototype._decode = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        var /** @type {?} */ length, /** @type {?} */ llength, /** @type {?} */ data, /** @type {?} */ innerRemainder, /** @type {?} */ d;
        var /** @type {?} */ decoded = [];
        var /** @type {?} */ firstByte = input[0];
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
            var /** @type {?} */ totalLength = llength + length;
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
    };
    /**
     * HELPERS : TO REMOVE
     * @param {?} str
     * @return {?}
     */
    RLP.prototype.isHexPrefixed = /**
     * HELPERS : TO REMOVE
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return str.slice(0, 2) === '0x';
    };
    /**
     * @param {?} str
     * @return {?}
     */
    RLP.prototype.stripHexPrefix = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        if (typeof str !== 'string') {
            return str;
        }
        return this.isHexPrefixed(str) ? str.slice(2) : str;
    };
    /**
     * @param {?} i
     * @return {?}
     */
    RLP.prototype.intToHex = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        var /** @type {?} */ hex = i.toString(16);
        if (hex.length % 2) {
            hex = '0' + hex;
        }
        return hex;
    };
    /**
     * @param {?} a
     * @return {?}
     */
    RLP.prototype.padToEven = /**
     * @param {?} a
     * @return {?}
     */
    function (a) {
        if (a.length % 2)
            a = '0' + a;
        return a;
    };
    /**
     * @param {?} i
     * @return {?}
     */
    RLP.prototype.intToBuffer = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        var /** @type {?} */ hex = this.intToHex(i);
        return Buffer.from(hex, 'hex');
    };
    /**
     * @param {?} v
     * @return {?}
     */
    RLP.prototype.toBuffer = /**
     * @param {?} v
     * @return {?}
     */
    function (v) {
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
    };
    RLP.decorators = [
        { type: Injectable, args: [{ providedIn: WalletModule },] },
    ];
    /** @nocollapse */ RLP.ngInjectableDef = i0.defineInjectable({ factory: function RLP_Factory() { return new RLP(); }, token: RLP, providedIn: i1.WalletModule });
    return RLP;
}());
export { RLP };
function RLP_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    RLP.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    RLP.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmxwLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3dhbGxldC8iLCJzb3VyY2VzIjpbImxpYi9zaWduYXR1cmUvcmxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXdkIsb0JBQU07Ozs7Y0FBQyxLQUE0QztRQUN4RCxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMzQixxQkFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLEdBQUcsQ0FBQyxDQUFDLHFCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDbkM7WUFDRCxxQkFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO1NBQ2hFO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFL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QyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7aUJBQ3BCO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO2lCQUN4QjthQUNGO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2FBQ3BCO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOztnQkFFckIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7YUFDN0I7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFBO2FBQ2hDO1NBQ0Y7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFBOzs7Z0JBaE9YLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUU7OztjQVp4Qzs7U0FhYSxHQUFHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLi93YWxsZXQubW9kdWxlJztcclxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcblxyXG4vKipcclxuICogUkxQIEVuY29kaW5nIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2lraS93aWtpLyU1QkVuZ2xpc2glNUQtUkxQXHJcbiAqIFRoaXMgcHJpdmF0ZSB0YWtlcyBpbiBhIGRhdGEsIGNvbnZlcnQgaXQgdG8gYnVmZmVyIGlmIG5vdCwgYW5kIGEgbGVuZ3RoIGZvciByZWN1cnNpb25cclxuICpcclxuICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICogQHJldHVybnMgIC0gcmV0dXJucyBidWZmZXIgb2YgZW5jb2RlZCBkYXRhXHJcbiAqKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBXYWxsZXRNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIFJMUCB7XHJcbiAgcHVibGljIGVuY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nIHwgbnVtYmVyIHwgQXJyYXk8YW55Pikge1xyXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgY29uc3Qgb3V0cHV0ID0gW11cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG91dHB1dC5wdXNoKHRoaXMuZW5jb2RlKGlucHV0W2ldKSlcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBidWYgPSBCdWZmZXIuY29uY2F0KG91dHB1dClcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGJ1Zi5sZW5ndGgsIDE5MiksIGJ1Zl0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbnB1dCA9IHRoaXMudG9CdWZmZXIoaW5wdXQpO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID09PSAxICYmIGlucHV0WzBdIDwgMTI4KSB7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGlucHV0Lmxlbmd0aCwgMTI4KSwgaW5wdXRdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNhZmVQYXJzZUludCAodiwgYmFzZSkge1xyXG4gICAgaWYgKHYuc2xpY2UoMCwgMikgPT09ICcwMCcpIHtcclxuICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFA6IGV4dHJhIHplcm9zJykpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyc2VJbnQodiwgYmFzZSlcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW5jb2RlTGVuZ3RoIChsZW4sIG9mZnNldCkge1xyXG4gICAgaWYgKGxlbiA8IDU2KSB7XHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShbbGVuICsgb2Zmc2V0XSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGhleExlbmd0aCA9IHRoaXMuaW50VG9IZXgobGVuKVxyXG4gICAgICBjb25zdCBsTGVuZ3RoID0gaGV4TGVuZ3RoLmxlbmd0aCAvIDJcclxuICAgICAgY29uc3QgZmlyc3RCeXRlID0gdGhpcy5pbnRUb0hleChvZmZzZXQgKyA1NSArIGxMZW5ndGgpXHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShmaXJzdEJ5dGUgKyBoZXhMZW5ndGgsICdoZXgnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUkxQIERlY29kaW5nIGJhc2VkIG9uOiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9STFB9XHJcbiAgICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICAgKiBAcmV0dXJucyAtIHJldHVybnMgZGVjb2RlIEFycmF5IG9mIEJ1ZmZlcnMgY29udGFpbmcgdGhlIG9yaWdpbmFsIG1lc3NhZ2VcclxuICAgKiovXHJcbiAgcHVibGljIGRlY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nLCBzdHJlYW0/OiBib29sZWFuKTogQnVmZmVyIHwgQXJyYXk8YW55PiB7XHJcbiAgICBpZiAoIWlucHV0IHx8IGlucHV0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5fZGVjb2RlKGlucHV0KTtcclxuXHJcbiAgICBpZiAoc3RyZWFtKSB7XHJcbiAgICAgIHJldHVybiBkZWNvZGVkIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQuZXF1YWwoZGVjb2RlZC5yZW1haW5kZXIubGVuZ3RoLCAwLCAnaW52YWxpZCByZW1haW5kZXInKTtcclxuICAgIHJldHVybiBkZWNvZGVkLmRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0TGVuZ3RoKGlucHV0OiBzdHJpbmcgfCBCdWZmZXIpOiBudW1iZXIgfCBCdWZmZXIge1xyXG4gICAgaWYgKCFpbnB1dCB8fCBpbnB1dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dClcclxuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGlucHV0WzBdXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgcmV0dXJuIGlucHV0Lmxlbmd0aFxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiNykge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHg3ZlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIHJldHVybiBmaXJzdEJ5dGUgLSAweGJmXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBhIGxpc3QgIG92ZXIgNTUgYnl0ZXMgbG9uZ1xyXG4gICAgICBjb25zdCBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhmNlxyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICByZXR1cm4gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZGVjb2RlIChpbnB1dDogQnVmZmVyKSB7XHJcbiAgICBsZXQgbGVuZ3RoLCBsbGVuZ3RoLCBkYXRhLCBpbm5lclJlbWFpbmRlciwgZDtcclxuICAgIGNvbnN0IGRlY29kZWQgPSBbXVxyXG4gICAgY29uc3QgZmlyc3RCeXRlID0gaW5wdXRbMF1cclxuXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgLy8gYSBzaW5nbGUgYnl0ZSB3aG9zZSB2YWx1ZSBpcyBpbiB0aGUgWzB4MDAsIDB4N2ZdIHJhbmdlLCB0aGF0IGJ5dGUgaXMgaXRzIG93biBSTFAgZW5jb2RpbmcuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogaW5wdXQuc2xpY2UoMCwgMSksXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZSgxKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGZpcnN0Qnl0ZSA8PSAweGI3KSB7XHJcbiAgICAgIC8vIHN0cmluZyBpcyAwLTU1IGJ5dGVzIGxvbmcuIEEgc2luZ2xlIGJ5dGUgd2l0aCB2YWx1ZSAweDgwIHBsdXMgdGhlIGxlbmd0aCBvZiB0aGUgc3RyaW5nIGZvbGxvd2VkIGJ5IHRoZSBzdHJpbmdcclxuICAgICAgLy8gVGhlIHJhbmdlIG9mIHRoZSBmaXJzdCBieXRlIGlzIFsweDgwLCAweGI3XVxyXG4gICAgICBsZW5ndGggPSBmaXJzdEJ5dGUgLSAweDdmXHJcblxyXG4gICAgICAvLyBzZXQgMHg4MCBudWxsIHRvIDBcclxuICAgICAgaWYgKGZpcnN0Qnl0ZSA9PT0gMHg4MCkge1xyXG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gaW5wdXQuc2xpY2UoMSwgbGVuZ3RoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobGVuZ3RoID09PSAyICYmIGRhdGFbMF0gPCAweDgwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCBlbmNvZGluZzogYnl0ZSBtdXN0IGJlIGxlc3MgMHg4MCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgICBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICBkYXRhID0gaW5wdXQuc2xpY2UobGxlbmd0aCwgbGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgaWYgKGRhdGEubGVuZ3RoIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFAnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHJlbWFpbmRlcjogaW5wdXQuc2xpY2UobGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIGxlbmd0aCA9IGZpcnN0Qnl0ZSAtIDB4YmZcclxuICAgICAgaW5uZXJSZW1haW5kZXIgPSBpbnB1dC5zbGljZSgxLCBsZW5ndGgpXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGRlY29kZWQsXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZShsZW5ndGgpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGEgbGlzdCAgb3ZlciA1NSBieXRlcyBsb25nXHJcbiAgICAgIGxsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGY2XHJcbiAgICAgIGxlbmd0aCA9IHRoaXMuc2FmZVBhcnNlSW50KGlucHV0LnNsaWNlKDEsIGxsZW5ndGgpLnRvU3RyaW5nKCdoZXgnKSwgMTYpXHJcbiAgICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgICBpZiAodG90YWxMZW5ndGggPiBpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmxwOiB0b3RhbCBsZW5ndGggaXMgbGFyZ2VyIHRoYW4gdGhlIGRhdGEnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpbm5lclJlbWFpbmRlciA9IGlucHV0LnNsaWNlKGxsZW5ndGgsIHRvdGFsTGVuZ3RoKVxyXG4gICAgICBpZiAoaW5uZXJSZW1haW5kZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCwgTGlzdCBoYXMgYSBpbnZhbGlkIGxlbmd0aCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGVjb2RlZCxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKHRvdGFsTGVuZ3RoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSEVMUEVSUyA6IFRPIFJFTU9WRVxyXG4gICAqL1xyXG5cclxuICBwcml2YXRlIGlzSGV4UHJlZml4ZWQoc3RyKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnXHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmVzIDB4IGZyb20gYSBnaXZlbiBTdHJpbmdcclxuICBwcml2YXRlIHN0cmlwSGV4UHJlZml4KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gc3RyXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5pc0hleFByZWZpeGVkKHN0cikgPyBzdHIuc2xpY2UoMikgOiBzdHJcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW50VG9IZXgoaTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGxldCBoZXggPSBpLnRvU3RyaW5nKDE2KVxyXG4gICAgaWYgKGhleC5sZW5ndGggJSAyKSB7XHJcbiAgICAgIGhleCA9ICcwJyArIGhleFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYWRUb0V2ZW4oYTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChhLmxlbmd0aCAlIDIpIGEgPSAnMCcgKyBhXHJcbiAgICByZXR1cm4gYVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnRUb0J1ZmZlcihpOiBudW1iZXIpOiBCdWZmZXIge1xyXG4gICAgY29uc3QgaGV4ID0gdGhpcy5pbnRUb0hleChpKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGhleCwgJ2hleCcpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvQnVmZmVyKHY6IGFueSk6IEJ1ZmZlciB7XHJcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2KSkge1xyXG4gICAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNIZXhQcmVmaXhlZCh2KSkge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHRoaXMucGFkVG9FdmVuKHRoaXMuc3RyaXBIZXhQcmVmaXgodikpLCAnaGV4JylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGlmICghdikge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2ID0gdGhpcy5pbnRUb0J1ZmZlcih2KVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHYgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIGlmICh2LnRvQXJyYXkpIHtcclxuICAgICAgICAvLyBjb252ZXJ0cyBhIEJOIHRvIGEgQnVmZmVyXHJcbiAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYudG9BcnJheSgpKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==