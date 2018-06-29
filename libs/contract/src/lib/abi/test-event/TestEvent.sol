pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

contract testEvent {
    uint numEvent = 0;

    struct NormalStruct {
        string nom;
        address contractAddress;
        uint num;
    }

    struct OnlyStaticStruct {
        address contractAddress;
        uint num;
    }

    event NonIndexedEvent(uint numEvent, string action);
    event IndexedEventUint(uint indexed numEvent, string action);
    event IndexedEventString(uint numEvent, string indexed action);
    event IndexedEventUintString(uint indexed numEvent, string indexed action);
    event MaxLimitIndexedEvent(uint indexed numEvent, string indexed action, address indexed anAddress);
    event NormalStructEvent(NormalStruct indexed aNormalStruct);
    event OnlyStaticStructEvent(OnlyStaticStruct indexed anOnlyStaticStruct);
    event NormalAndOnlyStatictStructEvent(NormalStruct aNormalStruct, OnlyStaticStruct anOnlyStaticStruct);

    function triggerNonIndexedEvent() public {
        emit NonIndexedEvent(numEvent++, "non indexed event");
    }

    function triggerIndexedEventUint() public {
        emit IndexedEventUint(numEvent++, "indexed uint event");
    }

    function triggerIndexedEventString() public {
        emit IndexedEventString(numEvent++, "indexed string event");
    }

    function triggerIndexedEventUintString() public {
        emit IndexedEventUintString(numEvent++, "indexed uint and string event");
    }

    function triggerMaxLimitIndexedEvent() public {
        emit MaxLimitIndexedEvent(numEvent++, "3 indexed event", this);
    }



    function triggerSeveralEvent() public {
        emit NonIndexedEvent(numEvent++, "non indexed event");
        emit IndexedEventUint(numEvent++, "indexed uint event");
        emit IndexedEventString(numEvent++, "indexed string event");
        emit IndexedEventUintString(numEvent++, "indexed uint and string event");
    }

    function triggerNormalStructEvent() public {
        emit NormalStructEvent(NormalStruct("normal struct", this, 1));
    }

    function triggerOnlyStaticStructEvent() public {
        emit OnlyStaticStructEvent(OnlyStaticStruct(this, 2));
    }

    function triggerNormalAndOnlyStatictStructEvent() public {
        emit NormalAndOnlyStatictStructEvent(NormalStruct("normal struct", this, 1), OnlyStaticStruct(this, 2));
    }

}
