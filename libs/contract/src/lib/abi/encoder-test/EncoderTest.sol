pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

contract EncoderTest {

    /*********
     * STATICS
     *********/

    struct Static{
        int num;
        bool isTrue;
        address to;
    }

    /* Check Bool */
    function getBool(bool isTrue) public pure returns (bool isFalse) {
        return !isTrue;
    }

    /* Check positive only values */
    function getUint(uint num) public pure returns (uint) {
        return num + 10;
    }

    /* Check positive and negative values */
    function getInt(int num) public pure returns (int) {
        return num - 10;
    }

    /* Check a address */
    function getAddress(address to) public view returns (address) {
        return msg.sender;
    }

    /* Check a static bytes */
    function getStaticBytes(bytes3 staticBytes) public pure returns (bytes3) {
        return staticBytes;
    }

    /* Check tuple with only static values */
    function getStaticTuple(Static staticTuple) public pure returns (Static) {
        return staticTuple;
    }

    /* Check fixed array of static values */
    function getFixedUintArray(uint[3] arr) public pure returns (uint[3]) {
        return arr;
    }

    /* Check unfixed array of static values */
    function getUnfixedUintArray(uint[] arr) public pure returns (uint[]) {
        return arr;
    }

    /*********
     * DYNAMIC
     *********/
    /* A struct with static and dynamic values */
    struct Dynamic{
        int num;
        string str;
        bytes dynamicBytes;
    }

    /* Check a string */
    function getString(string str) public pure returns (string) {
        return str;
    }

    /* Check a dynamic bytes */
    function getDynamicBytes(bytes dynamicBytes) public pure returns (bytes) {
        return dynamicBytes;
    }

    /* Check a tuple with dynamic values */
    function getDynamicTuple(Dynamic dynamicTuple) public pure returns (Dynamic) {
        return dynamicTuple;
    }

    /* Check a fixed array of dynamic values */
    function getFixedStringArray(string[3] arr) public pure returns (string[3]) {
        return arr;
    }

    /* Check an unfixed array of dynamic values */
    function getUnfixedStringArray(string[] arr) public pure returns (string[]) {
        return arr;
    }

    /*****************
     * ARRAY OF TUPLES
     *****************/

    /* Check a fixed array of static tuple */
    function getFixedStaticTupleArray(Static[3] arr) public pure returns (Static[3]) {
        return arr;
    }

    /* Check unfixed array of static tuple */
    function getUnfixedStaticTupleArray(Static[] arr) public pure returns (Static[]) {
        return arr;
    }

    /* Check unfixed array of dynamic tuple */
    function getFixedDynamicTupleArray(Dynamic[3] arr) public pure returns (Dynamic[3]) {
        return arr;
    }

    /* Check unfixed array of dynamic tuple */
    function getUnfixedDynamicTupleArray(Dynamic[] arr) public pure returns (Dynamic[]) {
        return arr;
    }

    /**************************
     * TUPLE ARRAY INSIDE TUPLE
     **************************/
    struct StaticTuple {
        bool isTrue;
        Static[] staticTuple;
    }
    /* Check a tuple with an array of static tuples */
    function getStaticTupleArrayInsideTuple(StaticTuple staticTuple) public pure returns (StaticTuple) {
        return staticTuple;
    }

    /* Check a tuple array with an array of static tuples */
    function getStaticTupleArrayInsideTupleArray(StaticTuple[] staticTuple) public pure returns (StaticTuple[]) {
        return staticTuple;
    }

    struct DynamicTuple {
        bool isTrue;
        Dynamic[] dynamicTuple;
    }
    /* Check a tuple with an array of dynamic tuples */
    function getDynamicTupleArrayInsideTuple(DynamicTuple dynamicTuple) public pure returns (DynamicTuple) {
        return dynamicTuple;
    }

    /* Check a tuple with an array of dynamic tuples */
    function getDynamicTupleArrayInsideTupleArray(DynamicTuple[] dynamicTuple) public pure returns (DynamicTuple[]) {
        return dynamicTuple;
    }
}
