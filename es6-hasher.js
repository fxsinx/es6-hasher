/*
 * ECMAScript 6 hasher plugin
 * (LICENSE) MIT, fxsinx.com
 */

((w) => {
    'use strict';

    if (w.hasher) return;

    let loc = w.location;
    let history = w.history;
    let _preferReplaceState = false;

    let changeHash = (str) => {
        if (!_preferReplaceState && history.pushState) {
            history.pushState(null, null, '#' + str);
        } else if (history.replaceState) {
            history.replaceState(null, null, '#' + str);
        } else {
            loc.hash = str;
        }
    };

    let getAllHashesObject = () => {
        let o = {};
        let match = loc.hash.match(/;[^;]+=?[^;]*/g);
        if (match) {
            match.forEach((v, k, a) => {
                let arr = v.slice(1).split('=');
                o[arr[0]] = arr[1] || '';
            });
        }
        return o;
    };

    let getType = (o) => {
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    };

    let getPrefixHash = () => {
        let p = loc.hash.search(';');
        return loc.hash.slice(1, p < 0 ? loc.hash.length : p);
    };

    let writeObjectToHash = ({
        prefixHash = getPrefixHash(),
        object: obj,
        overwrite = true
    }) => {
        if (!overwrite) {
            obj = Object.assign({}, getAllHashesObject(), obj);
        }
        obj = JSON.parse(JSON.stringify(obj)); // remove undefined items
        let hashArray = [];
        for (let key in obj) {
            hashArray.push(key + (obj[key] ? ('=' + obj[key]) : ''));
        }
        let sep = (hashArray.length < 1 || prefixHash.endsWith(';')) ? '' : ';';
        changeHash(prefixHash + sep + hashArray.join(';'));
    };

    let sortObjectByKeys = (obj) => {
        let keys = Object.keys(obj);
        keys.sort();
        let o = {};
        for (let k of keys) {
            o[k] = obj[k];
        }
        return o;
    };

    let invalidateEmptyObject = (obj) => {
        let o = {};
        for (let key in obj) {
            let val = (obj[key] || '').trim();
            o[key] = val ? val : undefined;
        }
        return o;
    };

    let hasher = (() => {
        let _hasher = function(name, value) {
            if (arguments.length < 1) {
                // no args, get all hash
                return getAllHashesObject();
            }
            if (getType(name) === 'symbol') {
                switch (name) {
                    case _hasher.symbol.clean:
                        writeObjectToHash({
                            object: {},
                            overwrite: true
                        });
                        break;
                    case _hasher.symbol.sortByKeys:
                        writeObjectToHash({
                            object: sortObjectByKeys(getAllHashesObject()),
                            overwrite: true
                        });
                        break;
                    case _hasher.symbol.removeEmptyKeys:
                        writeObjectToHash({
                            object: invalidateEmptyObject(getAllHashesObject()),
                            overwrite: true
                        });
                        break;
                    case _hasher.symbol.replacePrefixHash:
                        writeObjectToHash({
                            prefixHash: value || '',
                            object: getAllHashesObject(),
                            overwrite: true
                        });
                        break;
                    case _hasher.symbol.clear:
                        changeHash('');
                        break;
                    case _hasher.symbol.prefixHash:
                        return getPrefixHash();
                    default:
                }
                return true;
            } else if (getType(name) === 'object') {
                writeObjectToHash({
                    object: name,
                    overwrite: false
                });
                return true;
            } else if (getType(name) !== 'string') {
                return false;
            }
            if (typeof value === 'undefined') {
                // get specific k-v pair
                return getAllHashesObject()[name];
            } else if (value === null) {
                // remove a specific pair
                let obj = getAllHashesObject();
                obj[name] = undefined;
                writeObjectToHash({
                    object: obj,
                    overwrite: true
                });
            } else {
                // add a specific pair
                let obj = getAllHashesObject();
                obj[name] = value;
                writeObjectToHash({
                    object: obj,
                    overwrite: false
                });
            }
            return true;
        };
        return _hasher;
    })();

    hasher.config = ({
        preferReplaceState = false
    }) => {
        _preferReplaceState = preferReplaceState;
    };

    hasher.symbol = {};

    hasher.symbol.clean = Symbol('com.fxsinx.es6-hasher.clean');
    hasher.symbol.clear = Symbol('com.fxsinx.es6-hasher.clear');
    hasher.symbol.sortByKeys = Symbol('com.fxsinx.es6-hasher.sortbykeys');
    hasher.symbol.removeEmptyKeys = Symbol('com.fxsinx.es6-hasher.removeemptykeys');
    hasher.symbol.replacePrefixHash = Symbol('com.fxsinx.es6-hasher.replaceprefixhash');
    hasher.symbol.prefixHash = Symbol('com.fxsinx.es6-hasher.prefixhash');

    hasher.clean = () => hasher(hasher.symbol.clean);
    hasher.clear = () => hasher(hasher.symbol.clear);
    hasher.sortByKeys = () => hasher(hasher.symbol.sortByKeys);
    hasher.removeEmptyKeys = () => hasher(hasher.symbol.removeEmptyKeys);
    hasher.replacePrefixHash = (str) => hasher(hasher.symbol.replacePrefixHash, str);
    hasher.prefixHash = () => getPrefixHash();

    // make global
    w.hasher = hasher;

})(window);
