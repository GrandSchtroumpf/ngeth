/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { randomBytes } from 'crypto-browserify';
var EncryptOptions = /** @class */ (function () {
    function EncryptOptions(options) {
        this.salt = randomBytes(32);
        this.iv = randomBytes(16);
        this.kdf = 'scrypt';
        this.c = 262144;
        this.dklen = 32;
        this.n = 8192;
        this.r = 8;
        this.p = 1;
        this.cipher = 'aes-128-ctr';
        this.uuid = randomBytes(16);
        for (var /** @type {?} */ key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
        // Transform salt to be a Buffer
        if (options && typeof options.salt === 'string') {
            this.salt = Buffer.from(options.salt.replace('0x', ''), 'hex');
        }
    }
    return EncryptOptions;
}());
export { EncryptOptions };
function EncryptOptions_tsickle_Closure_declarations() {
    /** @type {?} */
    EncryptOptions.prototype.salt;
    /** @type {?} */
    EncryptOptions.prototype.iv;
    /** @type {?} */
    EncryptOptions.prototype.kdf;
    /** @type {?} */
    EncryptOptions.prototype.c;
    /** @type {?} */
    EncryptOptions.prototype.prf;
    /** @type {?} */
    EncryptOptions.prototype.dklen;
    /** @type {?} */
    EncryptOptions.prototype.n;
    /** @type {?} */
    EncryptOptions.prototype.r;
    /** @type {?} */
    EncryptOptions.prototype.p;
    /** @type {?} */
    EncryptOptions.prototype.cipher;
    /** @type {?} */
    EncryptOptions.prototype.uuid;
}
/**
 * @record
 */
export function Keystore() { }
function Keystore_tsickle_Closure_declarations() {
    /** @type {?} */
    Keystore.prototype.version;
    /** @type {?} */
    Keystore.prototype.id;
    /** @type {?} */
    Keystore.prototype.address;
    /** @type {?} */
    Keystore.prototype.crypto;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jcnlwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC93YWxsZXQvIiwic291cmNlcyI6WyJsaWIvYWNjb3VudC9lbmNyeXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFaEQsSUFBQTtJQVlFLHdCQUFZLE9BQWlDO29CQVhkLFdBQVcsQ0FBQyxFQUFFLENBQUM7a0JBQzFCLFdBQVcsQ0FBQyxFQUFFLENBQUM7bUJBQ0QsUUFBUTtpQkFDL0IsTUFBTTtxQkFFRixFQUFFO2lCQUNzQixJQUFJO2lCQUNoQyxDQUFDO2lCQUNELENBQUM7c0JBQzRCLGFBQWE7b0JBQy9CLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFFbkMsR0FBRyxDQUFDLENBQUMscUJBQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDMUI7U0FDRjs7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUMvRDtLQUNGO3lCQXhCSDtJQXlCQyxDQUFBO0FBdkJELDBCQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvLWJyb3dzZXJpZnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuY3J5cHRPcHRpb25zIHtcclxuICBwdWJsaWMgc2FsdDogQnVmZmVyIHwgc3RyaW5nID0gcmFuZG9tQnl0ZXMoMzIpO1xyXG4gIHB1YmxpYyBpdjogQnVmZmVyID0gcmFuZG9tQnl0ZXMoMTYpO1xyXG4gIHB1YmxpYyBrZGY6ICdwYmtkZjInIHwgJ3NjcnlwdCcgPSAnc2NyeXB0JztcclxuICBwdWJsaWMgYyA9IDI2MjE0NDtcclxuICBwdWJsaWMgcHJmOiAnaG1hYy1zaGEyNTYnO1xyXG4gIHB1YmxpYyBka2xlbiA9IDMyO1xyXG4gIHB1YmxpYyBuOiAyMDQ4IHwgNDA5NiB8IDgxOTIgfCAxNjM4NCA9IDgxOTI7XHJcbiAgcHVibGljIHIgPSA4O1xyXG4gIHB1YmxpYyBwID0gMTtcclxuICBwdWJsaWMgY2lwaGVyOiAnYWVzLTEyOC1jdHInIHwgc3RyaW5nID0gJ2Flcy0xMjgtY3RyJztcclxuICBwdWJsaWMgdXVpZDogQnVmZmVyID0gcmFuZG9tQnl0ZXMoMTYpO1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBQYXJ0aWFsPEVuY3J5cHRPcHRpb25zPikge1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBUcmFuc2Zvcm0gc2FsdCB0byBiZSBhIEJ1ZmZlclxyXG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuc2FsdCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5zYWx0ID0gQnVmZmVyLmZyb20ob3B0aW9ucy5zYWx0LnJlcGxhY2UoJzB4JywgJycpLCAnaGV4JylcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2V5c3RvcmUge1xyXG4gIHZlcnNpb246IDM7XHJcbiAgaWQ6IHN0cmluZztcclxuICBhZGRyZXNzOiBzdHJpbmc7XHJcbiAgY3J5cHRvOiB7XHJcbiAgICBjaXBoZXJ0ZXh0OiBzdHJpbmc7XHJcbiAgICBjaXBoZXJwYXJhbXM6IHtcclxuICAgICAgICBpdjogc3RyaW5nO1xyXG4gICAgfSxcclxuICAgIGNpcGhlcjogc3RyaW5nO1xyXG4gICAga2RmOiBzdHJpbmc7XHJcbiAgICBrZGZwYXJhbXM6IHtcclxuICAgICAgZGtsZW46IG51bWJlcjtcclxuICAgICAgc2FsdDogc3RyaW5nO1xyXG4gICAgICAvLyBGb3Igc2NyeXB0IGVuY3J5cHRpb25cclxuICAgICAgbj86IG51bWJlcjtcclxuICAgICAgcD86IG51bWJlcjtcclxuICAgICAgcj86IG51bWJlcjtcclxuICAgICAgLy8gRm9yIHBia2RmMiBlbmNyeXB0aW9uXHJcbiAgICAgIGM/OiBudW1iZXI7XHJcbiAgICAgIHByZj86ICdobWFjLXNoYTI1Nic7XHJcbiAgICB9O1xyXG4gICAgbWFjOiBzdHJpbmc7XHJcbiAgfVxyXG59XHJcbiJdfQ==