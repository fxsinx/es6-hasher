# ECMAScript 6 hasher plugin
A javascript plugin written in ECMAScript 6 (also can be translated into ES5), providing you a convenient way to store and manage key-value pairs in the URL hash.

It is an upgrade of the [jQuery.hash](https://github.com/fxsinx/jquery-hash) plugin.

You may see a live demo at [here](https://fxsinx.github.io/es6-hasher/demo.html).

## Requirements ES6 & ES5
You need to make sure your browser works with ES6. Google Chrome version 50+ or Firefox will be a good choice.

To include the plugin library, you need to add the following code before closing your `</head>` or `</body>` tag.

```html
<script src="./es6-hasher.js" type="text/javascript" charset="utf-8"></script>
```

It can be translated by babel into ECMAScript 5 scripts, working with most modern browsers:

```html
<script src="./dist/babel.es5-hasher.min.js" type="text/javascript" charset="utf-8"></script>
```

## Usage
### Config
You can determine the plugin working mode.

```javascript
hasher.config({
    preferReplaceState: true
});
```

Setting this to be `true` means you want to use `history.replaceState()` everytime you modify the hash.

Setting this to be `false` means you want to use `history.pushState()` everytime you modify the hash.

You can change this setting any time.

**_What's the difference?_**

If you use `replaceState()`, browser history will not be generated when you modify the hash by using the plugin.

### Usage
#### Access the current prefix hash

```javascript
let ph = hasher.prefixHash();
// also
let ph = hasher(hasher.symbol.prefixHash);
```

#### Replace/Clear the prefix hash

```javascript
hasher.replacePrefixHash('new-prefix');
// also
hasher( hasher.symbol.replacePrefixHash, 'new-prefix');
```

To clean the prefix hash:

```javascript
hasher.replacePrefixHash('');
```

#### Add/Modify a key-value pair

```javascript
hasher('key', 'val');
```

The hash is going to be like `#prefixHash;key=val`.

You can also give it an empty value:

```javascript
hasher('key', '');
```

#### Remove all empty keys
If you want to get rid of all empty keys (like above) in the hash:

```javascript
hasher(hasher.symbol.removeEmptyKeys);
// also
hasher.removeEmptyKeys();
```

You'll see they disappear in the hash.

#### Get the value of key

```javascript
let val = hasher('key');
```

#### Remove a key-value pair

```javascript
hasher('key', null);
```

#### Write object into hash

```javascript
let obj = {a:'value-a', b:'value-b'};
hasher(obj);
```

The hash is going to be like `#prefixHash;a=value-a;b=value-b`.

#### Get all key-value pairs as an object

```javascript
let obj = hasher();
```

#### Sort hash by keys
You can sort the pairs in hash by keys.

```javascript
hasher(hasher.symbol.sortByKeys);
// also
hasher.sortByKeys();
```

#### Clean out all key-value pairs

```javascript
hasher(hasher.symbol.clean);
// also
hasher.clean();
```

#### Clear everything in hash
Completely clear everything out of hash, including the prefix hash.

```javascript
hasher(hasher.symbol.clear);
// also
hasher.clear();
```
