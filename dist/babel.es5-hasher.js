'use strict';

/*
 * ECMAScript 6 hasher plugin
 * (LICENSE) MIT, fxsinx.com
 */

(function (w) {
    'use strict';

    if (w.hasher) return;

    var loc = w.location;
    var history = w.history;
    var _preferReplaceState = false;

    var changeHash = function changeHash(str) {
        if (!_preferReplaceState && history.pushState) {
            history.pushState(null, null, '#' + str);
        } else if (history.replaceState) {
            history.replaceState(null, null, '#' + str);
        } else {
            loc.hash = str;
        }
    };

    var getAllHashesObject = function getAllHashesObject() {
        var o = {};
        var match = loc.hash.match(/;[^;]+=?[^;]*/g);
        if (match) {
            match.forEach(function (v, k, a) {
                var arr = v.slice(1).split('=');
                o[arr[0]] = arr[1] || '';
            });
        }
        return o;
    };

    var getType = function getType(o) {
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    };

    var getPrefixHash = function getPrefixHash() {
        var p = loc.hash.search(';');
        return loc.hash.slice(1, p < 0 ? loc.hash.length : p);
    };

    var writeObjectToHash = function writeObjectToHash(_ref) {
        var _ref$prefixHash = _ref.prefixHash;
        var prefixHash = _ref$prefixHash === undefined ? getPrefixHash() : _ref$prefixHash;
        var obj = _ref.object;
        var _ref$overwrite = _ref.overwrite;
        var overwrite = _ref$overwrite === undefined ? true : _ref$overwrite;

        if (!overwrite) {
            obj = Object.assign({}, getAllHashesObject(), obj);
        }
        obj = JSON.parse(JSON.stringify(obj)); // remove undefined items
        var hashArray = [];
        for (var key in obj) {
            hashArray.push(key + (obj[key] ? '=' + obj[key] : ''));
        }
        var sep = hashArray.length < 1 || prefixHash.endsWith(';') ? '' : ';';
        changeHash(prefixHash + sep + hashArray.join(';'));
    };

    var sortObjectByKeys = function sortObjectByKeys(obj) {
        var keys = Object.keys(obj);
        keys.sort();
        var o = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var k = _step.value;

                o[k] = obj[k];
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return o;
    };

    var invalidateEmptyObject = function invalidateEmptyObject(obj) {
        var o = {};
        for (var key in obj) {
            var val = (obj[key] || '').trim();
            o[key] = val ? val : undefined;
        }
        return o;
    };

    var hasher = function () {
        var _hasher = function _hasher(name, value) {
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
                var obj = getAllHashesObject();
                obj[name] = undefined;
                writeObjectToHash({
                    object: obj,
                    overwrite: true
                });
            } else {
                // add a specific pair
                var _obj = getAllHashesObject();
                _obj[name] = value;
                writeObjectToHash({
                    object: _obj,
                    overwrite: false
                });
            }
            return true;
        };
        return _hasher;
    }();

    hasher.config = function (_ref2) {
        var _ref2$preferReplaceSt = _ref2.preferReplaceState;
        var preferReplaceState = _ref2$preferReplaceSt === undefined ? false : _ref2$preferReplaceSt;

        _preferReplaceState = preferReplaceState;
    };

    hasher.symbol = {};

    hasher.symbol.clean = Symbol('com.fxsinx.es6-hasher.clean');
    hasher.symbol.clear = Symbol('com.fxsinx.es6-hasher.clear');
    hasher.symbol.sortByKeys = Symbol('com.fxsinx.es6-hasher.sortbykeys');
    hasher.symbol.removeEmptyKeys = Symbol('com.fxsinx.es6-hasher.removeemptykeys');
    hasher.symbol.replacePrefixHash = Symbol('com.fxsinx.es6-hasher.replaceprefixhash');
    hasher.symbol.prefixHash = Symbol('com.fxsinx.es6-hasher.prefixhash');

    hasher.clean = function () {
        return hasher(hasher.symbol.clean);
    };
    hasher.clear = function () {
        return hasher(hasher.symbol.clear);
    };
    hasher.sortByKeys = function () {
        return hasher(hasher.symbol.sortByKeys);
    };
    hasher.removeEmptyKeys = function () {
        return hasher(hasher.symbol.removeEmptyKeys);
    };
    hasher.replacePrefixHash = function (str) {
        return hasher(hasher.symbol.replacePrefixHash, str);
    };
    hasher.prefixHash = function () {
        return getPrefixHash();
    };

    // make global
    w.hasher = hasher;
})(window);
