/**
 * for search a specified element from an array.
 * the difference between this method and the native Array.prototype.indexOf is that
 * this function is not using the strict equal for comparing the element which you wanna search,
 * so in this function 1 and "1" are equal
 */
module.exports = ( array, searchElement, fromIndex ) => {
    for( let i = fromIndex || 0, l = array.length; i < l; i += 1 ) {
        if( array[ i ] == searchElement ) return i;
    }
    return -1;
}
