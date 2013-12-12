/*!
 * jQuery JavaScript Library v1.5
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Jan 31 08:31:29 2011 -0500
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
    var document = window.document;
    var jQuery = (function() {

// Define a local copy of jQuery
        var jQuery = function( selector, context ) {
                // The jQuery object is actually just the init constructor 'enhanced'
                return new jQuery.fn.init( selector, context, rootjQuery );
            },

        // Map over jQuery in case of overwrite
            _jQuery = window.jQuery,

        // Map over the $ in case of overwrite
            _$ = window.$,

        // A central reference to the root jQuery(document)
            rootjQuery,

        // A simple way to check for HTML strings or ID strings
        // (both of which we optimize for)
            quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

        // Check if a string has a non-whitespace character in it
            rnotwhite = /\S/,

        // Used for trimming whitespace
            trimLeft = /^\s+/,
            trimRight = /\s+$/,

        // Check for digits
            rdigit = /\d/,

        // Match a standalone tag
            rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

        // JSON RegExp
            rvalidchars = /^[\],:{}\s]*$/,
            rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

        // Useragent RegExp
            rwebkit = /(webkit)[ \/]([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

        // Keep a UserAgent string for use with jQuery.browser
            userAgent = navigator.userAgent,

        // For matching the engine and version of the browser
            browserMatch,

        // Has the ready events already been bound?
            readyBound = false,

        // The deferred used on DOM ready
            readyList,

        // Promise methods
            promiseMethods = "then done fail isResolved isRejected promise".split( " " ),

        // The ready event handler
            DOMContentLoaded,

        // Save a reference to some core methods
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty,
            push = Array.prototype.push,
            slice = Array.prototype.slice,
            trim = String.prototype.trim,
            indexOf = Array.prototype.indexOf,

        // [[Class]] -> type pairs
            class2type = {};

        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            init: function( selector, context, rootjQuery ) {
                var match, elem, ret, doc;

                // Handle $(""), $(null), or $(undefined)
                if ( !selector ) {
                    return this;
                }

                // Handle $(DOMElement)
                if ( selector.nodeType ) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                // The body element only exists once, optimize finding it
                if ( selector === "body" && !context && document.body ) {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = "body";
                    this.length = 1;
                    return this;
                }

                // Handle HTML strings
                if ( typeof selector === "string" ) {
                    // Are we dealing with HTML string or an ID?
                    match = quickExpr.exec( selector );

                    // Verify a match, and that no context was specified for #id
                    if ( match && (match[1] || !context) ) {

                        // HANDLE: $(html) -> $(array)
                        if ( match[1] ) {
                            context = context instanceof jQuery ? context[0] : context;
                            doc = (context ? context.ownerDocument || context : document);

                            // If a single string is passed in and it's a single tag
                            // just do a createElement and skip the rest
                            ret = rsingleTag.exec( selector );

                            if ( ret ) {
                                if ( jQuery.isPlainObject( context ) ) {
                                    selector = [ document.createElement( ret[1] ) ];
                                    jQuery.fn.attr.call( selector, context, true );

                                } else {
                                    selector = [ doc.createElement( ret[1] ) ];
                                }

                            } else {
                                ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
                                selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                            }

                            return jQuery.merge( this, selector );

                            // HANDLE: $("#id")
                        } else {
                            elem = document.getElementById( match[2] );

                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if ( elem && elem.parentNode ) {
                                // Handle the case where IE and Opera return items
                                // by name instead of ID
                                if ( elem.id !== match[2] ) {
                                    return rootjQuery.find( selector );
                                }

                                // Otherwise, we inject the element directly into the jQuery object
                                this.length = 1;
                                this[0] = elem;
                            }

                            this.context = document;
                            this.selector = selector;
                            return this;
                        }

                        // HANDLE: $(expr, $(...))
                    } else if ( !context || context.jquery ) {
                        return (context || rootjQuery).find( selector );

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                    } else {
                        return this.constructor( context ).find( selector );
                    }

                    // HANDLE: $(function)
                    // Shortcut for document ready
                } else if ( jQuery.isFunction( selector ) ) {
                    return rootjQuery.ready( selector );
                }

                if (selector.selector !== undefined) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return jQuery.makeArray( selector, this );
            },

            // Start with an empty selector
            selector: "",

            // The current version of jQuery being used
            jquery: "1.5",

            // The default length of a jQuery object is 0
            length: 0,

            // The number of elements contained in the matched element set
            size: function() {
                return this.length;
            },

            toArray: function() {
                return slice.call( this, 0 );
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function( num ) {
                return num == null ?

                    // Return a 'clean' array
                    this.toArray() :

                    // Return just the object
                    ( num < 0 ? this[ this.length + num ] : this[ num ] );
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function( elems, name, selector ) {
                // Build a new jQuery matched element set
                var ret = this.constructor();

                if ( jQuery.isArray( elems ) ) {
                    push.apply( ret, elems );

                } else {
                    jQuery.merge( ret, elems );
                }

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;

                ret.context = this.context;

                if ( name === "find" ) {
                    ret.selector = this.selector + (this.selector ? " " : "") + selector;
                } else if ( name ) {
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                }

                // Return the newly-formed element set
                return ret;
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function( callback, args ) {
                return jQuery.each( this, callback, args );
            },

            ready: function( fn ) {
                // Attach the listeners
                jQuery.bindReady();

                // Add the callback
                readyList.done( fn );

                return this;
            },

            eq: function( i ) {
                return i === -1 ?
                    this.slice( i ) :
                    this.slice( i, +i + 1 );
            },

            first: function() {
                return this.eq( 0 );
            },

            last: function() {
                return this.eq( -1 );
            },

            slice: function() {
                return this.pushStack( slice.apply( this, arguments ),
                    "slice", slice.call(arguments).join(",") );
            },

            map: function( callback ) {
                return this.pushStack( jQuery.map(this, function( elem, i ) {
                    return callback.call( elem, i, elem );
                }));
            },

            end: function() {
                return this.prevObject || this.constructor(null);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jQuery method.
            push: push,
            sort: [].sort,
            splice: [].splice
        };

// Give the init function the jQuery prototype for later instantiation
        jQuery.fn.init.prototype = jQuery.fn;

        jQuery.extend = jQuery.fn.extend = function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if ( length === i ) {
                target = this;
                --i;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];

                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = jQuery.extend( deep, clone, copy );

                            // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        jQuery.extend({
            noConflict: function( deep ) {
                window.$ = _$;

                if ( deep ) {
                    window.jQuery = _jQuery;
                }

                return jQuery;
            },

            // Is the DOM ready to be used? Set to true once it occurs.
            isReady: false,

            // A counter to track how many items to wait for before
            // the ready event fires. See #6781
            readyWait: 1,

            // Handle when the DOM is ready
            ready: function( wait ) {
                // A third-party is pushing the ready event forwards
                if ( wait === true ) {
                    jQuery.readyWait--;
                }

                // Make sure that the DOM is not already loaded
                if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
                    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if ( !document.body ) {
                        return setTimeout( jQuery.ready, 1 );
                    }

                    // Remember that the DOM is ready
                    jQuery.isReady = true;

                    // If a normal DOM Ready event fired, decrement, and wait if need be
                    if ( wait !== true && --jQuery.readyWait > 0 ) {
                        return;
                    }

                    // If there are functions bound, to execute
                    readyList.resolveWith( document, [ jQuery ] );

                    // Trigger any bound ready events
                    if ( jQuery.fn.trigger ) {
                        jQuery( document ).trigger( "ready" ).unbind( "ready" );
                    }
                }
            },

            bindReady: function() {
                if ( readyBound ) {
                    return;
                }

                readyBound = true;

                // Catch cases where $(document).ready() is called after the
                // browser event has already occurred.
                if ( document.readyState === "complete" ) {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    return setTimeout( jQuery.ready, 1 );
                }

                // Mozilla, Opera and webkit nightlies currently support this event
                if ( document.addEventListener ) {
                    // Use the handy event callback
                    document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                    // A fallback to window.onload, that will always work
                    window.addEventListener( "load", jQuery.ready, false );

                    // If IE event model is used
                } else if ( document.attachEvent ) {
                    // ensure firing before onload,
                    // maybe late but safe also for iframes
                    document.attachEvent("onreadystatechange", DOMContentLoaded);

                    // A fallback to window.onload, that will always work
                    window.attachEvent( "onload", jQuery.ready );

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var toplevel = false;

                    try {
                        toplevel = window.frameElement == null;
                    } catch(e) {}

                    if ( document.documentElement.doScroll && toplevel ) {
                        doScrollCheck();
                    }
                }
            },

            // See test/unit/core.js for details concerning isFunction.
            // Since version 1.3, DOM methods and functions like alert
            // aren't supported. They return false on IE (#2968).
            isFunction: function( obj ) {
                return jQuery.type(obj) === "function";
            },

            isArray: Array.isArray || function( obj ) {
                return jQuery.type(obj) === "array";
            },

            // A crude way of determining if an object is a window
            isWindow: function( obj ) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            },

            isNaN: function( obj ) {
                return obj == null || !rdigit.test( obj ) || isNaN( obj );
            },

            type: function( obj ) {
                return obj == null ?
                    String( obj ) :
                    class2type[ toString.call(obj) ] || "object";
            },

            isPlainObject: function( obj ) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                    return false;
                }

                // Not own constructor property must be Object
                if ( obj.constructor &&
                    !hasOwn.call(obj, "constructor") &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for ( key in obj ) {}

                return key === undefined || hasOwn.call( obj, key );
            },

            isEmptyObject: function( obj ) {
                for ( var name in obj ) {
                    return false;
                }
                return true;
            },

            error: function( msg ) {
                throw msg;
            },

            parseJSON: function( data ) {
                if ( typeof data !== "string" || !data ) {
                    return null;
                }

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim( data );

                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if ( rvalidchars.test(data.replace(rvalidescape, "@")
                    .replace(rvalidtokens, "]")
                    .replace(rvalidbraces, "")) ) {

                    // Try to use the native JSON parser first
                    return window.JSON && window.JSON.parse ?
                        window.JSON.parse( data ) :
                        (new Function("return " + data))();

                } else {
                    jQuery.error( "Invalid JSON: " + data );
                }
            },

            // Cross-browser xml parsing
            // (xml & tmp used internally)
            parseXML: function( data , xml , tmp ) {

                if ( window.DOMParser ) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString( data , "text/xml" );
                } else { // IE
                    xml = new ActiveXObject( "Microsoft.XMLDOM" );
                    xml.async = "false";
                    xml.loadXML( data );
                }

                tmp = xml.documentElement;

                if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
                    jQuery.error( "Invalid XML: " + data );
                }

                return xml;
            },

            noop: function() {},

            // Evalulates a script in a global context
            globalEval: function( data ) {
                if ( data && rnotwhite.test(data) ) {
                    // Inspired by code by Andrea Giammarchi
                    // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                    var head = document.getElementsByTagName("head")[0] || document.documentElement,
                        script = document.createElement("script");

                    script.type = "text/javascript";

                    if ( jQuery.support.scriptEval() ) {
                        script.appendChild( document.createTextNode( data ) );
                    } else {
                        script.text = data;
                    }

                    // Use insertBefore instead of appendChild to circumvent an IE6 bug.
                    // This arises when a base node is used (#2709).
                    head.insertBefore( script, head.firstChild );
                    head.removeChild( script );
                }
            },

            nodeName: function( elem, name ) {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
            },

            // args is for internal usage only
            each: function( object, callback, args ) {
                var name, i = 0,
                    length = object.length,
                    isObj = length === undefined || jQuery.isFunction(object);

                if ( args ) {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.apply( object[ name ], args ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( ; i < length; ) {
                            if ( callback.apply( object[ i++ ], args ) === false ) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( var value = object[0];
                              i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
                    }
                }

                return object;
            },

            // Use native String.trim function wherever possible
            trim: trim ?
                function( text ) {
                    return text == null ?
                        "" :
                        trim.call( text );
                } :

                // Otherwise use our own trimming functionality
                function( text ) {
                    return text == null ?
                        "" :
                        text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
                },

            // results is for internal usage only
            makeArray: function( array, results ) {
                var ret = results || [];

                if ( array != null ) {
                    // The window, strings (and functions) also have 'length'
                    // The extra typeof function check is to prevent crashes
                    // in Safari 2 (See: #3039)
                    // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                    var type = jQuery.type(array);

                    if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
                        push.call( ret, array );
                    } else {
                        jQuery.merge( ret, array );
                    }
                }

                return ret;
            },

            inArray: function( elem, array ) {
                if ( array.indexOf ) {
                    return array.indexOf( elem );
                }

                for ( var i = 0, length = array.length; i < length; i++ ) {
                    if ( array[ i ] === elem ) {
                        return i;
                    }
                }

                return -1;
            },

            merge: function( first, second ) {
                var i = first.length,
                    j = 0;

                if ( typeof second.length === "number" ) {
                    for ( var l = second.length; j < l; j++ ) {
                        first[ i++ ] = second[ j ];
                    }

                } else {
                    while ( second[j] !== undefined ) {
                        first[ i++ ] = second[ j++ ];
                    }
                }

                first.length = i;

                return first;
            },

            grep: function( elems, callback, inv ) {
                var ret = [], retVal;
                inv = !!inv;

                // Go through the array, only saving the items
                // that pass the validator function
                for ( var i = 0, length = elems.length; i < length; i++ ) {
                    retVal = !!callback( elems[ i ], i );
                    if ( inv !== retVal ) {
                        ret.push( elems[ i ] );
                    }
                }

                return ret;
            },

            // arg is for internal usage only
            map: function( elems, callback, arg ) {
                var ret = [], value;

                // Go through the array, translating each of the items to their
                // new value (or values).
                for ( var i = 0, length = elems.length; i < length; i++ ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }

                // Flatten any nested arrays
                return ret.concat.apply( [], ret );
            },

            // A global GUID counter for objects
            guid: 1,

            proxy: function( fn, proxy, thisObject ) {
                if ( arguments.length === 2 ) {
                    if ( typeof proxy === "string" ) {
                        thisObject = fn;
                        fn = thisObject[ proxy ];
                        proxy = undefined;

                    } else if ( proxy && !jQuery.isFunction( proxy ) ) {
                        thisObject = proxy;
                        proxy = undefined;
                    }
                }

                if ( !proxy && fn ) {
                    proxy = function() {
                        return fn.apply( thisObject || this, arguments );
                    };
                }

                // Set the guid of unique handler to the same of original handler, so it can be removed
                if ( fn ) {
                    proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
                }

                // So proxy can be declared as an argument
                return proxy;
            },

            // Mutifunctional method to get and set values to a collection
            // The value/s can be optionally by executed if its a function
            access: function( elems, key, value, exec, fn, pass ) {
                var length = elems.length;

                // Setting many attributes
                if ( typeof key === "object" ) {
                    for ( var k in key ) {
                        jQuery.access( elems, k, key[k], exec, fn, value );
                    }
                    return elems;
                }

                // Setting one attribute
                if ( value !== undefined ) {
                    // Optionally, function values get executed if exec is true
                    exec = !pass && exec && jQuery.isFunction(value);

                    for ( var i = 0; i < length; i++ ) {
                        fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
                    }

                    return elems;
                }

                // Getting an attribute
                return length ? fn( elems[0], key ) : undefined;
            },

            now: function() {
                return (new Date()).getTime();
            },

            // Create a simple deferred (one callbacks list)
            _Deferred: function() {
                var // callbacks list
                    callbacks = [],
                // stored [ context , args ]
                    fired,
                // to avoid firing when already doing so
                    firing,
                // flag to know if the deferred has been cancelled
                    cancelled,
                // the deferred itself
                    deferred  = {

                        // done( f1, f2, ...)
                        done: function() {
                            if ( !cancelled ) {
                                var args = arguments,
                                    i,
                                    length,
                                    elem,
                                    type,
                                    _fired;
                                if ( fired ) {
                                    _fired = fired;
                                    fired = 0;
                                }
                                for ( i = 0, length = args.length; i < length; i++ ) {
                                    elem = args[ i ];
                                    type = jQuery.type( elem );
                                    if ( type === "array" ) {
                                        deferred.done.apply( deferred, elem );
                                    } else if ( type === "function" ) {
                                        callbacks.push( elem );
                                    }
                                }
                                if ( _fired ) {
                                    deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
                                }
                            }
                            return this;
                        },

                        // resolve with given context and args
                        resolveWith: function( context, args ) {
                            if ( !cancelled && !fired && !firing ) {
                                firing = 1;
                                try {
                                    while( callbacks[ 0 ] ) {
                                        callbacks.shift().apply( context, args );
                                    }
                                }
                                finally {
                                    fired = [ context, args ];
                                    firing = 0;
                                }
                            }
                            return this;
                        },

                        // resolve with this as context and given arguments
                        resolve: function() {
                            deferred.resolveWith( jQuery.isFunction( this.promise ) ? this.promise() : this, arguments );
                            return this;
                        },

                        // Has this deferred been resolved?
                        isResolved: function() {
                            return !!( firing || fired );
                        },

                        // Cancel
                        cancel: function() {
                            cancelled = 1;
                            callbacks = [];
                            return this;
                        }
                    };

                return deferred;
            },

            // Full fledged deferred (two callbacks list)
            Deferred: function( func ) {
                var deferred = jQuery._Deferred(),
                    failDeferred = jQuery._Deferred(),
                    promise;
                // Add errorDeferred methods, then and promise
                jQuery.extend( deferred, {
                    then: function( doneCallbacks, failCallbacks ) {
                        deferred.done( doneCallbacks ).fail( failCallbacks );
                        return this;
                    },
                    fail: failDeferred.done,
                    rejectWith: failDeferred.resolveWith,
                    reject: failDeferred.resolve,
                    isRejected: failDeferred.isResolved,
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function( obj , i /* internal */ ) {
                        if ( obj == null ) {
                            if ( promise ) {
                                return promise;
                            }
                            promise = obj = {};
                        }
                        i = promiseMethods.length;
                        while( i-- ) {
                            obj[ promiseMethods[ i ] ] = deferred[ promiseMethods[ i ] ];
                        }
                        return obj;
                    }
                } );
                // Make sure only one callback list will be used
                deferred.then( failDeferred.cancel, deferred.cancel );
                // Unexpose cancel
                delete deferred.cancel;
                // Call given func if any
                if ( func ) {
                    func.call( deferred, deferred );
                }
                return deferred;
            },

            // Deferred helper
            when: function( object ) {
                var args = arguments,
                    length = args.length,
                    deferred = length <= 1 && object && jQuery.isFunction( object.promise ) ?
                        object :
                        jQuery.Deferred(),
                    promise = deferred.promise(),
                    resolveArray;

                if ( length > 1 ) {
                    resolveArray = new Array( length );
                    jQuery.each( args, function( index, element ) {
                        jQuery.when( element ).then( function( value ) {
                            resolveArray[ index ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
                            if( ! --length ) {
                                deferred.resolveWith( promise, resolveArray );
                            }
                        }, deferred.reject );
                    } );
                } else if ( deferred !== object ) {
                    deferred.resolve( object );
                }
                return promise;
            },

            // Use of jQuery.browser is frowned upon.
            // More details: http://docs.jquery.com/Utilities/jQuery.browser
            uaMatch: function( ua ) {
                ua = ua.toLowerCase();

                var match = rwebkit.exec( ua ) ||
                    ropera.exec( ua ) ||
                    rmsie.exec( ua ) ||
                    ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
                    [];

                return { browser: match[1] || "", version: match[2] || "0" };
            },

            sub: function() {
                function jQuerySubclass( selector, context ) {
                    return new jQuerySubclass.fn.init( selector, context );
                }
                jQuery.extend( true, jQuerySubclass, this );
                jQuerySubclass.superclass = this;
                jQuerySubclass.fn = jQuerySubclass.prototype = this();
                jQuerySubclass.fn.constructor = jQuerySubclass;
                jQuerySubclass.subclass = this.subclass;
                jQuerySubclass.fn.init = function init( selector, context ) {
                    if ( context && context instanceof jQuery && !(context instanceof jQuerySubclass) ) {
                        context = jQuerySubclass(context);
                    }

                    return jQuery.fn.init.call( this, selector, context, rootjQuerySubclass );
                };
                jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
                var rootjQuerySubclass = jQuerySubclass(document);
                return jQuerySubclass;
            },

            browser: {}
        });

// Create readyList deferred
        readyList = jQuery._Deferred();

// Populate the class2type map
        jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        });

        browserMatch = jQuery.uaMatch( userAgent );
        if ( browserMatch.browser ) {
            jQuery.browser[ browserMatch.browser ] = true;
            jQuery.browser.version = browserMatch.version;
        }

// Deprecated, use jQuery.browser.webkit instead
        if ( jQuery.browser.webkit ) {
            jQuery.browser.safari = true;
        }

        if ( indexOf ) {
            jQuery.inArray = function( elem, array ) {
                return indexOf.call( array, elem );
            };
        }

// IE doesn't match non-breaking spaces with \s
        if ( rnotwhite.test( "\xA0" ) ) {
            trimLeft = /^[\s\xA0]+/;
            trimRight = /[\s\xA0]+$/;
        }

// All jQuery objects should point back to these
        rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
        if ( document.addEventListener ) {
            DOMContentLoaded = function() {
                document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                jQuery.ready();
            };

        } else if ( document.attachEvent ) {
            DOMContentLoaded = function() {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( document.readyState === "complete" ) {
                    document.detachEvent( "onreadystatechange", DOMContentLoaded );
                    jQuery.ready();
                }
            };
        }

// The DOM ready check for Internet Explorer
        function doScrollCheck() {
            if ( jQuery.isReady ) {
                return;
            }

            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch(e) {
                setTimeout( doScrollCheck, 1 );
                return;
            }

            // and execute any waiting functions
            jQuery.ready();
        }

// Expose jQuery to the global object
        return (window.jQuery = window.$ = jQuery);

    })();


    (function() {

        jQuery.support = {};

        var div = document.createElement("div");

        div.style.display = "none";
        div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

        var all = div.getElementsByTagName("*"),
            a = div.getElementsByTagName("a")[0],
            select = document.createElement("select"),
            opt = select.appendChild( document.createElement("option") );

        // Can't get basic test support
        if ( !all || !all.length || !a ) {
            return;
        }

        jQuery.support = {
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: div.firstChild.nodeType === 3,

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,

            // Get the style information from getAttribute
            // (IE uses .cssText insted)
            style: /red/.test( a.getAttribute("style") ),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: a.getAttribute("href") === "/a",

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.55$/.test( a.style.opacity ),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,

            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: div.getElementsByTagName("input")[0].value === "on",

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,

            // Will be defined later
            deleteExpando: true,
            optDisabled: false,
            checkClone: false,
            _scriptEval: null,
            noCloneEvent: true,
            boxModel: null,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableHiddenOffsets: true
        };

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as diabled)
        select.disabled = true;
        jQuery.support.optDisabled = !opt.disabled;

        jQuery.support.scriptEval = function() {
            if ( jQuery.support._scriptEval === null ) {
                var root = document.documentElement,
                    script = document.createElement("script"),
                    id = "script" + jQuery.now();

                script.type = "text/javascript";
                try {
                    script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
                } catch(e) {}

                root.insertBefore( script, root.firstChild );

                // Make sure that the execution of code works by injecting a script
                // tag with appendChild/createTextNode
                // (IE doesn't support this, fails, and uses .text instead)
                if ( window[ id ] ) {
                    jQuery.support._scriptEval = true;
                    delete window[ id ];
                } else {
                    jQuery.support._scriptEval = false;
                }

                root.removeChild( script );
                // release memory in IE
                root = script = id  = null;
            }

            return jQuery.support._scriptEval;
        };

        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
            delete div.test;

        } catch(e) {
            jQuery.support.deleteExpando = false;
        }

        if ( div.attachEvent && div.fireEvent ) {
            div.attachEvent("onclick", function click() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                jQuery.support.noCloneEvent = false;
                div.detachEvent("onclick", click);
            });
            div.cloneNode(true).fireEvent("onclick");
        }

        div = document.createElement("div");
        div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

        var fragment = document.createDocumentFragment();
        fragment.appendChild( div.firstChild );

        // WebKit doesn't clone checked state correctly in fragments
        jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

        // Figure out if the W3C box model works as expected
        // document.body must exist before we can do this
        jQuery(function() {
            var div = document.createElement("div"),
                body = document.getElementsByTagName("body")[0];

            // Frameset documents with no body should not run this code
            if ( !body ) {
                return;
            }

            div.style.width = div.style.paddingLeft = "1px";
            body.appendChild( div );
            jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

            if ( "zoom" in div.style ) {
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                // (IE < 8 does this)
                div.style.display = "inline";
                div.style.zoom = 1;
                jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

                // Check if elements with layout shrink-wrap their children
                // (IE 6 does this)
                div.style.display = "";
                div.innerHTML = "<div style='width:4px;'></div>";
                jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
            }

            div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
            var tds = div.getElementsByTagName("td");

            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            // (only IE 8 fails this test)
            jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

            tds[0].style.display = "";
            tds[1].style.display = "none";

            // Check if empty table cells still have offsetWidth/Height
            // (IE < 8 fail this test)
            jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
            div.innerHTML = "";

            body.removeChild( div ).style.display = "none";
            div = tds = null;
        });

        // Technique from Juriy Zaytsev
        // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
        var eventSupported = function( eventName ) {
            var el = document.createElement("div");
            eventName = "on" + eventName;

            // We only care about the case where non-standard event systems
            // are used, namely in IE. Short-circuiting here helps us to
            // avoid an eval call (in setAttribute) which can cause CSP
            // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
            if ( !el.attachEvent ) {
                return true;
            }

            var isSupported = (eventName in el);
            if ( !isSupported ) {
                el.setAttribute(eventName, "return;");
                isSupported = typeof el[eventName] === "function";
            }
            el = null;

            return isSupported;
        };

        jQuery.support.submitBubbles = eventSupported("submit");
        jQuery.support.changeBubbles = eventSupported("change");

        // release memory in IE
        div = all = a = null;
    })();



    var rbrace = /^(?:\{.*\}|\[.*\])$/;

    jQuery.extend({
        cache: {},

        // Please use with caution
        uuid: 0,

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function( elem ) {
            elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

            return !!elem && !jQuery.isEmptyObject(elem);
        },

        data: function( elem, name, data, pvt /* Internal Use Only */ ) {
            if ( !jQuery.acceptData( elem ) ) {
                return;
            }

            var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
                isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
                cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
                id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
                return;
            }

            if ( !id ) {
                // Only DOM nodes need a new unique ID for each element since their data
                // ends up in the global cache
                if ( isNode ) {
                    elem[ jQuery.expando ] = id = ++jQuery.uuid;
                } else {
                    id = jQuery.expando;
                }
            }

            if ( !cache[ id ] ) {
                cache[ id ] = {};
            }

            // An object can be passed to jQuery.data instead of a key/value pair; this gets
            // shallow copied over onto the existing cache
            if ( typeof name === "object" ) {
                if ( pvt ) {
                    cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
                } else {
                    cache[ id ] = jQuery.extend(cache[ id ], name);
                }
            }

            thisCache = cache[ id ];

            // Internal jQuery data is stored in a separate object inside the object's data
            // cache in order to avoid key collisions between internal data and user-defined
            // data
            if ( pvt ) {
                if ( !thisCache[ internalKey ] ) {
                    thisCache[ internalKey ] = {};
                }

                thisCache = thisCache[ internalKey ];
            }

            if ( data !== undefined ) {
                thisCache[ name ] = data;
            }

            // TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
            // not attempt to inspect the internal events object using jQuery.data, as this
            // internal data object is undocumented and subject to change.
            if ( name === "events" && !thisCache[name] ) {
                return thisCache[ internalKey ] && thisCache[ internalKey ].events;
            }

            return getByName ? thisCache[ name ] : thisCache;
        },

        removeData: function( elem, name, pvt /* Internal Use Only */ ) {
            if ( !jQuery.acceptData( elem ) ) {
                return;
            }

            var internalKey = jQuery.expando, isNode = elem.nodeType,

            // See jQuery.data for more information
                cache = isNode ? jQuery.cache : elem,

            // See jQuery.data for more information
                id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if ( !cache[ id ] ) {
                return;
            }

            if ( name ) {
                var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

                if ( thisCache ) {
                    delete thisCache[ name ];

                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if ( !jQuery.isEmptyObject(thisCache) ) {
                        return;
                    }
                }
            }

            // See jQuery.data for more information
            if ( pvt ) {
                delete cache[ id ][ internalKey ];

                // Don't destroy the parent cache unless the internal data object
                // had been the only thing left in it
                if ( !jQuery.isEmptyObject(cache[ id ]) ) {
                    return;
                }
            }

            var internalCache = cache[ id ][ internalKey ];

            // Browsers that fail expando deletion also refuse to delete expandos on
            // the window, but it will allow it on all other JS objects; other browsers
            // don't care
            if ( jQuery.support.deleteExpando || cache != window ) {
                delete cache[ id ];
            } else {
                cache[ id ] = null;
            }

            // We destroyed the entire user cache at once because it's faster than
            // iterating through each key, but we need to continue to persist internal
            // data if it existed
            if ( internalCache ) {
                cache[ id ] = {};
                cache[ id ][ internalKey ] = internalCache;

                // Otherwise, we need to eliminate the expando on the node to avoid
                // false lookups in the cache for entries that no longer exist
            } else if ( isNode ) {
                // IE does not allow us to delete expando properties from nodes,
                // nor does it have a removeAttribute function on Document nodes;
                // we must handle all of these cases
                if ( jQuery.support.deleteExpando ) {
                    delete elem[ jQuery.expando ];
                } else if ( elem.removeAttribute ) {
                    elem.removeAttribute( jQuery.expando );
                } else {
                    elem[ jQuery.expando ] = null;
                }
            }
        },

        // For internal use only.
        _data: function( elem, name, data ) {
            return jQuery.data( elem, name, data, true );
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
            if ( elem.nodeName ) {
                var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

                if ( match ) {
                    return !(match === true || elem.getAttribute("classid") !== match);
                }
            }

            return true;
        }
    });

    jQuery.fn.extend({
        data: function( key, value ) {
            var data = null;

            if ( typeof key === "undefined" ) {
                if ( this.length ) {
                    data = jQuery.data( this[0] );

                    if ( this[0].nodeType === 1 ) {
                        var attr = this[0].attributes, name;
                        for ( var i = 0, l = attr.length; i < l; i++ ) {
                            name = attr[i].name;

                            if ( name.indexOf( "data-" ) === 0 ) {
                                name = name.substr( 5 );
                                dataAttr( this[0], name, data[ name ] );
                            }
                        }
                    }
                }

                return data;

            } else if ( typeof key === "object" ) {
                return this.each(function() {
                    jQuery.data( this, key );
                });
            }

            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";

            if ( value === undefined ) {
                data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

                // Try to fetch any internally stored data first
                if ( data === undefined && this.length ) {
                    data = jQuery.data( this[0], key );
                    data = dataAttr( this[0], key, data );
                }

                return data === undefined && parts[1] ?
                    this.data( parts[0] ) :
                    data;

            } else {
                return this.each(function() {
                    var $this = jQuery( this ),
                        args = [ parts[0], value ];

                    $this.triggerHandler( "setData" + parts[1] + "!", args );
                    jQuery.data( this, key, value );
                    $this.triggerHandler( "changeData" + parts[1] + "!", args );
                });
            }
        },

        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    });

    function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {
            data = elem.getAttribute( "data-" + key );

            if ( typeof data === "string" ) {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                            data === "null" ? null :
                                !jQuery.isNaN( data ) ? parseFloat( data ) :
                                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                                        data;
                } catch( e ) {}

                // Make sure we set the data so it isn't changed later
                jQuery.data( elem, key, data );

            } else {
                data = undefined;
            }
        }

        return data;
    }




    jQuery.extend({
        queue: function( elem, type, data ) {
            if ( !elem ) {
                return;
            }

            type = (type || "fx") + "queue";
            var q = jQuery._data( elem, type );

            // Speed up dequeue by getting out quickly if this is just a lookup
            if ( !data ) {
                return q || [];
            }

            if ( !q || jQuery.isArray(data) ) {
                q = jQuery._data( elem, type, jQuery.makeArray(data) );

            } else {
                q.push( data );
            }

            return q;
        },

        dequeue: function( elem, type ) {
            type = type || "fx";

            var queue = jQuery.queue( elem, type ),
                fn = queue.shift();

            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                fn = queue.shift();
            }

            if ( fn ) {
                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if ( type === "fx" ) {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    jQuery.dequeue(elem, type);
                });
            }

            if ( !queue.length ) {
                jQuery.removeData( elem, type + "queue", true );
            }
        }
    });

    jQuery.fn.extend({
        queue: function( type, data ) {
            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
            }

            if ( data === undefined ) {
                return jQuery.queue( this[0], type );
            }
            return this.each(function( i ) {
                var queue = jQuery.queue( this, type, data );

                if ( type === "fx" && queue[0] !== "inprogress" ) {
                    jQuery.dequeue( this, type );
                }
            });
        },
        dequeue: function( type ) {
            return this.each(function() {
                jQuery.dequeue( this, type );
            });
        },

        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue( type, function() {
                var elem = this;
                setTimeout(function() {
                    jQuery.dequeue( elem, type );
                }, time );
            });
        },

        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        }
    });




    var rclass = /[\n\t\r]/g,
        rspaces = /\s+/,
        rreturn = /\r/g,
        rspecialurl = /^(?:href|src|style)$/,
        rtype = /^(?:button|input)$/i,
        rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea)?$/i,
        rradiocheck = /^(?:radio|checkbox)$/i;

    jQuery.props = {
        "for": "htmlFor",
        "class": "className",
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        colspan: "colSpan",
        tabindex: "tabIndex",
        usemap: "useMap",
        frameborder: "frameBorder"
    };

    jQuery.fn.extend({
        attr: function( name, value ) {
            return jQuery.access( this, name, value, true, jQuery.attr );
        },

        removeAttr: function( name, fn ) {
            return this.each(function(){
                jQuery.attr( this, name, "" );
                if ( this.nodeType === 1 ) {
                    this.removeAttribute( name );
                }
            });
        },

        addClass: function( value ) {
            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    self.addClass( value.call(this, i, self.attr("class")) );
                });
            }

            if ( value && typeof value === "string" ) {
                var classNames = (value || "").split( rspaces );

                for ( var i = 0, l = this.length; i < l; i++ ) {
                    var elem = this[i];

                    if ( elem.nodeType === 1 ) {
                        if ( !elem.className ) {
                            elem.className = value;

                        } else {
                            var className = " " + elem.className + " ",
                                setClass = elem.className;

                            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
                                if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
                                    setClass += " " + classNames[c];
                                }
                            }
                            elem.className = jQuery.trim( setClass );
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function( value ) {
            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    self.removeClass( value.call(this, i, self.attr("class")) );
                });
            }

            if ( (value && typeof value === "string") || value === undefined ) {
                var classNames = (value || "").split( rspaces );

                for ( var i = 0, l = this.length; i < l; i++ ) {
                    var elem = this[i];

                    if ( elem.nodeType === 1 && elem.className ) {
                        if ( value ) {
                            var className = (" " + elem.className + " ").replace(rclass, " ");
                            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
                                className = className.replace(" " + classNames[c] + " ", " ");
                            }
                            elem.className = jQuery.trim( className );

                        } else {
                            elem.className = "";
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function( value, stateVal ) {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";

            if ( jQuery.isFunction( value ) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
                });
            }

            return this.each(function() {
                if ( type === "string" ) {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery( this ),
                        state = stateVal,
                        classNames = value.split( rspaces );

                    while ( (className = classNames[ i++ ]) ) {
                        // check each className given, space seperated list
                        state = isBool ? state : !self.hasClass( className );
                        self[ state ? "addClass" : "removeClass" ]( className );
                    }

                } else if ( type === "undefined" || type === "boolean" ) {
                    if ( this.className ) {
                        // store className if set
                        jQuery._data( this, "__className__", this.className );
                    }

                    // toggle whole className
                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                }
            });
        },

        hasClass: function( selector ) {
            var className = " " + selector + " ";
            for ( var i = 0, l = this.length; i < l; i++ ) {
                if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
                    return true;
                }
            }

            return false;
        },

        val: function( value ) {
            if ( !arguments.length ) {
                var elem = this[0];

                if ( elem ) {
                    if ( jQuery.nodeName( elem, "option" ) ) {
                        // attributes.value is undefined in Blackberry 4.7 but
                        // uses .value. See #6932
                        var val = elem.attributes.value;
                        return !val || val.specified ? elem.value : elem.text;
                    }

                    // We need to handle select boxes special
                    if ( jQuery.nodeName( elem, "select" ) ) {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type === "select-one";

                        // Nothing was selected
                        if ( index < 0 ) {
                            return null;
                        }

                        // Loop through all the selected options
                        for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
                            var option = options[ i ];

                            // Don't return options that are disabled or in a disabled optgroup
                            if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                                (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

                                // Get the specific value for the option
                                value = jQuery(option).val();

                                // We don't need an array for one selects
                                if ( one ) {
                                    return value;
                                }

                                // Multi-Selects return an array
                                values.push( value );
                            }
                        }

                        return values;
                    }

                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
                        return elem.getAttribute("value") === null ? "on" : elem.value;
                    }

                    // Everything else, we just grab the value
                    return (elem.value || "").replace(rreturn, "");

                }

                return undefined;
            }

            var isFunction = jQuery.isFunction(value);

            return this.each(function(i) {
                var self = jQuery(this), val = value;

                if ( this.nodeType !== 1 ) {
                    return;
                }

                if ( isFunction ) {
                    val = value.call(this, i, self.val());
                }

                // Treat null/undefined as ""; convert numbers to string
                if ( val == null ) {
                    val = "";
                } else if ( typeof val === "number" ) {
                    val += "";
                } else if ( jQuery.isArray(val) ) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
                    this.checked = jQuery.inArray( self.val(), val ) >= 0;

                } else if ( jQuery.nodeName( this, "select" ) ) {
                    var values = jQuery.makeArray(val);

                    jQuery( "option", this ).each(function() {
                        this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                    });

                    if ( !values.length ) {
                        this.selectedIndex = -1;
                    }

                } else {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },

        attr: function( elem, name, value, pass ) {
            // don't get/set attributes on text, comment and attribute nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
                return undefined;
            }

            if ( pass && name in jQuery.attrFn ) {
                return jQuery(elem)[name](value);
            }

            var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
            // Whether we are setting (or getting)
                set = value !== undefined;

            // Try to normalize/fix the name
            name = notxml && jQuery.props[ name ] || name;

            // Only do all the following if this is a node (faster for style)
            if ( elem.nodeType === 1 ) {
                // These attributes require special treatment
                var special = rspecialurl.test( name );

                // Safari mis-reports the default selected property of an option
                // Accessing the parent's selectedIndex property fixes it
                if ( name === "selected" && !jQuery.support.optSelected ) {
                    var parent = elem.parentNode;
                    if ( parent ) {
                        parent.selectedIndex;

                        // Make sure that it also works with optgroups, see #5701
                        if ( parent.parentNode ) {
                            parent.parentNode.selectedIndex;
                        }
                    }
                }

                // If applicable, access the attribute via the DOM 0 way
                // 'in' checks fail in Blackberry 4.7 #6931
                if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
                    if ( set ) {
                        // We can't allow the type property to be changed (since it causes problems in IE)
                        if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
                            jQuery.error( "type property can't be changed" );
                        }

                        if ( value === null ) {
                            if ( elem.nodeType === 1 ) {
                                elem.removeAttribute( name );
                            }

                        } else {
                            elem[ name ] = value;
                        }
                    }

                    // browsers index elements by id/name on forms, give priority to attributes.
                    if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
                        return elem.getAttributeNode( name ).nodeValue;
                    }

                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    if ( name === "tabIndex" ) {
                        var attributeNode = elem.getAttributeNode( "tabIndex" );

                        return attributeNode && attributeNode.specified ?
                            attributeNode.value :
                            rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                                0 :
                                undefined;
                    }

                    return elem[ name ];
                }

                if ( !jQuery.support.style && notxml && name === "style" ) {
                    if ( set ) {
                        elem.style.cssText = "" + value;
                    }

                    return elem.style.cssText;
                }

                if ( set ) {
                    // convert the value to a string (all browsers do this but IE) see #1070
                    elem.setAttribute( name, "" + value );
                }

                // Ensure that missing attributes return undefined
                // Blackberry 4.7 returns "" from getAttribute #6938
                if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
                    return undefined;
                }

                var attr = !jQuery.support.hrefNormalized && notxml && special ?
                    // Some attributes require a special call on IE
                    elem.getAttribute( name, 2 ) :
                    elem.getAttribute( name );

                // Non-existent attributes return null, we normalize to undefined
                return attr === null ? undefined : attr;
            }
            // Handle everything which isn't a DOM element node
            if ( set ) {
                elem[ name ] = value;
            }
            return elem[ name ];
        }
    });




    var rnamespaces = /\.(.*)$/,
        rformElems = /^(?:textarea|input|select)$/i,
        rperiod = /\./g,
        rspace = / /g,
        rescape = /[^\w\s.|`]/g,
        fcleanup = function( nm ) {
            return nm.replace(rescape, "\\$&");
        },
        eventKey = "events";

    /*
     * A number of helper functions used for managing events.
     * Many of the ideas behind this code originated from
     * Dean Edwards' addEvent library.
     */
    jQuery.event = {

        // Bind an event to an element
        // Original by Dean Edwards
        add: function( elem, types, handler, data ) {
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            // For whatever reason, IE has trouble passing the window object
            // around, causing it to be cloned in the process
            if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
                elem = window;
            }

            if ( handler === false ) {
                handler = returnFalse;
            } else if ( !handler ) {
                // Fixes bug #7229. Fix recommended by jdalton
                return;
            }

            var handleObjIn, handleObj;

            if ( handler.handler ) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
            }

            // Make sure that the function being executed has a unique ID
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure
            var elemData = jQuery._data( elem );

            // If no elemData is found then we must be trying to bind to one of the
            // banned noData elements
            if ( !elemData ) {
                return;
            }

            var events = elemData[ eventKey ],
                eventHandle = elemData.handle;

            if ( typeof events === "function" ) {
                // On plain objects events is a fn that holds the the data
                // which prevents this data from being JSON serialized
                // the function does not need to be called, it just contains the data
                eventHandle = events.handle;
                events = events.events;

            } else if ( !events ) {
                if ( !elem.nodeType ) {
                    // On plain objects, create a fn that acts as the holder
                    // of the values to avoid JSON serialization of event data
                    elemData[ eventKey ] = elemData = function(){};
                }

                elemData.events = events = {};
            }

            if ( !eventHandle ) {
                elemData.handle = eventHandle = function() {
                    // Handle the second event of a trigger and when
                    // an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
                        jQuery.event.handle.apply( eventHandle.elem, arguments ) :
                        undefined;
                };
            }

            // Add elem as a property of the handle function
            // This is to prevent a memory leak with non-native events in IE.
            eventHandle.elem = elem;

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            types = types.split(" ");

            var type, i = 0, namespaces;

            while ( (type = types[ i++ ]) ) {
                handleObj = handleObjIn ?
                    jQuery.extend({}, handleObjIn) :
                { handler: handler, data: data };

                // Namespaced event handlers
                if ( type.indexOf(".") > -1 ) {
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    handleObj.namespace = namespaces.slice(0).sort().join(".");

                } else {
                    namespaces = [];
                    handleObj.namespace = "";
                }

                handleObj.type = type;
                if ( !handleObj.guid ) {
                    handleObj.guid = handler.guid;
                }

                // Get the current list of functions bound to this event
                var handlers = events[ type ],
                    special = jQuery.event.special[ type ] || {};

                // Init the event handler queue
                if ( !handlers ) {
                    handlers = events[ type ] = [];

                    // Check for a special event handler
                    // Only use addEventListener/attachEvent if the special
                    // events handler returns false
                    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                        // Bind the global event handler to the element
                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, eventHandle, false );

                        } else if ( elem.attachEvent ) {
                            elem.attachEvent( "on" + type, eventHandle );
                        }
                    }
                }

                if ( special.add ) {
                    special.add.call( elem, handleObj );

                    if ( !handleObj.handler.guid ) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add the function to the element's handler list
                handlers.push( handleObj );

                // Keep track of which events have been used, for global triggering
                jQuery.event.global[ type ] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function( elem, types, handler, pos ) {
            // don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            if ( handler === false ) {
                handler = returnFalse;
            }

            var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
                elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
                events = elemData && elemData[ eventKey ];

            if ( !elemData || !events ) {
                return;
            }

            if ( typeof events === "function" ) {
                elemData = events;
                events = events.events;
            }

            // types is actually an event object here
            if ( types && types.type ) {
                handler = types.handler;
                types = types.type;
            }

            // Unbind all events for the element
            if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
                types = types || "";

                for ( type in events ) {
                    jQuery.event.remove( elem, type + types );
                }

                return;
            }

            // Handle multiple events separated by a space
            // jQuery(...).unbind("mouseover mouseout", fn);
            types = types.split(" ");

            while ( (type = types[ i++ ]) ) {
                origType = type;
                handleObj = null;
                all = type.indexOf(".") < 0;
                namespaces = [];

                if ( !all ) {
                    // Namespaced event handlers
                    namespaces = type.split(".");
                    type = namespaces.shift();

                    namespace = new RegExp("(^|\\.)" +
                        jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
                }

                eventType = events[ type ];

                if ( !eventType ) {
                    continue;
                }

                if ( !handler ) {
                    for ( j = 0; j < eventType.length; j++ ) {
                        handleObj = eventType[ j ];

                        if ( all || namespace.test( handleObj.namespace ) ) {
                            jQuery.event.remove( elem, origType, handleObj.handler, j );
                            eventType.splice( j--, 1 );
                        }
                    }

                    continue;
                }

                special = jQuery.event.special[ type ] || {};

                for ( j = pos || 0; j < eventType.length; j++ ) {
                    handleObj = eventType[ j ];

                    if ( handler.guid === handleObj.guid ) {
                        // remove the given handler for the given type
                        if ( all || namespace.test( handleObj.namespace ) ) {
                            if ( pos == null ) {
                                eventType.splice( j--, 1 );
                            }

                            if ( special.remove ) {
                                special.remove.call( elem, handleObj );
                            }
                        }

                        if ( pos != null ) {
                            break;
                        }
                    }
                }

                // remove generic event handler if no more handlers exist
                if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
                    if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
                        jQuery.removeEvent( elem, type, elemData.handle );
                    }

                    ret = null;
                    delete events[ type ];
                }
            }

            // Remove the expando if it's no longer used
            if ( jQuery.isEmptyObject( events ) ) {
                var handle = elemData.handle;
                if ( handle ) {
                    handle.elem = null;
                }

                delete elemData.events;
                delete elemData.handle;

                if ( typeof elemData === "function" ) {
                    jQuery.removeData( elem, eventKey, true );

                } else if ( jQuery.isEmptyObject( elemData ) ) {
                    jQuery.removeData( elem, undefined, true );
                }
            }
        },

        // bubbling is internal
        trigger: function( event, data, elem /*, bubbling */ ) {
            // Event object or event type
            var type = event.type || event,
                bubbling = arguments[3];

            if ( !bubbling ) {
                event = typeof event === "object" ?
                    // jQuery.Event object
                    event[ jQuery.expando ] ? event :
                        // Object literal
                        jQuery.extend( jQuery.Event(type), event ) :
                    // Just the event type (string)
                    jQuery.Event(type);

                if ( type.indexOf("!") >= 0 ) {
                    event.type = type = type.slice(0, -1);
                    event.exclusive = true;
                }

                // Handle a global trigger
                if ( !elem ) {
                    // Don't bubble custom events when global (to avoid too much overhead)
                    event.stopPropagation();

                    // Only trigger if we've ever bound an event for it
                    if ( jQuery.event.global[ type ] ) {
                        // XXX This code smells terrible. event.js should not be directly
                        // inspecting the data cache
                        jQuery.each( jQuery.cache, function() {
                            // internalKey variable is just used to make it easier to find
                            // and potentially change this stuff later; currently it just
                            // points to jQuery.expando
                            var internalKey = jQuery.expando,
                                internalCache = this[ internalKey ];
                            if ( internalCache && internalCache.events && internalCache.events[type] ) {
                                jQuery.event.trigger( event, data, internalCache.handle.elem );
                            }
                        });
                    }
                }

                // Handle triggering a single element

                // don't do events on text and comment nodes
                if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
                    return undefined;
                }

                // Clean up in case it is reused
                event.result = undefined;
                event.target = elem;

                // Clone the incoming data, if any
                data = jQuery.makeArray( data );
                data.unshift( event );
            }

            event.currentTarget = elem;

            // Trigger the event, it is assumed that "handle" is a function
            var handle = elem.nodeType ?
                jQuery._data( elem, "handle" ) :
                (jQuery._data( elem, eventKey ) || {}).handle;

            if ( handle ) {
                handle.apply( elem, data );
            }

            var parent = elem.parentNode || elem.ownerDocument;

            // Trigger an inline bound script
            try {
                if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
                    if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
                        event.result = false;
                        event.preventDefault();
                    }
                }

                // prevent IE from throwing an error for some elements with some event types, see #3533
            } catch (inlineError) {}

            if ( !event.isPropagationStopped() && parent ) {
                jQuery.event.trigger( event, data, parent, true );

            } else if ( !event.isDefaultPrevented() ) {
                var old,
                    target = event.target,
                    targetType = type.replace( rnamespaces, "" ),
                    isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
                    special = jQuery.event.special[ targetType ] || {};

                if ( (!special._default || special._default.call( elem, event ) === false) &&
                    !isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

                    try {
                        if ( target[ targetType ] ) {
                            // Make sure that we don't accidentally re-trigger the onFOO events
                            old = target[ "on" + targetType ];

                            if ( old ) {
                                target[ "on" + targetType ] = null;
                            }

                            jQuery.event.triggered = true;
                            target[ targetType ]();
                        }

                        // prevent IE from throwing an error for some elements with some event types, see #3533
                    } catch (triggerError) {}

                    if ( old ) {
                        target[ "on" + targetType ] = old;
                    }

                    jQuery.event.triggered = false;
                }
            }
        },

        handle: function( event ) {
            var all, handlers, namespaces, namespace_re, events,
                namespace_sort = [],
                args = jQuery.makeArray( arguments );

            event = args[0] = jQuery.event.fix( event || window.event );
            event.currentTarget = this;

            // Namespaced event handlers
            all = event.type.indexOf(".") < 0 && !event.exclusive;

            if ( !all ) {
                namespaces = event.type.split(".");
                event.type = namespaces.shift();
                namespace_sort = namespaces.slice(0).sort();
                namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
            }

            event.namespace = event.namespace || namespace_sort.join(".");

            events = jQuery._data(this, eventKey);

            if ( typeof events === "function" ) {
                events = events.events;
            }

            handlers = (events || {})[ event.type ];

            if ( events && handlers ) {
                // Clone the handlers to prevent manipulation
                handlers = handlers.slice(0);

                for ( var j = 0, l = handlers.length; j < l; j++ ) {
                    var handleObj = handlers[ j ];

                    // Filter the functions by class
                    if ( all || namespace_re.test( handleObj.namespace ) ) {
                        // Pass in a reference to the handler function itself
                        // So that we can later remove it
                        event.handler = handleObj.handler;
                        event.data = handleObj.data;
                        event.handleObj = handleObj;

                        var ret = handleObj.handler.apply( this, args );

                        if ( ret !== undefined ) {
                            event.result = ret;
                            if ( ret === false ) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }

                        if ( event.isImmediatePropagationStopped() ) {
                            break;
                        }
                    }
                }
            }

            return event.result;
        },

        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

        fix: function( event ) {
            if ( event[ jQuery.expando ] ) {
                return event;
            }

            // store a copy of the original event object
            // and "clone" to set read-only properties
            var originalEvent = event;
            event = jQuery.Event( originalEvent );

            for ( var i = this.props.length, prop; i; ) {
                prop = this.props[ --i ];
                event[ prop ] = originalEvent[ prop ];
            }

            // Fix target property, if necessary
            if ( !event.target ) {
                // Fixes #1925 where srcElement might not be defined either
                event.target = event.srcElement || document;
            }

            // check if target is a textnode (safari)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }

            // Add relatedTarget, if necessary
            if ( !event.relatedTarget && event.fromElement ) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX == null && event.clientX != null ) {
                var doc = document.documentElement,
                    body = document.body;

                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
            }

            // Add which for key events
            if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
                event.which = event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if ( !event.metaKey && event.ctrlKey ) {
                event.metaKey = event.ctrlKey;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !event.which && event.button !== undefined ) {
                event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
            }

            return event;
        },

        // Deprecated, use jQuery.guid instead
        guid: 1E8,

        // Deprecated, use jQuery.proxy instead
        proxy: jQuery.proxy,

        special: {
            ready: {
                // Make sure the ready event is setup
                setup: jQuery.bindReady,
                teardown: jQuery.noop
            },

            live: {
                add: function( handleObj ) {
                    jQuery.event.add( this,
                        liveConvert( handleObj.origType, handleObj.selector ),
                        jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
                },

                remove: function( handleObj ) {
                    jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
                }
            },

            beforeunload: {
                setup: function( data, namespaces, eventHandle ) {
                    // We only want to do this special case on windows
                    if ( jQuery.isWindow( this ) ) {
                        this.onbeforeunload = eventHandle;
                    }
                },

                teardown: function( namespaces, eventHandle ) {
                    if ( this.onbeforeunload === eventHandle ) {
                        this.onbeforeunload = null;
                    }
                }
            }
        }
    };

    jQuery.removeEvent = document.removeEventListener ?
        function( elem, type, handle ) {
            if ( elem.removeEventListener ) {
                elem.removeEventListener( type, handle, false );
            }
        } :
        function( elem, type, handle ) {
            if ( elem.detachEvent ) {
                elem.detachEvent( "on" + type, handle );
            }
        };

    jQuery.Event = function( src ) {
        // Allow instantiation without the 'new' keyword
        if ( !this.preventDefault ) {
            return new jQuery.Event( src );
        }

        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
                src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // timeStamp is buggy for some events on Firefox(#3843)
        // So we won't rely on the native value
        this.timeStamp = jQuery.now();

        // Mark it as fixed
        this[ jQuery.expando ] = true;
    };

    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }

            // if preventDefault exists run it on the original event
            if ( e.preventDefault ) {
                e.preventDefault();

                // otherwise set the returnValue property of the original event to false (IE)
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if ( e.stopPropagation ) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
    var withinElement = function( event ) {
            // Check if mouse(over|out) are still within the same parent element
            var parent = event.relatedTarget;

            // Firefox sometimes assigns relatedTarget a XUL element
            // which we cannot access the parentNode property of
            try {
                // Traverse up the tree
                while ( parent && parent !== this ) {
                    parent = parent.parentNode;
                }

                if ( parent !== this ) {
                    // set the correct event type
                    event.type = event.data;

                    // handle event if we actually just moused on to a non sub-element
                    jQuery.event.handle.apply( this, arguments );
                }

                // assuming we've left the element since we most likely mousedover a xul element
            } catch(e) { }
        },

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
        delegate = function( event ) {
            event.type = event.data;
            jQuery.event.handle.apply( this, arguments );
        };

// Create mouseenter and mouseleave events
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            setup: function( data ) {
                jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
            },
            teardown: function( data ) {
                jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
            }
        };
    });

// submit delegation
    if ( !jQuery.support.submitBubbles ) {

        jQuery.event.special.submit = {
            setup: function( data, namespaces ) {
                if ( this.nodeName && this.nodeName.toLowerCase() !== "form" ) {
                    jQuery.event.add(this, "click.specialSubmit", function( e ) {
                        var elem = e.target,
                            type = elem.type;

                        if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
                            e.liveFired = undefined;
                            return trigger( "submit", this, arguments );
                        }
                    });

                    jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
                        var elem = e.target,
                            type = elem.type;

                        if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
                            e.liveFired = undefined;
                            return trigger( "submit", this, arguments );
                        }
                    });

                } else {
                    return false;
                }
            },

            teardown: function( namespaces ) {
                jQuery.event.remove( this, ".specialSubmit" );
            }
        };

    }

// change delegation, happens here so we have bind.
    if ( !jQuery.support.changeBubbles ) {

        var changeFilters,

            getVal = function( elem ) {
                var type = elem.type, val = elem.value;

                if ( type === "radio" || type === "checkbox" ) {
                    val = elem.checked;

                } else if ( type === "select-multiple" ) {
                    val = elem.selectedIndex > -1 ?
                        jQuery.map( elem.options, function( elem ) {
                            return elem.selected;
                        }).join("-") :
                        "";

                } else if ( elem.nodeName.toLowerCase() === "select" ) {
                    val = elem.selectedIndex;
                }

                return val;
            },

            testChange = function testChange( e ) {
                var elem = e.target, data, val;

                if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
                    return;
                }

                data = jQuery._data( elem, "_change_data" );
                val = getVal(elem);

                // the current data will be also retrieved by beforeactivate
                if ( e.type !== "focusout" || elem.type !== "radio" ) {
                    jQuery._data( elem, "_change_data", val );
                }

                if ( data === undefined || val === data ) {
                    return;
                }

                if ( data != null || val ) {
                    e.type = "change";
                    e.liveFired = undefined;
                    return jQuery.event.trigger( e, arguments[1], elem );
                }
            };

        jQuery.event.special.change = {
            filters: {
                focusout: testChange,

                beforedeactivate: testChange,

                click: function( e ) {
                    var elem = e.target, type = elem.type;

                    if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
                        return testChange.call( this, e );
                    }
                },

                // Change has to be called before submit
                // Keydown will be called before keypress, which is used in submit-event delegation
                keydown: function( e ) {
                    var elem = e.target, type = elem.type;

                    if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
                        (e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
                        type === "select-multiple" ) {
                        return testChange.call( this, e );
                    }
                },

                // Beforeactivate happens also before the previous element is blurred
                // with this event you can't trigger a change event, but you can store
                // information
                beforeactivate: function( e ) {
                    var elem = e.target;
                    jQuery._data( elem, "_change_data", getVal(elem) );
                }
            },

            setup: function( data, namespaces ) {
                if ( this.type === "file" ) {
                    return false;
                }

                for ( var type in changeFilters ) {
                    jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
                }

                return rformElems.test( this.nodeName );
            },

            teardown: function( namespaces ) {
                jQuery.event.remove( this, ".specialChange" );

                return rformElems.test( this.nodeName );
            }
        };

        changeFilters = jQuery.event.special.change.filters;

        // Handle when the input is .focus()'d
        changeFilters.focus = changeFilters.beforeactivate;
    }

    function trigger( type, elem, args ) {
        args[0].type = type;
        return jQuery.event.handle.apply( elem, args );
    }

// Create "bubbling" focus and blur events
    if ( document.addEventListener ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
            jQuery.event.special[ fix ] = {
                setup: function() {
                    this.addEventListener( orig, handler, true );
                },
                teardown: function() {
                    this.removeEventListener( orig, handler, true );
                }
            };

            function handler( e ) {
                e = jQuery.event.fix( e );
                e.type = fix;
                return jQuery.event.handle.call( this, e );
            }
        });
    }

    jQuery.each(["bind", "one"], function( i, name ) {
        jQuery.fn[ name ] = function( type, data, fn ) {
            // Handle object literals
            if ( typeof type === "object" ) {
                for ( var key in type ) {
                    this[ name ](key, data, type[key], fn);
                }
                return this;
            }

            if ( jQuery.isFunction( data ) || data === false ) {
                fn = data;
                data = undefined;
            }

            var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
                jQuery( this ).unbind( event, handler );
                return fn.apply( this, arguments );
            }) : fn;

            if ( type === "unload" && name !== "one" ) {
                this.one( type, data, fn );

            } else {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    jQuery.event.add( this[i], type, handler, data );
                }
            }

            return this;
        };
    });

    jQuery.fn.extend({
        unbind: function( type, fn ) {
            // Handle object literals
            if ( typeof type === "object" && !type.preventDefault ) {
                for ( var key in type ) {
                    this.unbind(key, type[key]);
                }

            } else {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    jQuery.event.remove( this[i], type, fn );
                }
            }

            return this;
        },

        delegate: function( selector, types, data, fn ) {
            return this.live( types, data, fn, selector );
        },

        undelegate: function( selector, types, fn ) {
            if ( arguments.length === 0 ) {
                return this.unbind( "live" );

            } else {
                return this.die( types, null, fn, selector );
            }
        },

        trigger: function( type, data ) {
            return this.each(function() {
                jQuery.event.trigger( type, data, this );
            });
        },

        triggerHandler: function( type, data ) {
            if ( this[0] ) {
                var event = jQuery.Event( type );
                event.preventDefault();
                event.stopPropagation();
                jQuery.event.trigger( event, data, this[0] );
                return event.result;
            }
        },

        toggle: function( fn ) {
            // Save reference to arguments for access in closure
            var args = arguments,
                i = 1;

            // link all the functions, so any of them can unbind this click handler
            while ( i < args.length ) {
                jQuery.proxy( fn, args[ i++ ] );
            }

            return this.click( jQuery.proxy( fn, function( event ) {
                // Figure out which function to execute
                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                // Make sure that clicks stop
                event.preventDefault();

                // and execute the function
                return args[ lastToggle ].apply( this, arguments ) || false;
            }));
        },

        hover: function( fnOver, fnOut ) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        }
    });

    var liveMap = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };

    jQuery.each(["live", "die"], function( i, name ) {
        jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
            var type, i = 0, match, namespaces, preType,
                selector = origSelector || this.selector,
                context = origSelector ? this : jQuery( this.context );

            if ( typeof types === "object" && !types.preventDefault ) {
                for ( var key in types ) {
                    context[ name ]( key, data, types[key], selector );
                }

                return this;
            }

            if ( jQuery.isFunction( data ) ) {
                fn = data;
                data = undefined;
            }

            types = (types || "").split(" ");

            while ( (type = types[ i++ ]) != null ) {
                match = rnamespaces.exec( type );
                namespaces = "";

                if ( match )  {
                    namespaces = match[0];
                    type = type.replace( rnamespaces, "" );
                }

                if ( type === "hover" ) {
                    types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
                    continue;
                }

                preType = type;

                if ( type === "focus" || type === "blur" ) {
                    types.push( liveMap[ type ] + namespaces );
                    type = type + namespaces;

                } else {
                    type = (liveMap[ type ] || type) + namespaces;
                }

                if ( name === "live" ) {
                    // bind live handler
                    for ( var j = 0, l = context.length; j < l; j++ ) {
                        jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
                            { data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
                    }

                } else {
                    // unbind live handler
                    context.unbind( "live." + liveConvert( type, selector ), fn );
                }
            }

            return this;
        };
    });

    function liveHandler( event ) {
        var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
            elems = [],
            selectors = [],
            events = jQuery._data( this, eventKey );

        if ( typeof events === "function" ) {
            events = events.events;
        }

        // Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
        if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
            return;
        }

        if ( event.namespace ) {
            namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
        }

        event.liveFired = this;

        var live = events.live.slice(0);

        for ( j = 0; j < live.length; j++ ) {
            handleObj = live[j];

            if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
                selectors.push( handleObj.selector );

            } else {
                live.splice( j--, 1 );
            }
        }

        match = jQuery( event.target ).closest( selectors, event.currentTarget );

        for ( i = 0, l = match.length; i < l; i++ ) {
            close = match[i];

            for ( j = 0; j < live.length; j++ ) {
                handleObj = live[j];

                if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) ) {
                    elem = close.elem;
                    related = null;

                    // Those two events require additional checking
                    if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
                        event.type = handleObj.preType;
                        related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
                    }

                    if ( !related || related !== elem ) {
                        elems.push({ elem: elem, handleObj: handleObj, level: close.level });
                    }
                }
            }
        }

        for ( i = 0, l = elems.length; i < l; i++ ) {
            match = elems[i];

            if ( maxLevel && match.level > maxLevel ) {
                break;
            }

            event.currentTarget = match.elem;
            event.data = match.handleObj.data;
            event.handleObj = match.handleObj;

            ret = match.handleObj.origHandler.apply( match.elem, arguments );

            if ( ret === false || event.isPropagationStopped() ) {
                maxLevel = match.level;

                if ( ret === false ) {
                    stop = false;
                }
                if ( event.isImmediatePropagationStopped() ) {
                    break;
                }
            }
        }

        return stop;
    }

    function liveConvert( type, selector ) {
        return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
    }

    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
            if ( fn == null ) {
                fn = data;
                data = null;
            }

            return arguments.length > 0 ?
                this.bind( name, data, fn ) :
                this.trigger( name );
        };

        if ( jQuery.attrFn ) {
            jQuery.attrFn[ name ] = true;
        }
    });


    /*!
     * Sizzle CSS Selector Engine
     *  Copyright 2011, The Dojo Foundation
     *  Released under the MIT, BSD, and GPL Licenses.
     *  More information: http://sizzlejs.com/
     */
    (function(){

        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            done = 0,
            toString = Object.prototype.toString,
            hasDuplicate = false,
            baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
        [0, 0].sort(function() {
            baseHasDuplicate = false;
            return 0;
        });

        var Sizzle = function( selector, context, results, seed ) {
            results = results || [];
            context = context || document;

            var origContext = context;

            if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
                return [];
            }

            if ( !selector || typeof selector !== "string" ) {
                return results;
            }

            var m, set, checkSet, extra, ret, cur, pop, i,
                prune = true,
                contextXML = Sizzle.isXML( context ),
                parts = [],
                soFar = selector;

            // Reset the position of the chunker regexp (start from head)
            do {
                chunker.exec( "" );
                m = chunker.exec( soFar );

                if ( m ) {
                    soFar = m[3];

                    parts.push( m[1] );

                    if ( m[2] ) {
                        extra = m[3];
                        break;
                    }
                }
            } while ( m );

            if ( parts.length > 1 && origPOS.exec( selector ) ) {

                if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
                    set = posProcess( parts[0] + parts[1], context );

                } else {
                    set = Expr.relative[ parts[0] ] ?
                        [ context ] :
                        Sizzle( parts.shift(), context );

                    while ( parts.length ) {
                        selector = parts.shift();

                        if ( Expr.relative[ selector ] ) {
                            selector += parts.shift();
                        }

                        set = posProcess( selector, set );
                    }
                }

            } else {
                // Take a shortcut and set the context if the root selector is an ID
                // (but not if it'll be faster if the inner selector is an ID)
                if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                    Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

                    ret = Sizzle.find( parts.shift(), context, contextXML );
                    context = ret.expr ?
                        Sizzle.filter( ret.expr, ret.set )[0] :
                        ret.set[0];
                }

                if ( context ) {
                    ret = seed ?
                    { expr: parts.pop(), set: makeArray(seed) } :
                        Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

                    set = ret.expr ?
                        Sizzle.filter( ret.expr, ret.set ) :
                        ret.set;

                    if ( parts.length > 0 ) {
                        checkSet = makeArray( set );

                    } else {
                        prune = false;
                    }

                    while ( parts.length ) {
                        cur = parts.pop();
                        pop = cur;

                        if ( !Expr.relative[ cur ] ) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }

                        if ( pop == null ) {
                            pop = context;
                        }

                        Expr.relative[ cur ]( checkSet, pop, contextXML );
                    }

                } else {
                    checkSet = parts = [];
                }
            }

            if ( !checkSet ) {
                checkSet = set;
            }

            if ( !checkSet ) {
                Sizzle.error( cur || selector );
            }

            if ( toString.call(checkSet) === "[object Array]" ) {
                if ( !prune ) {
                    results.push.apply( results, checkSet );

                } else if ( context && context.nodeType === 1 ) {
                    for ( i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
                            results.push( set[i] );
                        }
                    }

                } else {
                    for ( i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                            results.push( set[i] );
                        }
                    }
                }

            } else {
                makeArray( checkSet, results );
            }

            if ( extra ) {
                Sizzle( extra, origContext, results, seed );
                Sizzle.uniqueSort( results );
            }

            return results;
        };

        Sizzle.uniqueSort = function( results ) {
            if ( sortOrder ) {
                hasDuplicate = baseHasDuplicate;
                results.sort( sortOrder );

                if ( hasDuplicate ) {
                    for ( var i = 1; i < results.length; i++ ) {
                        if ( results[i] === results[ i - 1 ] ) {
                            results.splice( i--, 1 );
                        }
                    }
                }
            }

            return results;
        };

        Sizzle.matches = function( expr, set ) {
            return Sizzle( expr, null, null, set );
        };

        Sizzle.matchesSelector = function( node, expr ) {
            return Sizzle( expr, null, null, [node] ).length > 0;
        };

        Sizzle.find = function( expr, context, isXML ) {
            var set;

            if ( !expr ) {
                return [];
            }

            for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
                var match,
                    type = Expr.order[i];

                if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
                    var left = match[1];
                    match.splice( 1, 1 );

                    if ( left.substr( left.length - 1 ) !== "\\" ) {
                        match[1] = (match[1] || "").replace(/\\/g, "");
                        set = Expr.find[ type ]( match, context, isXML );

                        if ( set != null ) {
                            expr = expr.replace( Expr.match[ type ], "" );
                            break;
                        }
                    }
                }
            }

            if ( !set ) {
                set = typeof context.getElementsByTagName !== "undefined" ?
                    context.getElementsByTagName( "*" ) :
                    [];
            }

            return { set: set, expr: expr };
        };

        Sizzle.filter = function( expr, set, inplace, not ) {
            var match, anyFound,
                old = expr,
                result = [],
                curLoop = set,
                isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

            while ( expr && set.length ) {
                for ( var type in Expr.filter ) {
                    if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                        var found, item,
                            filter = Expr.filter[ type ],
                            left = match[1];

                        anyFound = false;

                        match.splice(1,1);

                        if ( left.substr( left.length - 1 ) === "\\" ) {
                            continue;
                        }

                        if ( curLoop === result ) {
                            result = [];
                        }

                        if ( Expr.preFilter[ type ] ) {
                            match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                            if ( !match ) {
                                anyFound = found = true;

                            } else if ( match === true ) {
                                continue;
                            }
                        }

                        if ( match ) {
                            for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
                                if ( item ) {
                                    found = filter( item, match, i, curLoop );
                                    var pass = not ^ !!found;

                                    if ( inplace && found != null ) {
                                        if ( pass ) {
                                            anyFound = true;

                                        } else {
                                            curLoop[i] = false;
                                        }

                                    } else if ( pass ) {
                                        result.push( item );
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if ( found !== undefined ) {
                            if ( !inplace ) {
                                curLoop = result;
                            }

                            expr = expr.replace( Expr.match[ type ], "" );

                            if ( !anyFound ) {
                                return [];
                            }

                            break;
                        }
                    }
                }

                // Improper expression
                if ( expr === old ) {
                    if ( anyFound == null ) {
                        Sizzle.error( expr );

                    } else {
                        break;
                    }
                }

                old = expr;
            }

            return curLoop;
        };

        Sizzle.error = function( msg ) {
            throw "Syntax error, unrecognized expression: " + msg;
        };

        var Expr = Sizzle.selectors = {
            order: [ "ID", "NAME", "TAG" ],

            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },

            leftMatch: {},

            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },

            attrHandle: {
                href: function( elem ) {
                    return elem.getAttribute( "href" );
                }
            },

            relative: {
                "+": function(checkSet, part){
                    var isPartStr = typeof part === "string",
                        isTag = isPartStr && !/\W/.test( part ),
                        isPartStrNotTag = isPartStr && !isTag;

                    if ( isTag ) {
                        part = part.toLowerCase();
                    }

                    for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                        if ( (elem = checkSet[i]) ) {
                            while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                                elem || false :
                                elem === part;
                        }
                    }

                    if ( isPartStrNotTag ) {
                        Sizzle.filter( part, checkSet, true );
                    }
                },

                ">": function( checkSet, part ) {
                    var elem,
                        isPartStr = typeof part === "string",
                        i = 0,
                        l = checkSet.length;

                    if ( isPartStr && !/\W/.test( part ) ) {
                        part = part.toLowerCase();

                        for ( ; i < l; i++ ) {
                            elem = checkSet[i];

                            if ( elem ) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }

                    } else {
                        for ( ; i < l; i++ ) {
                            elem = checkSet[i];

                            if ( elem ) {
                                checkSet[i] = isPartStr ?
                                    elem.parentNode :
                                    elem.parentNode === part;
                            }
                        }

                        if ( isPartStr ) {
                            Sizzle.filter( part, checkSet, true );
                        }
                    }
                },

                "": function(checkSet, part, isXML){
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if ( typeof part === "string" && !/\W/.test(part) ) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
                },

                "~": function( checkSet, part, isXML ) {
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if ( typeof part === "string" && !/\W/.test( part ) ) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
                }
            },

            find: {
                ID: function( match, context, isXML ) {
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                },

                NAME: function( match, context ) {
                    if ( typeof context.getElementsByName !== "undefined" ) {
                        var ret = [],
                            results = context.getElementsByName( match[1] );

                        for ( var i = 0, l = results.length; i < l; i++ ) {
                            if ( results[i].getAttribute("name") === match[1] ) {
                                ret.push( results[i] );
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },

                TAG: function( match, context ) {
                    if ( typeof context.getElementsByTagName !== "undefined" ) {
                        return context.getElementsByTagName( match[1] );
                    }
                }
            },
            preFilter: {
                CLASS: function( match, curLoop, inplace, result, not, isXML ) {
                    match = " " + match[1].replace(/\\/g, "") + " ";

                    if ( isXML ) {
                        return match;
                    }

                    for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                        if ( elem ) {
                            if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
                                if ( !inplace ) {
                                    result.push( elem );
                                }

                            } else if ( inplace ) {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },

                ID: function( match ) {
                    return match[1].replace(/\\/g, "");
                },

                TAG: function( match, curLoop ) {
                    return match[1].toLowerCase();
                },

                CHILD: function( match ) {
                    if ( match[1] === "nth" ) {
                        if ( !match[2] ) {
                            Sizzle.error( match[0] );
                        }

                        match[2] = match[2].replace(/^\+|\s*/g, '');

                        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                            match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                                !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                        // calculate the numbers (first)n+(last) including if they are negative
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    }
                    else if ( match[2] ) {
                        Sizzle.error( match[0] );
                    }

                    // TODO: Move to normal caching system
                    match[0] = done++;

                    return match;
                },

                ATTR: function( match, curLoop, inplace, result, not, isXML ) {
                    var name = match[1] = match[1].replace(/\\/g, "");

                    if ( !isXML && Expr.attrMap[name] ) {
                        match[1] = Expr.attrMap[name];
                    }

                    // Handle if an un-quoted value was used
                    match[4] = ( match[4] || match[5] || "" ).replace(/\\/g, "");

                    if ( match[2] === "~=" ) {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },

                PSEUDO: function( match, curLoop, inplace, result, not ) {
                    if ( match[1] === "not" ) {
                        // If we're dealing with a complex expression, or a simple one
                        if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                            match[3] = Sizzle(match[3], null, null, curLoop);

                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                            if ( !inplace ) {
                                result.push.apply( result, ret );
                            }

                            return false;
                        }

                    } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                        return true;
                    }

                    return match;
                },

                POS: function( match ) {
                    match.unshift( true );

                    return match;
                }
            },

            filters: {
                enabled: function( elem ) {
                    return elem.disabled === false && elem.type !== "hidden";
                },

                disabled: function( elem ) {
                    return elem.disabled === true;
                },

                checked: function( elem ) {
                    return elem.checked === true;
                },

                selected: function( elem ) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    elem.parentNode.selectedIndex;

                    return elem.selected === true;
                },

                parent: function( elem ) {
                    return !!elem.firstChild;
                },

                empty: function( elem ) {
                    return !elem.firstChild;
                },

                has: function( elem, i, match ) {
                    return !!Sizzle( match[3], elem ).length;
                },

                header: function( elem ) {
                    return (/h\d/i).test( elem.nodeName );
                },

                text: function( elem ) {
                    return "text" === elem.type;
                },
                radio: function( elem ) {
                    return "radio" === elem.type;
                },

                checkbox: function( elem ) {
                    return "checkbox" === elem.type;
                },

                file: function( elem ) {
                    return "file" === elem.type;
                },
                password: function( elem ) {
                    return "password" === elem.type;
                },

                submit: function( elem ) {
                    return "submit" === elem.type;
                },

                image: function( elem ) {
                    return "image" === elem.type;
                },

                reset: function( elem ) {
                    return "reset" === elem.type;
                },

                button: function( elem ) {
                    return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
                },

                input: function( elem ) {
                    return (/input|select|textarea|button/i).test( elem.nodeName );
                }
            },
            setFilters: {
                first: function( elem, i ) {
                    return i === 0;
                },

                last: function( elem, i, match, array ) {
                    return i === array.length - 1;
                },

                even: function( elem, i ) {
                    return i % 2 === 0;
                },

                odd: function( elem, i ) {
                    return i % 2 === 1;
                },

                lt: function( elem, i, match ) {
                    return i < match[3] - 0;
                },

                gt: function( elem, i, match ) {
                    return i > match[3] - 0;
                },

                nth: function( elem, i, match ) {
                    return match[3] - 0 === i;
                },

                eq: function( elem, i, match ) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function( elem, match, i, array ) {
                    var name = match[1],
                        filter = Expr.filters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );

                    } else if ( name === "contains" ) {
                        return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

                    } else if ( name === "not" ) {
                        var not = match[3];

                        for ( var j = 0, l = not.length; j < l; j++ ) {
                            if ( not[j] === elem ) {
                                return false;
                            }
                        }

                        return true;

                    } else {
                        Sizzle.error( name );
                    }
                },

                CHILD: function( elem, match ) {
                    var type = match[1],
                        node = elem;

                    switch ( type ) {
                        case "only":
                        case "first":
                            while ( (node = node.previousSibling) )	 {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }

                            if ( type === "first" ) {
                                return true;
                            }

                            node = elem;

                        case "last":
                            while ( (node = node.nextSibling) )	 {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }

                            return true;

                        case "nth":
                            var first = match[2],
                                last = match[3];

                            if ( first === 1 && last === 0 ) {
                                return true;
                            }

                            var doneName = match[0],
                                parent = elem.parentNode;

                            if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
                                var count = 0;

                                for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                    if ( node.nodeType === 1 ) {
                                        node.nodeIndex = ++count;
                                    }
                                }

                                parent.sizcache = doneName;
                            }

                            var diff = elem.nodeIndex - last;

                            if ( first === 0 ) {
                                return diff === 0;

                            } else {
                                return ( diff % first === 0 && diff / first >= 0 );
                            }
                    }
                },

                ID: function( elem, match ) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },

                TAG: function( elem, match ) {
                    return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
                },

                CLASS: function( elem, match ) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ")
                        .indexOf( match ) > -1;
                },

                ATTR: function( elem, match ) {
                    var name = match[1],
                        result = Expr.attrHandle[ name ] ?
                            Expr.attrHandle[ name ]( elem ) :
                            elem[ name ] != null ?
                                elem[ name ] :
                                elem.getAttribute( name ),
                        value = result + "",
                        type = match[2],
                        check = match[4];

                    return result == null ?
                        type === "!=" :
                        type === "=" ?
                            value === check :
                            type === "*=" ?
                                value.indexOf(check) >= 0 :
                                type === "~=" ?
                                    (" " + value + " ").indexOf(check) >= 0 :
                                    !check ?
                                        value && result !== false :
                                        type === "!=" ?
                                            value !== check :
                                            type === "^=" ?
                                                value.indexOf(check) === 0 :
                                                type === "$=" ?
                                                    value.substr(value.length - check.length) === check :
                                                    type === "|=" ?
                                                        value === check || value.substr(0, check.length + 1) === check + "-" :
                                                        false;
                },

                POS: function( elem, match, i, array ) {
                    var name = match[2],
                        filter = Expr.setFilters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );
                    }
                }
            }
        };

        var origPOS = Expr.match.POS,
            fescape = function(all, num){
                return "\\" + (num - 0 + 1);
            };

        for ( var type in Expr.match ) {
            Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
            Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
        }

        var makeArray = function( array, results ) {
            array = Array.prototype.slice.call( array, 0 );

            if ( results ) {
                results.push.apply( results, array );
                return results;
            }

            return array;
        };

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
        try {
            Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
        } catch( e ) {
            makeArray = function( array, results ) {
                var i = 0,
                    ret = results || [];

                if ( toString.call(array) === "[object Array]" ) {
                    Array.prototype.push.apply( ret, array );

                } else {
                    if ( typeof array.length === "number" ) {
                        for ( var l = array.length; i < l; i++ ) {
                            ret.push( array[i] );
                        }

                    } else {
                        for ( ; array[i]; i++ ) {
                            ret.push( array[i] );
                        }
                    }
                }

                return ret;
            };
        }

        var sortOrder, siblingCheck;

        if ( document.documentElement.compareDocumentPosition ) {
            sortOrder = function( a, b ) {
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;
                }

                if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
                    return a.compareDocumentPosition ? -1 : 1;
                }

                return a.compareDocumentPosition(b) & 4 ? -1 : 1;
            };

        } else {
            sortOrder = function( a, b ) {
                var al, bl,
                    ap = [],
                    bp = [],
                    aup = a.parentNode,
                    bup = b.parentNode,
                    cur = aup;

                // The nodes are identical, we can exit early
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;

                    // If the nodes are siblings (or identical) we can do a quick check
                } else if ( aup === bup ) {
                    return siblingCheck( a, b );

                    // If no parents were found then the nodes are disconnected
                } else if ( !aup ) {
                    return -1;

                } else if ( !bup ) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while ( cur ) {
                    ap.unshift( cur );
                    cur = cur.parentNode;
                }

                cur = bup;

                while ( cur ) {
                    bp.unshift( cur );
                    cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for ( var i = 0; i < al && i < bl; i++ ) {
                    if ( ap[i] !== bp[i] ) {
                        return siblingCheck( ap[i], bp[i] );
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
                    siblingCheck( a, bp[i], -1 ) :
                    siblingCheck( ap[i], b, 1 );
            };

            siblingCheck = function( a, b, ret ) {
                if ( a === b ) {
                    return ret;
                }

                var cur = a.nextSibling;

                while ( cur ) {
                    if ( cur === b ) {
                        return -1;
                    }

                    cur = cur.nextSibling;
                }

                return 1;
            };
        }

// Utility function for retreiving the text value of an array of DOM nodes
        Sizzle.getText = function( elems ) {
            var ret = "", elem;

            for ( var i = 0; elems[i]; i++ ) {
                elem = elems[i];

                // Get the text from text nodes and CDATA nodes
                if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
                    ret += elem.nodeValue;

                    // Traverse everything else, except comment nodes
                } else if ( elem.nodeType !== 8 ) {
                    ret += Sizzle.getText( elem.childNodes );
                }
            }

            return ret;
        };

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
        (function(){
            // We're going to inject a fake input element with a specified name
            var form = document.createElement("div"),
                id = "script" + (new Date()).getTime(),
                root = document.documentElement;

            form.innerHTML = "<a name='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            root.insertBefore( form, root.firstChild );

            // The workaround has to do additional checks after a getElementById
            // Which slows things down for other browsers (hence the branching)
            if ( document.getElementById( id ) ) {
                Expr.find.ID = function( match, context, isXML ) {
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);

                        return m ?
                            m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
                                [m] :
                                undefined :
                            [];
                    }
                };

                Expr.filter.ID = function( elem, match ) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            root.removeChild( form );

            // release memory in IE
            root = form = null;
        })();

        (function(){
            // Check to see if the browser returns only elements
            // when doing getElementsByTagName("*")

            // Create a fake element
            var div = document.createElement("div");
            div.appendChild( document.createComment("") );

            // Make sure no comments are found
            if ( div.getElementsByTagName("*").length > 0 ) {
                Expr.find.TAG = function( match, context ) {
                    var results = context.getElementsByTagName( match[1] );

                    // Filter out possible comments
                    if ( match[1] === "*" ) {
                        var tmp = [];

                        for ( var i = 0; results[i]; i++ ) {
                            if ( results[i].nodeType === 1 ) {
                                tmp.push( results[i] );
                            }
                        }

                        results = tmp;
                    }

                    return results;
                };
            }

            // Check to see if an attribute returns normalized href attributes
            div.innerHTML = "<a href='#'></a>";

            if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
                div.firstChild.getAttribute("href") !== "#" ) {

                Expr.attrHandle.href = function( elem ) {
                    return elem.getAttribute( "href", 2 );
                };
            }

            // release memory in IE
            div = null;
        })();

        if ( document.querySelectorAll ) {
            (function(){
                var oldSizzle = Sizzle,
                    div = document.createElement("div"),
                    id = "__sizzle__";

                div.innerHTML = "<p class='TEST'></p>";

                // Safari can't handle uppercase or unicode characters when
                // in quirks mode.
                if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
                    return;
                }

                Sizzle = function( query, context, extra, seed ) {
                    context = context || document;

                    // Only use querySelectorAll on non-XML documents
                    // (ID selectors don't work in non-HTML documents)
                    if ( !seed && !Sizzle.isXML(context) ) {
                        // See if we find a selector to speed up
                        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

                        if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
                            // Speed-up: Sizzle("TAG")
                            if ( match[1] ) {
                                return makeArray( context.getElementsByTagName( query ), extra );

                                // Speed-up: Sizzle(".CLASS")
                            } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
                                return makeArray( context.getElementsByClassName( match[2] ), extra );
                            }
                        }

                        if ( context.nodeType === 9 ) {
                            // Speed-up: Sizzle("body")
                            // The body element only exists once, optimize finding it
                            if ( query === "body" && context.body ) {
                                return makeArray( [ context.body ], extra );

                                // Speed-up: Sizzle("#ID")
                            } else if ( match && match[3] ) {
                                var elem = context.getElementById( match[3] );

                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document #6963
                                if ( elem && elem.parentNode ) {
                                    // Handle the case where IE and Opera return items
                                    // by name instead of ID
                                    if ( elem.id === match[3] ) {
                                        return makeArray( [ elem ], extra );
                                    }

                                } else {
                                    return makeArray( [], extra );
                                }
                            }

                            try {
                                return makeArray( context.querySelectorAll(query), extra );
                            } catch(qsaError) {}

                            // qSA works strangely on Element-rooted queries
                            // We can work around this by specifying an extra ID on the root
                            // and working up from there (Thanks to Andrew Dupont for the technique)
                            // IE 8 doesn't work on object elements
                        } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                            var old = context.getAttribute( "id" ),
                                nid = old || id,
                                hasParent = context.parentNode,
                                relativeHierarchySelector = /^\s*[+~]/.test( query );

                            if ( !old ) {
                                context.setAttribute( "id", nid );
                            } else {
                                nid = nid.replace( /'/g, "\\$&" );
                            }
                            if ( relativeHierarchySelector && hasParent ) {
                                context = context.parentNode;
                            }

                            try {
                                if ( !relativeHierarchySelector || hasParent ) {
                                    return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
                                }

                            } catch(pseudoError) {
                            } finally {
                                if ( !old ) {
                                    context.removeAttribute( "id" );
                                }
                            }
                        }
                    }

                    return oldSizzle(query, context, extra, seed);
                };

                for ( var prop in oldSizzle ) {
                    Sizzle[ prop ] = oldSizzle[ prop ];
                }

                // release memory in IE
                div = null;
            })();
        }

        (function(){
            var html = document.documentElement,
                matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
                pseudoWorks = false;

            try {
                // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call( document.documentElement, "[test!='']:sizzle" );

            } catch( pseudoError ) {
                pseudoWorks = true;
            }

            if ( matches ) {
                Sizzle.matchesSelector = function( node, expr ) {
                    // Make sure that attribute selectors are quoted
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    if ( !Sizzle.isXML( node ) ) {
                        try {
                            if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
                                return matches.call( node, expr );
                            }
                        } catch(e) {}
                    }

                    return Sizzle(expr, null, null, [node]).length > 0;
                };
            }
        })();

        (function(){
            var div = document.createElement("div");

            div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            // Opera can't find a second classname (in 9.6)
            // Also, make sure that getElementsByClassName actually exists
            if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
                return;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";

            if ( div.getElementsByClassName("e").length === 1 ) {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function( match, context, isXML ) {
                if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
                    return context.getElementsByClassName(match[1]);
                }
            };

            // release memory in IE
            div = null;
        })();

        function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];

                if ( elem ) {
                    var match = false;

                    elem = elem[dir];

                    while ( elem ) {
                        if ( elem.sizcache === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 && !isXML ){
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }

                        if ( elem.nodeName.toLowerCase() === cur ) {
                            match = elem;
                            break;
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];

                if ( elem ) {
                    var match = false;

                    elem = elem[dir];

                    while ( elem ) {
                        if ( elem.sizcache === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 ) {
                            if ( !isXML ) {
                                elem.sizcache = doneName;
                                elem.sizset = i;
                            }

                            if ( typeof cur !== "string" ) {
                                if ( elem === cur ) {
                                    match = true;
                                    break;
                                }

                            } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                                match = elem;
                                break;
                            }
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        if ( document.documentElement.contains ) {
            Sizzle.contains = function( a, b ) {
                return a !== b && (a.contains ? a.contains(b) : true);
            };

        } else if ( document.documentElement.compareDocumentPosition ) {
            Sizzle.contains = function( a, b ) {
                return !!(a.compareDocumentPosition(b) & 16);
            };

        } else {
            Sizzle.contains = function() {
                return false;
            };
        }

        Sizzle.isXML = function( elem ) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833) 
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        var posProcess = function( selector, context ) {
            var match,
                tmpSet = [],
                later = "",
                root = context.nodeType ? [context] : context;

            // Position selectors must be done after the filter
            // And so must :not(positional) so we move all PSEUDOs to the end
            while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
                later += match[0];
                selector = selector.replace( Expr.match.PSEUDO, "" );
            }

            selector = Expr.relative[selector] ? selector + "*" : selector;

            for ( var i = 0, l = root.length; i < l; i++ ) {
                Sizzle( selector, root[i], tmpSet );
            }

            return Sizzle.filter( later, tmpSet );
        };

// EXPOSE
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })();


    var runtil = /Until$/,
        rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
        rmultiselector = /,/,
        isSimple = /^.[^:#\[\.,]*$/,
        slice = Array.prototype.slice,
        POS = jQuery.expr.match.POS,
    // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.fn.extend({
        find: function( selector ) {
            var ret = this.pushStack( "", "find", selector ),
                length = 0;

            for ( var i = 0, l = this.length; i < l; i++ ) {
                length = ret.length;
                jQuery.find( selector, this[i], ret );

                if ( i > 0 ) {
                    // Make sure that the results are unique
                    for ( var n = length; n < ret.length; n++ ) {
                        for ( var r = 0; r < length; r++ ) {
                            if ( ret[r] === ret[n] ) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        has: function( target ) {
            var targets = jQuery( target );
            return this.filter(function() {
                for ( var i = 0, l = targets.length; i < l; i++ ) {
                    if ( jQuery.contains( this, targets[i] ) ) {
                        return true;
                    }
                }
            });
        },

        not: function( selector ) {
            return this.pushStack( winnow(this, selector, false), "not", selector);
        },

        filter: function( selector ) {
            return this.pushStack( winnow(this, selector, true), "filter", selector );
        },

        is: function( selector ) {
            return !!selector && jQuery.filter( selector, this ).length > 0;
        },

        closest: function( selectors, context ) {
            var ret = [], i, l, cur = this[0];

            if ( jQuery.isArray( selectors ) ) {
                var match, selector,
                    matches = {},
                    level = 1;

                if ( cur && selectors.length ) {
                    for ( i = 0, l = selectors.length; i < l; i++ ) {
                        selector = selectors[i];

                        if ( !matches[selector] ) {
                            matches[selector] = jQuery.expr.match.POS.test( selector ) ?
                                jQuery( selector, context || this.context ) :
                                selector;
                        }
                    }

                    while ( cur && cur.ownerDocument && cur !== context ) {
                        for ( selector in matches ) {
                            match = matches[selector];

                            if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
                                ret.push({ selector: selector, elem: cur, level: level });
                            }
                        }

                        cur = cur.parentNode;
                        level++;
                    }
                }

                return ret;
            }

            var pos = POS.test( selectors ) ?
                jQuery( selectors, context || this.context ) : null;

            for ( i = 0, l = this.length; i < l; i++ ) {
                cur = this[i];

                while ( cur ) {
                    if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                        ret.push( cur );
                        break;

                    } else {
                        cur = cur.parentNode;
                        if ( !cur || !cur.ownerDocument || cur === context ) {
                            break;
                        }
                    }
                }
            }

            ret = ret.length > 1 ? jQuery.unique(ret) : ret;

            return this.pushStack( ret, "closest", selectors );
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {
            if ( !elem || typeof elem === "string" ) {
                return jQuery.inArray( this[0],
                    // If it receives a string, the selector is used
                    // If it receives nothing, the siblings are used
                    elem ? jQuery( elem ) : this.parent().children() );
            }
            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this );
        },

        add: function( selector, context ) {
            var set = typeof selector === "string" ?
                    jQuery( selector, context ) :
                    jQuery.makeArray( selector ),
                all = jQuery.merge( this.get(), set );

            return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
                all :
                jQuery.unique( all ) );
        },

        andSelf: function() {
            return this.add( this.prevObject );
        }
    });

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
    function isDisconnected( node ) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    jQuery.each({
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
            return jQuery.dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "parentNode", until );
        },
        next: function( elem ) {
            return jQuery.nth( elem, 2, "nextSibling" );
        },
        prev: function( elem ) {
            return jQuery.nth( elem, 2, "previousSibling" );
        },
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
            return jQuery.sibling( elem.parentNode.firstChild, elem );
        },
        children: function( elem ) {
            return jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.makeArray( elem.childNodes );
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
            var ret = jQuery.map( this, fn, until ),
            // The variable 'args' was introduced in
            // https://github.com/jquery/jquery/commit/52a0238
            // to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
            // http://code.google.com/p/v8/issues/detail?id=1050
                args = slice.call(arguments);

            if ( !runtil.test( name ) ) {
                selector = until;
            }

            if ( selector && typeof selector === "string" ) {
                ret = jQuery.filter( selector, ret );
            }

            ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

            if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
                ret = ret.reverse();
            }

            return this.pushStack( ret, name, args.join(",") );
        };
    });

    jQuery.extend({
        filter: function( expr, elems, not ) {
            if ( not ) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
                jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
                jQuery.find.matches(expr, elems);
        },

        dir: function( elem, dir, until ) {
            var matched = [],
                cur = elem[ dir ];

            while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
                if ( cur.nodeType === 1 ) {
                    matched.push( cur );
                }
                cur = cur[dir];
            }
            return matched;
        },

        nth: function( cur, result, dir, elem ) {
            result = result || 1;
            var num = 0;

            for ( ; cur; cur = cur[dir] ) {
                if ( cur.nodeType === 1 && ++num === result ) {
                    break;
                }
            }

            return cur;
        },

        sibling: function( n, elem ) {
            var r = [];

            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    r.push( n );
                }
            }

            return r;
        }
    });

// Implement the identical functionality for filter and not
    function winnow( elements, qualifier, keep ) {
        if ( jQuery.isFunction( qualifier ) ) {
            return jQuery.grep(elements, function( elem, i ) {
                var retVal = !!qualifier.call( elem, i, elem );
                return retVal === keep;
            });

        } else if ( qualifier.nodeType ) {
            return jQuery.grep(elements, function( elem, i ) {
                return (elem === qualifier) === keep;
            });

        } else if ( typeof qualifier === "string" ) {
            var filtered = jQuery.grep(elements, function( elem ) {
                return elem.nodeType === 1;
            });

            if ( isSimple.test( qualifier ) ) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter( qualifier, filtered );
            }
        }

        return jQuery.grep(elements, function( elem, i ) {
            return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
        });
    }




    var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnocache = /<(?:script|object|embed|option|style)/i,
    // checked="checked" or checked (html5)
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            area: [ 1, "<map>", "</map>" ],
            _default: [ 0, "", "" ]
        };

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
    if ( !jQuery.support.htmlSerialize ) {
        wrapMap._default = [ 1, "div<div>", "</div>" ];
    }

    jQuery.fn.extend({
        text: function( text ) {
            if ( jQuery.isFunction(text) ) {
                return this.each(function(i) {
                    var self = jQuery( this );

                    self.text( text.call(this, i, self.text()) );
                });
            }

            if ( typeof text !== "object" && text !== undefined ) {
                return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
            }

            return jQuery.text( this );
        },

        wrapAll: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapAll( html.call(this, i) );
                });
            }

            if ( this[0] ) {
                // The elements to wrap the target around
                var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

                if ( this[0].parentNode ) {
                    wrap.insertBefore( this[0] );
                }

                wrap.map(function() {
                    var elem = this;

                    while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapInner( html.call(this, i) );
                });
            }

            return this.each(function() {
                var self = jQuery( this ),
                    contents = self.contents();

                if ( contents.length ) {
                    contents.wrapAll( html );

                } else {
                    self.append( html );
                }
            });
        },

        wrap: function( html ) {
            return this.each(function() {
                jQuery( this ).wrapAll( html );
            });
        },

        unwrap: function() {
            return this.parent().each(function() {
                if ( !jQuery.nodeName( this, "body" ) ) {
                    jQuery( this ).replaceWith( this.childNodes );
                }
            }).end();
        },

        append: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 ) {
                    this.appendChild( elem );
                }
            });
        },

        prepend: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 ) {
                    this.insertBefore( elem, this.firstChild );
                }
            });
        },

        before: function() {
            if ( this[0] && this[0].parentNode ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this );
                });
            } else if ( arguments.length ) {
                var set = jQuery(arguments[0]);
                set.push.apply( set, this.toArray() );
                return this.pushStack( set, "before", arguments );
            }
        },

        after: function() {
            if ( this[0] && this[0].parentNode ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                });
            } else if ( arguments.length ) {
                var set = this.pushStack( this, "after", arguments );
                set.push.apply( set, jQuery(arguments[0]).toArray() );
                return set;
            }
        },

        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
            for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
                if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                    if ( !keepData && elem.nodeType === 1 ) {
                        jQuery.cleanData( elem.getElementsByTagName("*") );
                        jQuery.cleanData( [ elem ] );
                    }

                    if ( elem.parentNode ) {
                        elem.parentNode.removeChild( elem );
                    }
                }
            }

            return this;
        },

        empty: function() {
            for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
                // Remove element nodes and prevent memory leaks
                if ( elem.nodeType === 1 ) {
                    jQuery.cleanData( elem.getElementsByTagName("*") );
                }

                // Remove any remaining nodes
                while ( elem.firstChild ) {
                    elem.removeChild( elem.firstChild );
                }
            }

            return this;
        },

        clone: function( dataAndEvents, deepDataAndEvents ) {
            dataAndEvents = dataAndEvents == null ? true : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map( function () {
                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
            });
        },

        html: function( value ) {
            if ( value === undefined ) {
                return this[0] && this[0].nodeType === 1 ?
                    this[0].innerHTML.replace(rinlinejQuery, "") :
                    null;

                // See if we can take a shortcut and just use innerHTML
            } else if ( typeof value === "string" && !rnocache.test( value ) &&
                (jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
                !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

                value = value.replace(rxhtmlTag, "<$1></$2>");

                try {
                    for ( var i = 0, l = this.length; i < l; i++ ) {
                        // Remove element nodes and prevent memory leaks
                        if ( this[i].nodeType === 1 ) {
                            jQuery.cleanData( this[i].getElementsByTagName("*") );
                            this[i].innerHTML = value;
                        }
                    }

                    // If using innerHTML throws an exception, use the fallback method
                } catch(e) {
                    this.empty().append( value );
                }

            } else if ( jQuery.isFunction( value ) ) {
                this.each(function(i){
                    var self = jQuery( this );

                    self.html( value.call(this, i, self.html()) );
                });

            } else {
                this.empty().append( value );
            }

            return this;
        },

        replaceWith: function( value ) {
            if ( this[0] && this[0].parentNode ) {
                // Make sure that the elements are removed from the DOM before they are inserted
                // this can help fix replacing a parent with child elements
                if ( jQuery.isFunction( value ) ) {
                    return this.each(function(i) {
                        var self = jQuery(this), old = self.html();
                        self.replaceWith( value.call( this, i, old ) );
                    });
                }

                if ( typeof value !== "string" ) {
                    value = jQuery( value ).detach();
                }

                return this.each(function() {
                    var next = this.nextSibling,
                        parent = this.parentNode;

                    jQuery( this ).remove();

                    if ( next ) {
                        jQuery(next).before( value );
                    } else {
                        jQuery(parent).append( value );
                    }
                });
            } else {
                return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
            }
        },

        detach: function( selector ) {
            return this.remove( selector, true );
        },

        domManip: function( args, table, callback ) {
            var results, first, fragment, parent,
                value = args[0],
                scripts = [];

            // We can't cloneNode fragments that contain checked, in WebKit
            if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
                return this.each(function() {
                    jQuery(this).domManip( args, table, callback, true );
                });
            }

            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    self.domManip( args, table, callback );
                });
            }

            if ( this[0] ) {
                parent = value && value.parentNode;

                // If we're in a fragment, just use that instead of building a new one
                if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
                    results = { fragment: parent };

                } else {
                    results = jQuery.buildFragment( args, this, scripts );
                }

                fragment = results.fragment;

                if ( fragment.childNodes.length === 1 ) {
                    first = fragment = fragment.firstChild;
                } else {
                    first = fragment.firstChild;
                }

                if ( first ) {
                    table = table && jQuery.nodeName( first, "tr" );

                    for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
                        callback.call(
                            table ?
                                root(this[i], first) :
                                this[i],
                            // Make sure that we do not leak memory by inadvertently discarding
                            // the original fragment (which might have attached data) instead of
                            // using it; in addition, use the original fragment object for the last
                            // item instead of first because it can end up being emptied incorrectly
                            // in certain situations (Bug #8070).
                            // Fragments from the fragment cache must always be cloned and never used
                            // in place.
                            results.cacheable || (l > 1 && i < lastIndex) ?
                                jQuery.clone( fragment, true, true ) :
                                fragment
                        );
                    }
                }

                if ( scripts.length ) {
                    jQuery.each( scripts, evalScript );
                }
            }

            return this;
        }
    });

    function root( elem, cur ) {
        return jQuery.nodeName(elem, "table") ?
            (elem.getElementsByTagName("tbody")[0] ||
                elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
            elem;
    }

    function cloneCopyEvent( src, dest ) {

        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
            return;
        }

        var internalKey = jQuery.expando,
            oldData = jQuery.data( src ),
            curData = jQuery.data( dest, oldData );

        // Switch to use the internal data object, if it exists, for the next
        // stage of data copying
        if ( (oldData = oldData[ internalKey ]) ) {
            var events = oldData.events;
            curData = curData[ internalKey ] = jQuery.extend({}, oldData);

            if ( events ) {
                delete curData.handle;
                curData.events = {};

                for ( var type in events ) {
                    for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
                        jQuery.event.add( dest, type, events[ type ][ i ], events[ type ][ i ].data );
                    }
                }
            }
        }
    }

    function cloneFixAttributes(src, dest) {
        // We do not need to do anything for non-Elements
        if ( dest.nodeType !== 1 ) {
            return;
        }

        var nodeName = dest.nodeName.toLowerCase();

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        dest.clearAttributes();

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        dest.mergeAttributes(src);

        // IE6-8 fail to clone children inside object elements that use
        // the proprietary classid attribute value (rather than the type
        // attribute) to identify the type of content to display
        if ( nodeName === "object" ) {
            dest.outerHTML = src.outerHTML;

        } else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set
            if ( src.checked ) {
                dest.defaultChecked = dest.checked = src.checked;
            }

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if ( dest.value !== src.value ) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if ( nodeName === "option" ) {
            dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
            dest.defaultValue = src.defaultValue;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        dest.removeAttribute( jQuery.expando );
    }

    jQuery.buildFragment = function( args, nodes, scripts ) {
        var fragment, cacheable, cacheresults,
            doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

        // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
        // Cloning options loses the selected state, so don't cache them
        // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
        // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
        if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
            args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

            cacheable = true;
            cacheresults = jQuery.fragments[ args[0] ];
            if ( cacheresults ) {
                if ( cacheresults !== 1 ) {
                    fragment = cacheresults;
                }
            }
        }

        if ( !fragment ) {
            fragment = doc.createDocumentFragment();
            jQuery.clean( args, doc, fragment, scripts );
        }

        if ( cacheable ) {
            jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
        }

        return { fragment: fragment, cacheable: cacheable };
    };

    jQuery.fragments = {};

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var ret = [],
                insert = jQuery( selector ),
                parent = this.length === 1 && this[0].parentNode;

            if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
                insert[ original ]( this[0] );
                return this;

            } else {
                for ( var i = 0, l = insert.length; i < l; i++ ) {
                    var elems = (i > 0 ? this.clone(true) : this).get();
                    jQuery( insert[i] )[ original ]( elems );
                    ret = ret.concat( elems );
                }

                return this.pushStack( ret, name, insert.selector );
            }
        };
    });

    jQuery.extend({
        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
            var clone = elem.cloneNode(true),
                srcElements,
                destElements,
                i;

            if ( !jQuery.support.noCloneEvent && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
                // IE copies events bound via attachEvent when using cloneNode.
                // Calling detachEvent on the clone will also remove the events
                // from the original. In order to get around this, we use some
                // proprietary methods to clear the events. Thanks to MooTools
                // guys for this hotness.

                // Using Sizzle here is crazy slow, so we use getElementsByTagName
                // instead
                srcElements = elem.getElementsByTagName("*");
                destElements = clone.getElementsByTagName("*");

                // Weird iteration because IE will replace the length property
                // with an element if you are cloning the body and one of the
                // elements on the page has a name or id of "length"
                for ( i = 0; srcElements[i]; ++i ) {
                    cloneFixAttributes( srcElements[i], destElements[i] );
                }

                cloneFixAttributes( elem, clone );
            }

            // Copy the events from the original to the clone
            if ( dataAndEvents ) {

                cloneCopyEvent( elem, clone );

                if ( deepDataAndEvents && "getElementsByTagName" in elem ) {

                    srcElements = elem.getElementsByTagName("*");
                    destElements = clone.getElementsByTagName("*");

                    if ( srcElements.length ) {
                        for ( i = 0; srcElements[i]; ++i ) {
                            cloneCopyEvent( srcElements[i], destElements[i] );
                        }
                    }
                }
            }
            // Return the cloned set
            return clone;
        },
        clean: function( elems, context, fragment, scripts ) {
            context = context || document;

            // !context.createElement fails in IE with an error but returns typeof 'object'
            if ( typeof context.createElement === "undefined" ) {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            }

            var ret = [];

            for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
                if ( typeof elem === "number" ) {
                    elem += "";
                }

                if ( !elem ) {
                    continue;
                }

                // Convert html string into DOM nodes
                if ( typeof elem === "string" && !rhtml.test( elem ) ) {
                    elem = context.createTextNode( elem );

                } else if ( typeof elem === "string" ) {
                    // Fix "XHTML"-style tags in all browsers
                    elem = elem.replace(rxhtmlTag, "<$1></$2>");

                    // Trim whitespace, otherwise indexOf won't work as expected
                    var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
                        wrap = wrapMap[ tag ] || wrapMap._default,
                        depth = wrap[0],
                        div = context.createElement("div");

                    // Go to html and back, then peel off extra wrappers
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    // Move to the right depth
                    while ( depth-- ) {
                        div = div.lastChild;
                    }

                    // Remove IE's autoinserted <tbody> from table fragments
                    if ( !jQuery.support.tbody ) {

                        // String was a <table>, *may* have spurious <tbody>
                        var hasBody = rtbody.test(elem),
                            tbody = tag === "table" && !hasBody ?
                                div.firstChild && div.firstChild.childNodes :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !hasBody ?
                                    div.childNodes :
                                    [];

                        for ( var j = tbody.length - 1; j >= 0 ; --j ) {
                            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                tbody[ j ].parentNode.removeChild( tbody[ j ] );
                            }
                        }

                    }

                    // IE completely kills leading whitespace when innerHTML is used
                    if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                        div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                    }

                    elem = div.childNodes;
                }

                if ( elem.nodeType ) {
                    ret.push( elem );
                } else {
                    ret = jQuery.merge( ret, elem );
                }
            }

            if ( fragment ) {
                for ( i = 0; ret[i]; i++ ) {
                    if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
                        scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

                    } else {
                        if ( ret[i].nodeType === 1 ) {
                            ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
                        }
                        fragment.appendChild( ret[i] );
                    }
                }
            }

            return ret;
        },

        cleanData: function( elems ) {
            var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
                deleteExpando = jQuery.support.deleteExpando;

            for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
                if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
                    continue;
                }

                id = elem[ jQuery.expando ];

                if ( id ) {
                    data = cache[ id ] && cache[ id ][ internalKey ];

                    if ( data && data.events ) {
                        for ( var type in data.events ) {
                            if ( special[ type ] ) {
                                jQuery.event.remove( elem, type );

                                // This is a shortcut to avoid jQuery.event.remove's overhead
                            } else {
                                jQuery.removeEvent( elem, type, data.handle );
                            }
                        }

                        // Null the DOM reference to avoid IE6/7/8 leak (#7054)
                        if ( data.handle ) {
                            data.handle.elem = null;
                        }
                    }

                    if ( deleteExpando ) {
                        delete elem[ jQuery.expando ];

                    } else if ( elem.removeAttribute ) {
                        elem.removeAttribute( jQuery.expando );
                    }

                    delete cache[ id ];
                }
            }
        }
    });

    function evalScript( i, elem ) {
        if ( elem.src ) {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            });
        } else {
            jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
        }

        if ( elem.parentNode ) {
            elem.parentNode.removeChild( elem );
        }
    }




    var ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity=([^)]*)/,
        rdashAlpha = /-([a-z])/ig,
        rupper = /([A-Z])/g,
        rnumpx = /^-?\d+(?:px)?$/i,
        rnum = /^-?\d/,

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssWidth = [ "Left", "Right" ],
        cssHeight = [ "Top", "Bottom" ],
        curCSS,

        getComputedStyle,
        currentStyle,

        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        };

    jQuery.fn.css = function( name, value ) {
        // Setting 'undefined' is a no-op
        if ( arguments.length === 2 && value === undefined ) {
            return this;
        }

        return jQuery.access( this, name, value, true, function( elem, name, value ) {
            return value !== undefined ?
                jQuery.style( elem, name, value ) :
                jQuery.css( elem, name );
        });
    };

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // We should always get a number back from opacity
                        var ret = curCSS( elem, "opacity", "opacity" );
                        return ret === "" ? "1" : ret;

                    } else {
                        return elem.style.opacity;
                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "zIndex": true,
            "fontWeight": true,
            "opacity": true,
            "zoom": true,
            "lineHeight": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {
            // Don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, origName = jQuery.camelCase( name ),
                style = elem.style, hooks = jQuery.cssHooks[ origName ];

            name = jQuery.cssProps[ origName ] || origName;

            // Check if we're setting a value
            if ( value !== undefined ) {
                // Make sure that NaN and null values aren't set. See: #7116
                if ( typeof value === "number" && isNaN( value ) || value == null ) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if ( typeof value === "number" && !jQuery.cssNumber[ origName ] ) {
                    value += "px";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[ name ] = value;
                    } catch(e) {}
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[ name ];
            }
        },

        css: function( elem, name, extra ) {
            // Make sure that we're working with the right name
            var ret, origName = jQuery.camelCase( name ),
                hooks = jQuery.cssHooks[ origName ];

            name = jQuery.cssProps[ origName ] || origName;

            // If a hook was provided get the computed value from there
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
                return ret;

                // Otherwise, if a way to get the computed value exists, use that
            } else if ( curCSS ) {
                return curCSS( elem, name, origName );
            }
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function( elem, options, callback ) {
            var old = {};

            // Remember the old values, and insert the new ones
            for ( var name in options ) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = options[ name ];
            }

            callback.call( elem );

            // Revert the old values
            for ( name in options ) {
                elem.style[ name ] = old[ name ];
            }
        },

        camelCase: function( string ) {
            return string.replace( rdashAlpha, fcamelCase );
        }
    });

// DEPRECATED, Use jQuery.css() instead
    jQuery.curCSS = jQuery.css;

    jQuery.each(["height", "width"], function( i, name ) {
        jQuery.cssHooks[ name ] = {
            get: function( elem, computed, extra ) {
                var val;

                if ( computed ) {
                    if ( elem.offsetWidth !== 0 ) {
                        val = getWH( elem, name, extra );

                    } else {
                        jQuery.swap( elem, cssShow, function() {
                            val = getWH( elem, name, extra );
                        });
                    }

                    if ( val <= 0 ) {
                        val = curCSS( elem, name, name );

                        if ( val === "0px" && currentStyle ) {
                            val = currentStyle( elem, name, name );
                        }

                        if ( val != null ) {
                            // Should return "auto" instead of 0, use 0 for
                            // temporary backwards-compat
                            return val === "" || val === "auto" ? "0px" : val;
                        }
                    }

                    if ( val < 0 || val == null ) {
                        val = elem.style[ name ];

                        // Should return "auto" instead of 0, use 0 for
                        // temporary backwards-compat
                        return val === "" || val === "auto" ? "0px" : val;
                    }

                    return typeof val === "string" ? val : val + "px";
                }
            },

            set: function( elem, value ) {
                if ( rnumpx.test( value ) ) {
                    // ignore negative width and height values #1599
                    value = parseFloat(value);

                    if ( value >= 0 ) {
                        return value + "px";
                    }

                } else {
                    return value;
                }
            }
        };
    });

    if ( !jQuery.support.opacity ) {
        jQuery.cssHooks.opacity = {
            get: function( elem, computed ) {
                // IE uses filters for opacity
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
                    (parseFloat(RegExp.$1) / 100) + "" :
                    computed ? "1" : "";
            },

            set: function( elem, value ) {
                var style = elem.style;

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // Set the alpha filter to set the opacity
                var opacity = jQuery.isNaN(value) ?
                        "" :
                        "alpha(opacity=" + value * 100 + ")",
                    filter = style.filter || "";

                style.filter = ralpha.test(filter) ?
                    filter.replace(ralpha, opacity) :
                    style.filter + ' ' + opacity;
            }
        };
    }

    if ( document.defaultView && document.defaultView.getComputedStyle ) {
        getComputedStyle = function( elem, newName, name ) {
            var ret, defaultView, computedStyle;

            name = name.replace( rupper, "-$1" ).toLowerCase();

            if ( !(defaultView = elem.ownerDocument.defaultView) ) {
                return undefined;
            }

            if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
                ret = computedStyle.getPropertyValue( name );
                if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
                    ret = jQuery.style( elem, name );
                }
            }

            return ret;
        };
    }

    if ( document.documentElement.currentStyle ) {
        currentStyle = function( elem, name ) {
            var left,
                ret = elem.currentStyle && elem.currentStyle[ name ],
                rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
                style = elem.style;

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
                // Remember the original values
                left = style.left;

                // Put in the new values to get a computed value out
                if ( rsLeft ) {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : (ret || 0);
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if ( rsLeft ) {
                    elem.runtimeStyle.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    curCSS = getComputedStyle || currentStyle;

    function getWH( elem, name, extra ) {
        var which = name === "width" ? cssWidth : cssHeight,
            val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

        if ( extra === "border" ) {
            return val;
        }

        jQuery.each( which, function() {
            if ( !extra ) {
                val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
            }

            if ( extra === "margin" ) {
                val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

            } else {
                val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
            }
        });

        return val;
    }

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
            var width = elem.offsetWidth,
                height = elem.offsetHeight;

            return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
        };

        jQuery.expr.filters.visible = function( elem ) {
            return !jQuery.expr.filters.hidden( elem );
        };
    }




    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rhash = /#.*$/,
        rheaders = /^(.*?):\s*(.*?)\r?$/mg, // IE leaves an \r character at EOL
        rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rquery = /\?/,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        rselectTextarea = /^(?:select|textarea)/i,
        rspacesAjax = /\s+/,
        rts = /([?&])_=[^&]*/,
        rurl = /^(\w+:)\/\/([^\/?#:]+)(?::(\d+))?/,

    // Keep a copy of the old load method
        _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
        prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
        transports = {};

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {

            if ( typeof dataTypeExpression !== "string" ) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            if ( jQuery.isFunction( func ) ) {
                var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
                    i = 0,
                    length = dataTypes.length,
                    dataType,
                    list,
                    placeBefore;

                // For each dataType in the dataTypeExpression
                for(; i < length; i++ ) {
                    dataType = dataTypes[ i ];
                    // We control if we're asked to add before
                    // any existing element
                    placeBefore = /^\+/.test( dataType );
                    if ( placeBefore ) {
                        dataType = dataType.substr( 1 ) || "*";
                    }
                    list = structure[ dataType ] = structure[ dataType ] || [];
                    // then we add to the structure accordingly
                    list[ placeBefore ? "unshift" : "push" ]( func );
                }
            }
        };
    }

//Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jXHR,
                                            dataType /* internal */, inspected /* internal */ ) {

        dataType = dataType || options.dataTypes[ 0 ];
        inspected = inspected || {};

        inspected[ dataType ] = true;

        var list = structure[ dataType ],
            i = 0,
            length = list ? list.length : 0,
            executeOnly = ( structure === prefilters ),
            selection;

        for(; i < length && ( executeOnly || !selection ); i++ ) {
            selection = list[ i ]( options, originalOptions, jXHR );
            // If we got redirected to another dataType
            // we try there if not done already
            if ( typeof selection === "string" ) {
                if ( inspected[ selection ] ) {
                    selection = undefined;
                } else {
                    options.dataTypes.unshift( selection );
                    selection = inspectPrefiltersOrTransports(
                        structure, options, originalOptions, jXHR, selection, inspected );
                }
            }
        }
        // If we're only executing or nothing was selected
        // we try the catchall dataType if not done already
        if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
            selection = inspectPrefiltersOrTransports(
                structure, options, originalOptions, jXHR, "*", inspected );
        }
        // unnecessary when only executing (prefilters)
        // but it'll be ignored by the caller in that case
        return selection;
    }

    jQuery.fn.extend({
        load: function( url, params, callback ) {
            if ( typeof url !== "string" && _load ) {
                return _load.apply( this, arguments );

                // Don't do a request if no elements are being requested
            } else if ( !this.length ) {
                return this;
            }

            var off = url.indexOf( " " );
            if ( off >= 0 ) {
                var selector = url.slice( off, url.length );
                url = url.slice( 0, off );
            }

            // Default to a GET request
            var type = "GET";

            // If the second parameter was provided
            if ( params ) {
                // If it's a function
                if ( jQuery.isFunction( params ) ) {
                    // We assume that it's the callback
                    callback = params;
                    params = null;

                    // Otherwise, build a param string
                } else if ( typeof params === "object" ) {
                    params = jQuery.param( params, jQuery.ajaxSettings.traditional );
                    type = "POST";
                }
            }

            var self = this;

            // Request the remote document
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                // Complete callback (responseText is used internally)
                complete: function( jXHR, status, responseText ) {
                    // Store the response as specified by the jXHR object
                    responseText = jXHR.responseText;
                    // If successful, inject the HTML into all the matched elements
                    if ( jXHR.isResolved() ) {
                        // #4825: Get the actual response in case
                        // a dataFilter is present in ajaxSettings
                        jXHR.done(function( r ) {
                            responseText = r;
                        });
                        // See if a selector was specified
                        self.html( selector ?
                            // Create a dummy div to hold the results
                            jQuery("<div>")
                                // inject the contents of the document in, removing the scripts
                                // to avoid any 'Permission Denied' errors in IE
                                .append(responseText.replace(rscript, ""))

                                // Locate the specified elements
                                .find(selector) :

                            // If not, just inject the full result
                            responseText );
                    }

                    if ( callback ) {
                        self.each( callback, [ responseText, status, jXHR ] );
                    }
                }
            });

            return this;
        },

        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },

        serializeArray: function() {
            return this.map(function(){
                return this.elements ? jQuery.makeArray( this.elements ) : this;
            })
                .filter(function(){
                    return this.name && !this.disabled &&
                        ( this.checked || rselectTextarea.test( this.nodeName ) ||
                            rinput.test( this.type ) );
                })
                .map(function( i, elem ){
                    var val = jQuery( this ).val();

                    return val == null ?
                        null :
                        jQuery.isArray( val ) ?
                            jQuery.map( val, function( val, i ){
                                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                            }) :
                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                }).get();
        }
    });

// Attach a bunch of functions for handling common AJAX events
    jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
        jQuery.fn[ o ] = function( f ){
            return this.bind( o, f );
        };
    } );

    jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
            // shift arguments if data argument was omitted
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = null;
            }

            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    } );

    jQuery.extend({

        getScript: function( url, callback ) {
            return jQuery.get( url, null, callback, "script" );
        },

        getJSON: function( url, data, callback ) {
            return jQuery.get( url, data, callback, "json" );
        },

        ajaxSetup: function( settings ) {
            jQuery.extend( true, jQuery.ajaxSettings, settings );
            if ( settings.context ) {
                jQuery.ajaxSettings.context = settings.context;
            }
        },

        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            /*
             timeout: 0,
             data: null,
             dataType: null,
             username: null,
             password: null,
             cache: null,
             traditional: false,
             headers: {},
             crossDomain: null,
             */

            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": "*/*"
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            // List of data converters
            // 1) key format is "source_type destination_type" (a single space in-between)
            // 2) the catchall symbol "*" can be used for source_type
            converters: {

                // Convert anything to text
                "* text": window.String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            }
        },

        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),

        // Main method
        ajax: function( url, options ) {

            // If options is not an object,
            // we simulate pre-1.5 signature
            if ( typeof options !== "object" ) {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // Create the final options object
                s = jQuery.extend( true, {}, jQuery.ajaxSettings, options ),
            // Callbacks contexts
            // We force the original context if it exists
            // or take it from jQuery.ajaxSettings otherwise
            // (plain objects used as context get extended)
                callbackContext =
                    ( s.context = ( "context" in options ? options : jQuery.ajaxSettings ).context ) || s,
                globalEventContext = callbackContext === s ? jQuery.event : jQuery( callbackContext ),
            // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery._Deferred(),
            // Status-dependent callbacks
                statusCode = s.statusCode || {},
            // Headers (they are sent all at once)
                requestHeaders = {},
            // Response headers
                responseHeadersString,
                responseHeaders,
            // transport
                transport,
            // timeout handle
                timeoutTimer,
            // Cross-domain detection vars
                loc = document.location,
                protocol = loc.protocol || "http:",
                parts,
            // The jXHR state
                state = 0,
            // Loop variable
                i,
            // Fake xhr
                jXHR = {

                    readyState: 0,

                    // Caches the header
                    setRequestHeader: function( name, value ) {
                        if ( state === 0 ) {
                            requestHeaders[ name.toLowerCase() ] = value;
                        }
                        return this;
                    },

                    // Raw string
                    getAllResponseHeaders: function() {
                        return state === 2 ? responseHeadersString : null;
                    },

                    // Builds headers hashtable if needed
                    getResponseHeader: function( key ) {
                        var match;
                        if ( state === 2 ) {
                            if ( !responseHeaders ) {
                                responseHeaders = {};
                                while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                    responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                }
                            }
                            match = responseHeaders[ key.toLowerCase() ];
                        }
                        return match || null;
                    },

                    // Cancel the request
                    abort: function( statusText ) {
                        statusText = statusText || "abort";
                        if ( transport ) {
                            transport.abort( statusText );
                        }
                        done( 0, statusText );
                        return this;
                    }
                };

            // Callback for when everything is done
            // It is defined here because jslint complains if it is declared
            // at the end of the function (which would be more logical and readable)
            function done( status, statusText, responses, headers) {

                // Called once
                if ( state === 2 ) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if ( timeoutTimer ) {
                    clearTimeout( timeoutTimer );
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jXHR.readyState = status ? 4 : 0;

                var isSuccess,
                    success,
                    error,
                    response = responses ? ajaxHandleResponses( s, jXHR, responses ) : undefined,
                    lastModified,
                    etag;

                // If successful, handle type chaining
                if ( status >= 200 && status < 300 || status === 304 ) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if ( s.ifModified ) {

                        if ( ( lastModified = jXHR.getResponseHeader( "Last-Modified" ) ) ) {
                            jQuery.lastModified[ s.url ] = lastModified;
                        }
                        if ( ( etag = jXHR.getResponseHeader( "Etag" ) ) ) {
                            jQuery.etag[ s.url ] = etag;
                        }
                    }

                    // If not modified
                    if ( status === 304 ) {

                        statusText = "notmodified";
                        isSuccess = true;

                        // If we have data
                    } else {

                        try {
                            success = ajaxConvert( s, response );
                            statusText = "success";
                            isSuccess = true;
                        } catch(e) {
                            // We have a parsererror
                            statusText = "parsererror";
                            error = e;
                        }
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if( status ) {
                        statusText = "error";
                        if ( status < 0 ) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jXHR.status = status;
                jXHR.statusText = statusText;

                // Success/Error
                if ( isSuccess ) {
                    deferred.resolveWith( callbackContext, [ success, statusText, jXHR ] );
                } else {
                    deferred.rejectWith( callbackContext, [ jXHR, statusText, error ] );
                }

                // Status-dependent callbacks
                jXHR.statusCode( statusCode );
                statusCode = undefined;

                if ( s.global ) {
                    globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                        [ jXHR, s, isSuccess ? success : error ] );
                }

                // Complete
                completeDeferred.resolveWith( callbackContext, [ jXHR, statusText ] );

                if ( s.global ) {
                    globalEventContext.trigger( "ajaxComplete", [ jXHR, s] );
                    // Handle the global AJAX counter
                    if ( !( --jQuery.active ) ) {
                        jQuery.event.trigger( "ajaxStop" );
                    }
                }
            }

            // Attach deferreds
            deferred.promise( jXHR );
            jXHR.success = jXHR.done;
            jXHR.error = jXHR.fail;
            jXHR.complete = completeDeferred.done;

            // Status-dependent callbacks
            jXHR.statusCode = function( map ) {
                if ( map ) {
                    var tmp;
                    if ( state < 2 ) {
                        for( tmp in map ) {
                            statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                        }
                    } else {
                        tmp = map[ jXHR.status ];
                        jXHR.then( tmp, tmp );
                    }
                }
                return this;
            };

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // We also use the url parameter if available
            s.url = ( "" + ( url || s.url ) ).replace( rhash, "" ).replace( rprotocol, protocol + "//" );

            // Extract dataTypes list
            s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

            // Determine if a cross-domain request is in order
            if ( !s.crossDomain ) {
                parts = rurl.exec( s.url.toLowerCase() );
                s.crossDomain = !!( parts &&
                    ( parts[ 1 ] != protocol || parts[ 2 ] != loc.hostname ||
                        ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                            ( loc.port || ( protocol === "http:" ? 80 : 443 ) ) )
                    );
            }

            // Convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                s.data = jQuery.param( s.data, s.traditional );
            }

            // Apply prefilters
            inspectPrefiltersOrTransports( prefilters, s, options, jXHR );

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test( s.type );

            // Watch for a new set of requests
            if ( s.global && jQuery.active++ === 0 ) {
                jQuery.event.trigger( "ajaxStart" );
            }

            // More options handling for requests with no content
            if ( !s.hasContent ) {

                // If data is available, append data to url
                if ( s.data ) {
                    s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                }

                // Add anti-cache in url if needed
                if ( s.cache === false ) {

                    var ts = jQuery.now(),
                    // try replacing _= if it is there
                        ret = s.url.replace( rts, "$1_=" + ts );

                    // if nothing was replaced, add timestamp to the end
                    s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
                }
            }

            // Set the correct header, if data is being sent
            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                requestHeaders[ "content-type" ] = s.contentType;
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {
                if ( jQuery.lastModified[ s.url ] ) {
                    requestHeaders[ "if-modified-since" ] = jQuery.lastModified[ s.url ];
                }
                if ( jQuery.etag[ s.url ] ) {
                    requestHeaders[ "if-none-match" ] = jQuery.etag[ s.url ];
                }
            }

            // Set the Accepts header for the server, depending on the dataType
            requestHeaders.accept = s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
                s.accepts[ "*" ];

            // Check for headers option
            for ( i in s.headers ) {
                requestHeaders[ i.toLowerCase() ] = s.headers[ i ];
            }

            // Allow custom headers/mimetypes and early abort
            if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already
                done( 0, "abort" );
                // Return false
                jXHR = false;

            } else {

                // Install callbacks on deferreds
                for ( i in { success: 1, error: 1, complete: 1 } ) {
                    jXHR[ i ]( s[ i ] );
                }

                // Get transport
                transport = inspectPrefiltersOrTransports( transports, s, options, jXHR );

                // If no transport, we auto-abort
                if ( !transport ) {
                    done( -1, "No Transport" );
                } else {
                    // Set state as sending
                    state = jXHR.readyState = 1;
                    // Send global event
                    if ( s.global ) {
                        globalEventContext.trigger( "ajaxSend", [ jXHR, s ] );
                    }
                    // Timeout
                    if ( s.async && s.timeout > 0 ) {
                        timeoutTimer = setTimeout( function(){
                            jXHR.abort( "timeout" );
                        }, s.timeout );
                    }

                    try {
                        transport.send( requestHeaders, done );
                    } catch (e) {
                        // Propagate exception as error if not done
                        if ( status < 2 ) {
                            done( -1, e );
                            // Simply rethrow otherwise
                        } else {
                            jQuery.error( e );
                        }
                    }
                }
            }
            return jXHR;
        },

        // Serialize an array of form elements or a set of
        // key/values into a query string
        param: function( a, traditional ) {
            var s = [],
                add = function( key, value ) {
                    // If value is a function, invoke it and return its value
                    value = jQuery.isFunction( value ) ? value() : value;
                    s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
                };

            // Set traditional to true for jQuery <= 1.3.2 behavior.
            if ( traditional === undefined ) {
                traditional = jQuery.ajaxSettings.traditional;
            }

            // If an array was passed in, assume that it is an array of form elements.
            if ( jQuery.isArray( a ) || a.jquery ) {
                // Serialize the form elements
                jQuery.each( a, function() {
                    add( this.name, this.value );
                } );

            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for ( var prefix in a ) {
                    buildParams( prefix, a[ prefix ], traditional, add );
                }
            }

            // Return the resulting serialization
            return s.join( "&" ).replace( r20, "+" );
        }
    });

    function buildParams( prefix, obj, traditional, add ) {
        if ( jQuery.isArray( obj ) && obj.length ) {
            // Serialize array item.
            jQuery.each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    // If array item is non-scalar (array or object), encode its
                    // numeric index to resolve deserialization ambiguity issues.
                    // Note that rack (as of 1.0.0) can't currently deserialize
                    // nested arrays properly, and attempting to do so may cause
                    // a server error. Possible fixes are to modify rack's
                    // deserialization algorithm or to provide an option or flag
                    // to force array serialization to be shallow.
                    buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
                }
            });

        } else if ( !traditional && obj != null && typeof obj === "object" ) {
            // If we see an array here, it is empty and should be treated as an empty
            // object
            if ( jQuery.isArray( obj ) || jQuery.isEmptyObject( obj ) ) {
                add( prefix, "" );

                // Serialize object item.
            } else {
                jQuery.each( obj, function( k, v ) {
                    buildParams( prefix + "[" + k + "]", v, traditional, add );
                });
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {}

    });

    /* Handles responses to an ajax request:
     * - sets all responseXXX fields accordingly
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jXHR, responses ) {

        var contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields,
            ct,
            type,
            finalDataType,
            firstDataType;

        // Fill responseXXX fields
        for( type in responseFields ) {
            if ( type in responses ) {
                jXHR[ responseFields[type] ] = responses[ type ];
            }
        }

        // Remove auto dataType and get content-type in the process
        while( dataTypes[ 0 ] === "*" ) {
            dataTypes.shift();
            if ( ct === undefined ) {
                ct = jXHR.getResponseHeader( "content-type" );
            }
        }

        // Check if we're dealing with a known content-type
        if ( ct ) {
            for ( type in contents ) {
                if ( contents[ type ] && contents[ type ].test( ct ) ) {
                    dataTypes.unshift( type );
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
            finalDataType = dataTypes[ 0 ];
        } else {
            // Try convertible dataTypes
            for ( type in responses ) {
                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                    finalDataType = type;
                    break;
                }
                if ( !firstDataType ) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
            if ( finalDataType !== dataTypes[ 0 ] ) {
                dataTypes.unshift( finalDataType );
            }
            return responses[ finalDataType ];
        }
    }

// Chain conversions given the request and the original response
    function ajaxConvert( s, response ) {

        // Apply the dataFilter if provided
        if ( s.dataFilter ) {
            response = s.dataFilter( response, s.dataType );
        }

        var dataTypes = s.dataTypes,
            converters = s.converters,
            i,
            length = dataTypes.length,
            tmp,
        // Current and previous dataTypes
            current = dataTypes[ 0 ],
            prev,
        // Conversion expression
            conversion,
        // Conversion function
            conv,
        // Conversion functions (transitive conversion)
            conv1,
            conv2;

        // For each dataType in the chain
        for( i = 1; i < length; i++ ) {

            // Get the dataTypes
            prev = current;
            current = dataTypes[ i ];

            // If current is auto dataType, update it to prev
            if( current === "*" ) {
                current = prev;
                // If no auto and dataTypes are actually different
            } else if ( prev !== "*" && prev !== current ) {

                // Get the converter
                conversion = prev + " " + current;
                conv = converters[ conversion ] || converters[ "* " + current ];

                // If there is no direct converter, search transitively
                if ( !conv ) {
                    conv2 = undefined;
                    for( conv1 in converters ) {
                        tmp = conv1.split( " " );
                        if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
                            conv2 = converters[ tmp[1] + " " + current ];
                            if ( conv2 ) {
                                conv1 = converters[ conv1 ];
                                if ( conv1 === true ) {
                                    conv = conv2;
                                } else if ( conv2 === true ) {
                                    conv = conv1;
                                }
                                break;
                            }
                        }
                    }
                }
                // If we found no converter, dispatch an error
                if ( !( conv || conv2 ) ) {
                    jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
                }
                // If found converter is not an equivalence
                if ( conv !== true ) {
                    // Convert with 1 or 2 converters accordingly
                    response = conv ? conv( response ) : conv2( conv1(response) );
                }
            }
        }
        return response;
    }




    var jsc = jQuery.now(),
        jsre = /(\=)\?(&|$)|()\?\?()/i;

// Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return jQuery.expando + "_" + ( jsc++ );
        }
    });

// Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, dataIsString /* internal */ ) {

        dataIsString = ( typeof s.data === "string" );

        if ( s.dataTypes[ 0 ] === "jsonp" ||
            originalSettings.jsonpCallback ||
            originalSettings.jsonp != null ||
            s.jsonp !== false && ( jsre.test( s.url ) ||
                dataIsString && jsre.test( s.data ) ) ) {

            var responseContainer,
                jsonpCallback = s.jsonpCallback =
                    jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
                previous = window[ jsonpCallback ],
                url = s.url,
                data = s.data,
                replace = "$1" + jsonpCallback + "$2";

            if ( s.jsonp !== false ) {
                url = url.replace( jsre, replace );
                if ( s.url === url ) {
                    if ( dataIsString ) {
                        data = data.replace( jsre, replace );
                    }
                    if ( s.data === data ) {
                        // Add callback manually
                        url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                    }
                }
            }

            s.url = url;
            s.data = data;

            window[ jsonpCallback ] = function( response ) {
                responseContainer = [ response ];
            };

            s.complete = [ function() {

                // Set callback back to previous value
                window[ jsonpCallback ] = previous;

                // Call if it was a function and we have a response
                if ( previous) {
                    if ( responseContainer && jQuery.isFunction( previous ) ) {
                        window[ jsonpCallback ] ( responseContainer[ 0 ] );
                    }
                } else {
                    // else, more memory leak avoidance
                    try{
                        delete window[ jsonpCallback ];
                    } catch( e ) {}
                }

            }, s.complete ];

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function() {
                if ( ! responseContainer ) {
                    jQuery.error( jsonpCallback + " was not called" );
                }
                return responseContainer[ 0 ];
            };

            // force json dataType
            s.dataTypes[ 0 ] = "json";

            // Delegate to script
            return "script";
        }
    } );




// Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript"
        },
        contents: {
            script: /javascript/
        },
        converters: {
            "text script": function( text ) {
                jQuery.globalEval( text );
                return text;
            }
        }
    });

// Handle cache's special case and global
    jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
            s.cache = false;
        }
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    } );

// Bind script tag hack transport
    jQuery.ajaxTransport( "script", function(s) {

        // This transport only deals with cross domain requests
        if ( s.crossDomain ) {

            var script,
                head = document.getElementsByTagName( "head" )[ 0 ] || document.documentElement;

            return {

                send: function( _, callback ) {

                    script = document.createElement( "script" );

                    script.async = "async";

                    if ( s.scriptCharset ) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function( _, isAbort ) {

                        if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if ( head && script.parentNode ) {
                                head.removeChild( script );
                            }

                            // Dereference the script
                            script = undefined;

                            // Callback if not abort
                            if ( !isAbort ) {
                                callback( 200, "success" );
                            }
                        }
                    };
                    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                    // This arises when a base node is used (#2709 and #4378).
                    head.insertBefore( script, head.firstChild );
                },

                abort: function() {
                    if ( script ) {
                        script.onload( 0, 1 );
                    }
                }
            };
        }
    } );




    var // Next active xhr id
        xhrId = jQuery.now(),

    // active xhrs
        xhrs = {},

    // #5280: see below
        xhrUnloadAbortInstalled,

    // XHR used to determine supports properties
        testXHR;

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /* Microsoft failed to properly
         * implement the XMLHttpRequest in IE7 (can't request local files),
         * so we use the ActiveXObject when it is available
         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
         * we need a fallback.
         */
        function() {
            if ( window.location.protocol !== "file:" ) {
                try {
                    return new window.XMLHttpRequest();
                } catch( xhrError ) {}
            }

            try {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch( activeError ) {}
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        function() {
            return new window.XMLHttpRequest();
        };

// Test if we can create an xhr object
    try {
        testXHR = jQuery.ajaxSettings.xhr();
    } catch( xhrCreationException ) {}

//Does this browser support XHR requests?
    jQuery.support.ajax = !!testXHR;

// Does this browser support crossDomain XHR requests
    jQuery.support.cors = testXHR && ( "withCredentials" in testXHR );

// No need for the temporary xhr anymore
    testXHR = undefined;

// Create transport if the browser can provide an xhr
    if ( jQuery.support.ajax ) {

        jQuery.ajaxTransport(function( s ) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if ( !s.crossDomain || jQuery.support.cors ) {

                var callback;

                return {
                    send: function( headers, complete ) {

                        // #5280: we need to abort on unload or IE will keep connections alive
                        if ( !xhrUnloadAbortInstalled ) {

                            xhrUnloadAbortInstalled = 1;

                            jQuery(window).bind( "unload", function() {

                                // Abort all pending requests
                                jQuery.each( xhrs, function( _, xhr ) {
                                    if ( xhr.onreadystatechange ) {
                                        xhr.onreadystatechange( 1 );
                                    }
                                } );

                            } );
                        }

                        // Get a new xhr
                        var xhr = s.xhr(),
                            handle;

                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if ( s.username ) {
                            xhr.open( s.type, s.url, s.async, s.username, s.password );
                        } else {
                            xhr.open( s.type, s.url, s.async );
                        }

                        // Requested-With header
                        // Not set for crossDomain requests with no content
                        // (see why at http://trac.dojotoolkit.org/ticket/9486)
                        // Won't change header if already provided
                        if ( !( s.crossDomain && !s.hasContent ) && !headers["x-requested-with"] ) {
                            headers[ "x-requested-with" ] = "XMLHttpRequest";
                        }

                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            jQuery.each( headers, function( key, value ) {
                                xhr.setRequestHeader( key, value );
                            } );
                        } catch( _ ) {}

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send( ( s.hasContent && s.data ) || null );

                        // Listener
                        callback = function( _, isAbort ) {

                            // Was never called and is aborted or complete
                            if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                // Only called once
                                callback = 0;

                                // Do not keep as active anymore
                                if ( handle ) {
                                    xhr.onreadystatechange = jQuery.noop;
                                    delete xhrs[ handle ];
                                }

                                // If it's an abort
                                if ( isAbort ) {
                                    // Abort it manually if needed
                                    if ( xhr.readyState !== 4 ) {
                                        xhr.abort();
                                    }
                                } else {
                                    // Get info
                                    var status = xhr.status,
                                        statusText,
                                        responseHeaders = xhr.getAllResponseHeaders(),
                                        responses = {},
                                        xml = xhr.responseXML;

                                    // Construct response list
                                    if ( xml && xml.documentElement /* #4958 */ ) {
                                        responses.xml = xml;
                                    }
                                    responses.text = xhr.responseText;

                                    // Firefox throws an exception when accessing
                                    // statusText for faulty cross-domain requests
                                    try {
                                        statusText = xhr.statusText;
                                    } catch( e ) {
                                        // We normalize with Webkit giving an empty statusText
                                        statusText = "";
                                    }

                                    // Filter status for non standard behaviours
                                    status =
                                        // Opera returns 0 when it should be 304
                                        // Webkit returns 0 for failing cross-domain no matter the real status
                                        status === 0 ?
                                            (
                                                // Webkit, Firefox: filter out faulty cross-domain requests
                                                !s.crossDomain || statusText ?
                                                    (
                                                        // Opera: filter out real aborts #6060
                                                        responseHeaders ?
                                                            304 :
                                                            0
                                                        ) :
                                                    // We assume 302 but could be anything cross-domain related
                                                    302
                                                ) :
                                            (
                                                // IE sometimes returns 1223 when it should be 204 (see #1450)
                                                status == 1223 ?
                                                    204 :
                                                    status
                                                );

                                    // Call complete
                                    complete( status, statusText, responses, responseHeaders );
                                }
                            }
                        };

                        // if we're in sync mode or it's in cache
                        // and has been retrieved directly (IE6 & IE7)
                        // we need to manually fire the callback
                        if ( !s.async || xhr.readyState === 4 ) {
                            callback();
                        } else {
                            // Add to list of active xhrs
                            handle = xhrId++;
                            xhrs[ handle ] = xhr;
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function() {
                        if ( callback ) {
                            callback(0,1);
                        }
                    }
                };
            }
        });
    }




    var elemdisplay = {},
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        timerId,
        fxAttrs = [
            // height animations
            [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
            // width animations
            [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
            // opacity animations
            [ "opacity" ]
        ];

    jQuery.fn.extend({
        show: function( speed, easing, callback ) {
            var elem, display;

            if ( speed || speed === 0 ) {
                return this.animate( genFx("show", 3), speed, easing, callback);

            } else {
                for ( var i = 0, j = this.length; i < j; i++ ) {
                    elem = this[i];
                    display = elem.style.display;

                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
                        display = elem.style.display = "";
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
                        jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                    }
                }

                // Set the display of most of the elements in a second loop
                // to avoid the constant reflow
                for ( i = 0; i < j; i++ ) {
                    elem = this[i];
                    display = elem.style.display;

                    if ( display === "" || display === "none" ) {
                        elem.style.display = jQuery._data(elem, "olddisplay") || "";
                    }
                }

                return this;
            }
        },

        hide: function( speed, easing, callback ) {
            if ( speed || speed === 0 ) {
                return this.animate( genFx("hide", 3), speed, easing, callback);

            } else {
                for ( var i = 0, j = this.length; i < j; i++ ) {
                    var display = jQuery.css( this[i], "display" );

                    if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
                        jQuery._data( this[i], "olddisplay", display );
                    }
                }

                // Set the display of the elements in a second loop
                // to avoid the constant reflow
                for ( i = 0; i < j; i++ ) {
                    this[i].style.display = "none";
                }

                return this;
            }
        },

        // Save the old toggle function
        _toggle: jQuery.fn.toggle,

        toggle: function( fn, fn2, callback ) {
            var bool = typeof fn === "boolean";

            if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
                this._toggle.apply( this, arguments );

            } else if ( fn == null || bool ) {
                this.each(function() {
                    var state = bool ? fn : jQuery(this).is(":hidden");
                    jQuery(this)[ state ? "show" : "hide" ]();
                });

            } else {
                this.animate(genFx("toggle", 3), fn, fn2, callback);
            }

            return this;
        },

        fadeTo: function( speed, to, easing, callback ) {
            return this.filter(":hidden").css("opacity", 0).show().end()
                .animate({opacity: to}, speed, easing, callback);
        },

        animate: function( prop, speed, easing, callback ) {
            var optall = jQuery.speed(speed, easing, callback);

            if ( jQuery.isEmptyObject( prop ) ) {
                return this.each( optall.complete );
            }

            return this[ optall.queue === false ? "each" : "queue" ](function() {
                // XXX 'this' does not always have a nodeName when running the
                // test suite

                var opt = jQuery.extend({}, optall), p,
                    isElement = this.nodeType === 1,
                    hidden = isElement && jQuery(this).is(":hidden"),
                    self = this;

                for ( p in prop ) {
                    var name = jQuery.camelCase( p );

                    if ( p !== name ) {
                        prop[ name ] = prop[ p ];
                        delete prop[ p ];
                        p = name;
                    }

                    if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
                        return opt.complete.call(this);
                    }

                    if ( isElement && ( p === "height" || p === "width" ) ) {
                        // Make sure that nothing sneaks out
                        // Record all 3 overflow attributes because IE does not
                        // change the overflow attribute when overflowX and
                        // overflowY are set to the same value
                        opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

                        // Set display property to inline-block for height/width
                        // animations on inline elements that are having width/height
                        // animated
                        if ( jQuery.css( this, "display" ) === "inline" &&
                            jQuery.css( this, "float" ) === "none" ) {
                            if ( !jQuery.support.inlineBlockNeedsLayout ) {
                                this.style.display = "inline-block";

                            } else {
                                var display = defaultDisplay(this.nodeName);

                                // inline-level elements accept inline-block;
                                // block-level elements need to be inline with layout
                                if ( display === "inline" ) {
                                    this.style.display = "inline-block";

                                } else {
                                    this.style.display = "inline";
                                    this.style.zoom = 1;
                                }
                            }
                        }
                    }

                    if ( jQuery.isArray( prop[p] ) ) {
                        // Create (if needed) and add to specialEasing
                        (opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
                        prop[p] = prop[p][0];
                    }
                }

                if ( opt.overflow != null ) {
                    this.style.overflow = "hidden";
                }

                opt.curAnim = jQuery.extend({}, prop);

                jQuery.each( prop, function( name, val ) {
                    var e = new jQuery.fx( self, opt, name );

                    if ( rfxtypes.test(val) ) {
                        e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

                    } else {
                        var parts = rfxnum.exec(val),
                            start = e.cur() || 0;

                        if ( parts ) {
                            var end = parseFloat( parts[2] ),
                                unit = parts[3] || "px";

                            // We need to compute starting value
                            if ( unit !== "px" ) {
                                jQuery.style( self, name, (end || 1) + unit);
                                start = ((end || 1) / e.cur()) * start;
                                jQuery.style( self, name, start + unit);
                            }

                            // If a +=/-= token was provided, we're doing a relative animation
                            if ( parts[1] ) {
                                end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                            }

                            e.custom( start, end, unit );

                        } else {
                            e.custom( start, val, "" );
                        }
                    }
                });

                // For JS strict compliance
                return true;
            });
        },

        stop: function( clearQueue, gotoEnd ) {
            var timers = jQuery.timers;

            if ( clearQueue ) {
                this.queue([]);
            }

            this.each(function() {
                // go in reverse order so anything added to the queue during the loop is ignored
                for ( var i = timers.length - 1; i >= 0; i-- ) {
                    if ( timers[i].elem === this ) {
                        if (gotoEnd) {
                            // force the next step to be the last
                            timers[i](true);
                        }

                        timers.splice(i, 1);
                    }
                }
            });

            // start the next in the queue if the last step wasn't forced
            if ( !gotoEnd ) {
                this.dequeue();
            }

            return this;
        }

    });

    function genFx( type, num ) {
        var obj = {};

        jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
            obj[ this ] = type;
        });

        return obj;
    }

// Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show", 1),
        slideUp: genFx("hide", 1),
        slideToggle: genFx("toggle", 1),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    });

    jQuery.extend({
        speed: function( speed, easing, fn ) {
            var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing ||
                    jQuery.isFunction( speed ) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };

            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
                opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

            // Queueing
            opt.old = opt.complete;
            opt.complete = function() {
                if ( opt.queue !== false ) {
                    jQuery(this).dequeue();
                }
                if ( jQuery.isFunction( opt.old ) ) {
                    opt.old.call( this );
                }
            };

            return opt;
        },

        easing: {
            linear: function( p, n, firstNum, diff ) {
                return firstNum + diff * p;
            },
            swing: function( p, n, firstNum, diff ) {
                return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
            }
        },

        timers: [],

        fx: function( elem, options, prop ) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            if ( !options.orig ) {
                options.orig = {};
            }
        }

    });

    jQuery.fx.prototype = {
        // Simple function for setting a style value
        update: function() {
            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }

            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
        },

        // Get the current size
        cur: function() {
            if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
                return this.elem[ this.prop ];
            }

            var r = parseFloat( jQuery.css( this.elem, this.prop ) );
            return r || 0;
        },

        // Start an animation from one number to another
        custom: function( from, to, unit ) {
            var self = this,
                fx = jQuery.fx;

            this.startTime = jQuery.now();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;

            function t( gotoEnd ) {
                return self.step(gotoEnd);
            }

            t.elem = this.elem;

            if ( t() && jQuery.timers.push(t) && !timerId ) {
                timerId = setInterval(fx.tick, fx.interval);
            }
        },

        // Simple 'show' function
        show: function() {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
            this.options.show = true;

            // Begin the animation
            // Make sure that we start at a small width/height to avoid any
            // flash of content
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

            // Start by showing the element
            jQuery( this.elem ).show();
        },

        // Simple 'hide' function
        hide: function() {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
            this.options.hide = true;

            // Begin the animation
            this.custom(this.cur(), 0);
        },

        // Each step of an animation
        step: function( gotoEnd ) {
            var t = jQuery.now(), done = true;

            if ( gotoEnd || t >= this.options.duration + this.startTime ) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();

                this.options.curAnim[ this.prop ] = true;

                for ( var i in this.options.curAnim ) {
                    if ( this.options.curAnim[i] !== true ) {
                        done = false;
                    }
                }

                if ( done ) {
                    // Reset the overflow
                    if ( this.options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {
                        var elem = this.elem,
                            options = this.options;

                        jQuery.each( [ "", "X", "Y" ], function (index, value) {
                            elem.style[ "overflow" + value ] = options.overflow[index];
                        } );
                    }

                    // Hide the element if the "hide" operation was done
                    if ( this.options.hide ) {
                        jQuery(this.elem).hide();
                    }

                    // Reset the properties, if the item has been hidden or shown
                    if ( this.options.hide || this.options.show ) {
                        for ( var p in this.options.curAnim ) {
                            jQuery.style( this.elem, p, this.options.orig[p] );
                        }
                    }

                    // Execute the complete function
                    this.options.complete.call( this.elem );
                }

                return false;

            } else {
                var n = t - this.startTime;
                this.state = n / this.options.duration;

                // Perform the easing function, defaults to swing
                var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
                var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
                this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);

                // Perform the next step of the animation
                this.update();
            }

            return true;
        }
    };

    jQuery.extend( jQuery.fx, {
        tick: function() {
            var timers = jQuery.timers;

            for ( var i = 0; i < timers.length; i++ ) {
                if ( !timers[i]() ) {
                    timers.splice(i--, 1);
                }
            }

            if ( !timers.length ) {
                jQuery.fx.stop();
            }
        },

        interval: 13,

        stop: function() {
            clearInterval( timerId );
            timerId = null;
        },

        speeds: {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        },

        step: {
            opacity: function( fx ) {
                jQuery.style( fx.elem, "opacity", fx.now );
            },

            _default: function( fx ) {
                if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
                    fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
                } else {
                    fx.elem[ fx.prop ] = fx.now;
                }
            }
        }
    });

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
            return jQuery.grep(jQuery.timers, function( fn ) {
                return elem === fn.elem;
            }).length;
        };
    }

    function defaultDisplay( nodeName ) {
        if ( !elemdisplay[ nodeName ] ) {
            var elem = jQuery("<" + nodeName + ">").appendTo("body"),
                display = elem.css("display");

            elem.remove();

            if ( display === "none" || display === "" ) {
                display = "block";
            }

            elemdisplay[ nodeName ] = display;
        }

        return elemdisplay[ nodeName ];
    }




    var rtable = /^t(?:able|d|h)$/i,
        rroot = /^(?:body|html)$/i;

    if ( "getBoundingClientRect" in document.documentElement ) {
        jQuery.fn.offset = function( options ) {
            var elem = this[0], box;

            if ( options ) {
                return this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
            }

            if ( !elem || !elem.ownerDocument ) {
                return null;
            }

            if ( elem === elem.ownerDocument.body ) {
                return jQuery.offset.bodyOffset( elem );
            }

            try {
                box = elem.getBoundingClientRect();
            } catch(e) {}

            var doc = elem.ownerDocument,
                docElem = doc.documentElement;

            // Make sure we're not dealing with a disconnected DOM node
            if ( !box || !jQuery.contains( docElem, elem ) ) {
                return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
            }

            var body = doc.body,
                win = getWindow(doc),
                clientTop  = docElem.clientTop  || body.clientTop  || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                scrollTop  = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ),
                scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
                top  = box.top  + scrollTop  - clientTop,
                left = box.left + scrollLeft - clientLeft;

            return { top: top, left: left };
        };

    } else {
        jQuery.fn.offset = function( options ) {
            var elem = this[0];

            if ( options ) {
                return this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
            }

            if ( !elem || !elem.ownerDocument ) {
                return null;
            }

            if ( elem === elem.ownerDocument.body ) {
                return jQuery.offset.bodyOffset( elem );
            }

            jQuery.offset.initialize();

            var computedStyle,
                offsetParent = elem.offsetParent,
                prevOffsetParent = elem,
                doc = elem.ownerDocument,
                docElem = doc.documentElement,
                body = doc.body,
                defaultView = doc.defaultView,
                prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
                top = elem.offsetTop,
                left = elem.offsetLeft;

            while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
                if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
                    break;
                }

                computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
                top  -= elem.scrollTop;
                left -= elem.scrollLeft;

                if ( elem === offsetParent ) {
                    top  += elem.offsetTop;
                    left += elem.offsetLeft;

                    if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
                        top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                        left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                    }

                    prevOffsetParent = offsetParent;
                    offsetParent = elem.offsetParent;
                }

                if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
                    top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                    left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                }

                prevComputedStyle = computedStyle;
            }

            if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
                top  += body.offsetTop;
                left += body.offsetLeft;
            }

            if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
                top  += Math.max( docElem.scrollTop, body.scrollTop );
                left += Math.max( docElem.scrollLeft, body.scrollLeft );
            }

            return { top: top, left: left };
        };
    }

    jQuery.offset = {
        initialize: function() {
            var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
                html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

            jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

            container.innerHTML = html;
            body.insertBefore( container, body.firstChild );
            innerDiv = container.firstChild;
            checkDiv = innerDiv.firstChild;
            td = innerDiv.nextSibling.firstChild.firstChild;

            this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

            checkDiv.style.position = "fixed";
            checkDiv.style.top = "20px";

            // safari subtracts parent border width here which is 5px
            this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
            checkDiv.style.position = checkDiv.style.top = "";

            innerDiv.style.overflow = "hidden";
            innerDiv.style.position = "relative";

            this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

            this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

            body.removeChild( container );
            body = container = innerDiv = checkDiv = table = td = null;
            jQuery.offset.initialize = jQuery.noop;
        },

        bodyOffset: function( body ) {
            var top = body.offsetTop,
                left = body.offsetLeft;

            jQuery.offset.initialize();

            if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
                top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
                left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
            }

            return { top: top, left: left };
        },

        setOffset: function( elem, options, i ) {
            var position = jQuery.css( elem, "position" );

            // set position first, in-case top/left are set even on static elem
            if ( position === "static" ) {
                elem.style.position = "relative";
            }

            var curElem = jQuery( elem ),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css( elem, "top" ),
                curCSSLeft = jQuery.css( elem, "left" ),
                calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
                props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is absolute
            if ( calculatePosition ) {
                curPosition = curElem.position();
            }

            curTop  = calculatePosition ? curPosition.top  : parseInt( curCSSTop,  10 ) || 0;
            curLeft = calculatePosition ? curPosition.left : parseInt( curCSSLeft, 10 ) || 0;

            if ( jQuery.isFunction( options ) ) {
                options = options.call( elem, i, curOffset );
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ( "using" in options ) {
                options.using.call( elem, props );
            } else {
                curElem.css( props );
            }
        }
    };


    jQuery.fn.extend({
        position: function() {
            if ( !this[0] ) {
                return null;
            }

            var elem = this[0],

            // Get *real* offsetParent
                offsetParent = this.offsetParent(),

            // Get correct offsets
                offset       = this.offset(),
                parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
            offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

            // Add offsetParent borders
            parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
            parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

            // Subtract the two offsets
            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.body;
                while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent;
            });
        }
    });


// Create scrollLeft and scrollTop methods
    jQuery.each( ["Left", "Top"], function( i, name ) {
        var method = "scroll" + name;

        jQuery.fn[ method ] = function(val) {
            var elem = this[0], win;

            if ( !elem ) {
                return null;
            }

            if ( val !== undefined ) {
                // Set the scroll offset
                return this.each(function() {
                    win = getWindow( this );

                    if ( win ) {
                        win.scrollTo(
                            !i ? val : jQuery(win).scrollLeft(),
                            i ? val : jQuery(win).scrollTop()
                        );

                    } else {
                        this[ method ] = val;
                    }
                });
            } else {
                win = getWindow( elem );

                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
                    jQuery.support.boxModel && win.document.documentElement[ method ] ||
                        win.document.body[ method ] :
                    elem[ method ];
            }
        };
    });

    function getWindow( elem ) {
        return jQuery.isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
    jQuery.each([ "Height", "Width" ], function( i, name ) {

        var type = name.toLowerCase();

        // innerHeight and innerWidth
        jQuery.fn["inner" + name] = function() {
            return this[0] ?
                parseFloat( jQuery.css( this[0], type, "padding" ) ) :
                null;
        };

        // outerHeight and outerWidth
        jQuery.fn["outer" + name] = function( margin ) {
            return this[0] ?
                parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
                null;
        };

        jQuery.fn[ type ] = function( size ) {
            // Get window width or height
            var elem = this[0];
            if ( !elem ) {
                return size == null ? null : this;
            }

            if ( jQuery.isFunction( size ) ) {
                return this.each(function( i ) {
                    var self = jQuery( this );
                    self[ type ]( size.call( this, i, self[ type ]() ) );
                });
            }

            if ( jQuery.isWindow( elem ) ) {
                // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
                // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
                var docElemProp = elem.document.documentElement[ "client" + name ];
                return elem.document.compatMode === "CSS1Compat" && docElemProp ||
                    elem.document.body[ "client" + name ] || docElemProp;

                // Get document width or height
            } else if ( elem.nodeType === 9 ) {
                // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
                return Math.max(
                    elem.documentElement["client" + name],
                    elem.body["scroll" + name], elem.documentElement["scroll" + name],
                    elem.body["offset" + name], elem.documentElement["offset" + name]
                );

                // Get or set width or height on the element
            } else if ( size === undefined ) {
                var orig = jQuery.css( elem, type ),
                    ret = parseFloat( orig );

                return jQuery.isNaN( ret ) ? orig : ret;

                // Set the width or height on the element (default to pixels if value is unitless)
            } else {
                return this.css( type, typeof size === "string" ? size : size + "px" );
            }
        };

    });


})(window);
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function($) {
  window.NestedFormEvents = function() {
    this.addFields = $.proxy(this.addFields, this);
    this.removeFields = $.proxy(this.removeFields, this);
  };

  NestedFormEvents.prototype = {
    addFields: function(e) {
      // Setup
      var link      = e.currentTarget;
      var assoc     = $(link).data('association');                // Name of child
      var blueprint = $('#' + $(link).data('blueprint-id'));
      var content   = blueprint.data('blueprint');                // Fields template

      // Make the context correct by replacing <parents> with the generated ID
      // of each of the parent objects
      var context = ($(link).closest('.fields').closestChild('input, textarea, select').eq(0).attr('name') || '').replace(new RegExp('\[[a-z_]+\]$'), '');

      // context will be something like this for a brand new form:
      // project[tasks_attributes][1255929127459][assignments_attributes][1255929128105]
      // or for an edit form:
      // project[tasks_attributes][0][assignments_attributes][1]
      if (context) {
        var parentNames = context.match(/[a-z_]+_attributes(?=\]\[(new_)?\d+\])/g) || [];
        var parentIds   = context.match(/[0-9]+/g) || [];

        for(var i = 0; i < parentNames.length; i++) {
          if(parentIds[i]) {
            content = content.replace(
              new RegExp('(_' + parentNames[i] + ')_.+?_', 'g'),
              '$1_' + parentIds[i] + '_');

            content = content.replace(
              new RegExp('(\\[' + parentNames[i] + '\\])\\[.+?\\]', 'g'),
              '$1[' + parentIds[i] + ']');
          }
        }
      }

      // Make a unique ID for the new child
      var regexp  = new RegExp('new_' + assoc, 'g');
      var new_id  = this.newId();
      content     = $.trim(content.replace(regexp, new_id));

      var field = this.insertFields(content, assoc, link);
      // bubble up event upto document (through form)
      field
        .trigger({ type: 'nested:fieldAdded', field: field })
        .trigger({ type: 'nested:fieldAdded:' + assoc, field: field });
      return false;
    },
    newId: function() {
      return new Date().getTime();
    },
    insertFields: function(content, assoc, link) {
      var target = $(link).data('target');
      if (target) {
        return $(content).appendTo($(target));
      } else {
        return $(content).insertBefore(link);
      }
    },
    removeFields: function(e) {
      var $link = $(e.currentTarget),
          assoc = $link.data('association'); // Name of child to be removed
      
      var hiddenField = $link.prev('input[type=hidden]');
      hiddenField.val('1');
      
      var field = $link.closest('.fields');
      field.hide();
      
      field
        .trigger({ type: 'nested:fieldRemoved', field: field })
        .trigger({ type: 'nested:fieldRemoved:' + assoc, field: field });
      return false;
    }
  };

  window.nestedFormEvents = new NestedFormEvents();
  $(document)
    .delegate('form a.add_nested_fields',    'click', nestedFormEvents.addFields)
    .delegate('form a.remove_nested_fields', 'click', nestedFormEvents.removeFields);
})(jQuery);

// http://plugins.jquery.com/project/closestChild
/*
 * Copyright 2011, Tobias Lindig
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */
(function($) {
        $.fn.closestChild = function(selector) {
                // breadth first search for the first matched node
                if (selector && selector != '') {
                        var queue = [];
                        queue.push(this);
                        while(queue.length > 0) {
                                var node = queue.shift();
                                var children = node.children();
                                for(var i = 0; i < children.length; ++i) {
                                        var child = $(children[i]);
                                        if (child.is(selector)) {
                                                return child; //well, we found one
                                        }
                                        queue.push(child);
                                }
                        }
                }
                return $();//nothing found
        };
})(jQuery);
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, initialized, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberInitialPage, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, validateResponse, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  initialized = false;

  currentState = null;

  referer = document.location.href;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  visit = function(url) {
    if (browserSupportsPushState && browserIsntBuggy) {
      cacheCurrentPage();
      reflectNewUrl(url);
      return fetchReplacement(url);
    } else {
      return document.location.href = url;
    }
  };

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = validateResponse()) {
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(state) {
    var page;
    cacheCurrentPage();
    if (page = pageCache[state.position]) {
      if (xhr != null) {
        xhr.abort();
      }
      changePage(page.title, page.body);
      recallScrollPosition(page);
      return triggerEvent('page:restore');
    } else {
      return fetchReplacement(document.location.href);
    }
  };

  cacheCurrentPage = function() {
    rememberInitialPage();
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(10);
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== document.location.href) {
      referer = document.location.href;
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  rememberInitialPage = function() {
    if (!initialized) {
      rememberCurrentUrl();
      rememberCurrentState();
      createDocument = browserCompatibleDocumentParser();
      return initialized = true;
    }
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  validateResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, invalidContent, url;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    invalidContent = function() {
      return !xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.src || node.href);
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (clientOrServerError()) {
      url = document.location.href;
      window.history.replaceState(null, '', '#');
      window.location.replace(url);
      return false;
    } else if (invalidContent() || assetsChanged((doc = createDocument(xhr.responseText)))) {
      window.location.reload();
      return false;
    } else {
      return doc;
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        visit(link.href);
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var _ref1;
      if ((_ref1 = event.state) != null ? _ref1.turbolinks : void 0) {
        return fetchHistory(event.state);
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    initializeTurbolinks();
  }

  this.Turbolinks = {
    visit: visit
  };

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*!
 * jQuery JavaScript Library v1.5
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Jan 31 08:31:29 2011 -0500
 */

(function(a,b){function b$(a){return d.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function bX(a){if(!bR[a]){var b=d("<"+a+">").appendTo("body"),c=b.css("display");b.remove();if(c==="none"||c==="")c="block";bR[a]=c}return bR[a]}function bW(a,b){var c={};d.each(bV.concat.apply([],bV.slice(0,b)),function(){c[this]=a});return c}function bJ(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var e=a.dataTypes,f=a.converters,g,h=e.length,i,j=e[0],k,l,m,n,o;for(g=1;g<h;g++){k=j,j=e[g];if(j==="*")j=k;else if(k!=="*"&&k!==j){l=k+" "+j,m=f[l]||f["* "+j];if(!m){o=b;for(n in f){i=n.split(" ");if(i[0]===k||i[0]==="*"){o=f[i[1]+" "+j];if(o){n=f[n],n===!0?m=o:o===!0&&(m=n);break}}}}!m&&!o&&d.error("No conversion from "+l.replace(" "," to ")),m!==!0&&(c=m?m(c):o(n(c)))}}return c}function bI(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function bH(a,b,c,e){d.isArray(b)&&b.length?d.each(b,function(b,f){c||bp.test(a)?e(a,f):bH(a+"["+(typeof f==="object"||d.isArray(f)?b:"")+"]",f,c,e)}):c||b==null||typeof b!=="object"?e(a,b):d.isArray(b)||d.isEmptyObject(b)?e(a,""):d.each(b,function(b,d){bH(a+"["+b+"]",d,c,e)})}function bG(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bD,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l==="string"&&(g[l]?l=b:(c.dataTypes.unshift(l),l=bG(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bG(a,c,d,e,"*",g));return l}function bF(a){return function(b,c){typeof b!=="string"&&(c=b,b="*");if(d.isFunction(c)){var e=b.toLowerCase().split(bz),f=0,g=e.length,h,i,j;for(;f<g;f++)h=e[f],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bn(a,b,c){var e=b==="width"?bh:bi,f=b==="width"?a.offsetWidth:a.offsetHeight;if(c==="border")return f;d.each(e,function(){c||(f-=parseFloat(d.css(a,"padding"+this))||0),c==="margin"?f+=parseFloat(d.css(a,"margin"+this))||0:f-=parseFloat(d.css(a,"border"+this+"Width"))||0});return f}function _(a,b){b.src?d.ajax({url:b.src,async:!1,dataType:"script"}):d.globalEval(b.text||b.textContent||b.innerHTML||""),b.parentNode&&b.parentNode.removeChild(b)}function $(a,b){if(b.nodeType===1){var c=b.nodeName.toLowerCase();b.clearAttributes(),b.mergeAttributes(a);if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(d.expando)}}function Z(a,b){if(b.nodeType===1&&d.hasData(a)){var c=d.expando,e=d.data(a),f=d.data(b,e);if(e=e[c]){var g=e.events;f=f[c]=d.extend({},e);if(g){delete f.handle,f.events={};for(var h in g)for(var i=0,j=g[h].length;i<j;i++)d.event.add(b,h,g[h][i],g[h][i].data)}}}}function Y(a,b){return d.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function O(a,b,c){if(d.isFunction(b))return d.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return d.grep(a,function(a,d){return a===b===c});if(typeof b==="string"){var e=d.grep(a,function(a){return a.nodeType===1});if(J.test(b))return d.filter(b,e,!c);b=d.filter(b,e)}return d.grep(a,function(a,e){return d.inArray(a,b)>=0===c})}function N(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function F(a,b){return(a&&a!=="*"?a+".":"")+b.replace(q,"`").replace(r,"&")}function E(a){var b,c,e,f,g,h,i,j,k,l,m,n,p,q=[],r=[],s=d._data(this,u);typeof s==="function"&&(s=s.events);if(a.liveFired!==this&&s&&s.live&&!a.target.disabled&&(!a.button||a.type!=="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;var t=s.live.slice(0);for(i=0;i<t.length;i++)g=t[i],g.origType.replace(o,"")===a.type?r.push(g.selector):t.splice(i--,1);f=d(a.target).closest(r,a.currentTarget);for(j=0,k=f.length;j<k;j++){m=f[j];for(i=0;i<t.length;i++){g=t[i];if(m.selector===g.selector&&(!n||n.test(g.namespace))){h=m.elem,e=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,e=d(a.relatedTarget).closest(g.selector)[0];(!e||e!==h)&&q.push({elem:h,handleObj:g,level:m.level})}}}for(j=0,k=q.length;j<k;j++){f=q[j];if(c&&f.level>c)break;a.currentTarget=f.elem,a.data=f.handleObj.data,a.handleObj=f.handleObj,p=f.handleObj.origHandler.apply(f.elem,arguments);if(p===!1||a.isPropagationStopped()){c=f.level,p===!1&&(b=!1);if(a.isImmediatePropagationStopped())break}}return b}}function C(a,b,c){c[0].type=a;return d.event.handle.apply(b,c)}function w(){return!0}function v(){return!1}function f(a,c,f){if(f===b&&a.nodeType===1){f=a.getAttribute("data-"+c);if(typeof f==="string"){try{f=f==="true"?!0:f==="false"?!1:f==="null"?null:d.isNaN(f)?e.test(f)?d.parseJSON(f):f:parseFloat(f)}catch(g){}d.data(a,c,f)}else f=b}return f}var c=a.document,d=function(){function I(){if(!d.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(I,1);return}d.ready()}}var d=function(a,b){return new d.fn.init(a,b,g)},e=a.jQuery,f=a.$,g,h=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,i=/\S/,j=/^\s+/,k=/\s+$/,l=/\d/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=navigator.userAgent,w,x=!1,y,z="then done fail isResolved isRejected promise".split(" "),A,B=Object.prototype.toString,C=Object.prototype.hasOwnProperty,D=Array.prototype.push,E=Array.prototype.slice,F=String.prototype.trim,G=Array.prototype.indexOf,H={};d.fn=d.prototype={constructor:d,init:function(a,e,f){var g,i,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!e&&c.body){this.context=c,this[0]=c.body,this.selector="body",this.length=1;return this}if(typeof a==="string"){g=h.exec(a);if(!g||!g[1]&&e)return!e||e.jquery?(e||f).find(a):this.constructor(e).find(a);if(g[1]){e=e instanceof d?e[0]:e,k=e?e.ownerDocument||e:c,j=m.exec(a),j?d.isPlainObject(e)?(a=[c.createElement(j[1])],d.fn.attr.call(a,e,!0)):a=[k.createElement(j[1])]:(j=d.buildFragment([g[1]],[k]),a=(j.cacheable?d.clone(j.fragment):j.fragment).childNodes);return d.merge(this,a)}i=c.getElementById(g[2]);if(i&&i.parentNode){if(i.id!==g[2])return f.find(a);this.length=1,this[0]=i}this.context=c,this.selector=a;return this}if(d.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return d.makeArray(a,this)},selector:"",jquery:"1.5",length:0,size:function(){return this.length},toArray:function(){return E.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var e=this.constructor();d.isArray(a)?D.apply(e,a):d.merge(e,a),e.prevObject=this,e.context=this.context,b==="find"?e.selector=this.selector+(this.selector?" ":"")+c:b&&(e.selector=this.selector+"."+b+"("+c+")");return e},each:function(a,b){return d.each(this,a,b)},ready:function(a){d.bindReady(),y.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(E.apply(this,arguments),"slice",E.call(arguments).join(","))},map:function(a){return this.pushStack(d.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:D,sort:[].sort,splice:[].splice},d.fn.init.prototype=d.fn,d.extend=d.fn.extend=function(){var a,c,e,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i==="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!=="object"&&!d.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){e=i[c],f=a[c];if(i===f)continue;l&&f&&(d.isPlainObject(f)||(g=d.isArray(f)))?(g?(g=!1,h=e&&d.isArray(e)?e:[]):h=e&&d.isPlainObject(e)?e:{},i[c]=d.extend(l,h,f)):f!==b&&(i[c]=f)}return i},d.extend({noConflict:function(b){a.$=f,b&&(a.jQuery=e);return d},isReady:!1,readyWait:1,ready:function(a){a===!0&&d.readyWait--;if(!d.readyWait||a!==!0&&!d.isReady){if(!c.body)return setTimeout(d.ready,1);d.isReady=!0;if(a!==!0&&--d.readyWait>0)return;y.resolveWith(c,[d]),d.fn.trigger&&d(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!x){x=!0;if(c.readyState==="complete")return setTimeout(d.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",A,!1),a.addEventListener("load",d.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",A),a.attachEvent("onload",d.ready);var b=!1;try{b=a.frameElement==null}catch(e){}c.documentElement.doScroll&&b&&I()}}},isFunction:function(a){return d.type(a)==="function"},isArray:Array.isArray||function(a){return d.type(a)==="array"},isWindow:function(a){return a&&typeof a==="object"&&"setInterval"in a},isNaN:function(a){return a==null||!l.test(a)||isNaN(a)},type:function(a){return a==null?String(a):H[B.call(a)]||"object"},isPlainObject:function(a){if(!a||d.type(a)!=="object"||a.nodeType||d.isWindow(a))return!1;if(a.constructor&&!C.call(a,"constructor")&&!C.call(a.constructor.prototype,"isPrototypeOf"))return!1;var c;for(c in a){}return c===b||C.call(a,c)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!=="string"||!b)return null;b=d.trim(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return a.JSON&&a.JSON.parse?a.JSON.parse(b):(new Function("return "+b))();d.error("Invalid JSON: "+b)},parseXML:function(b,c,e){a.DOMParser?(e=new DOMParser,c=e.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b)),e=c.documentElement,(!e||!e.nodeName||e.nodeName==="parsererror")&&d.error("Invalid XML: "+b);return c},noop:function(){},globalEval:function(a){if(a&&i.test(a)){var b=c.getElementsByTagName("head")[0]||c.documentElement,e=c.createElement("script");e.type="text/javascript",d.support.scriptEval()?e.appendChild(c.createTextNode(a)):e.text=a,b.insertBefore(e,b.firstChild),b.removeChild(e)}},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,e){var f,g=0,h=a.length,i=h===b||d.isFunction(a);if(e){if(i){for(f in a)if(c.apply(a[f],e)===!1)break}else for(;g<h;)if(c.apply(a[g++],e)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(var j=a[0];g<h&&c.call(j,g,j)!==!1;j=a[++g]){}return a},trim:F?function(a){return a==null?"":F.call(a)}:function(a){return a==null?"":(a+"").replace(j,"").replace(k,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var e=d.type(a);a.length==null||e==="string"||e==="function"||e==="regexp"||d.isWindow(a)?D.call(c,a):d.merge(c,a)}return c},inArray:function(a,b){if(b.indexOf)return b.indexOf(a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length==="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,b,c){var d=[],e;for(var f=0,g=a.length;f<g;f++)e=b(a[f],f,c),e!=null&&(d[d.length]=e);return d.concat.apply([],d)},guid:1,proxy:function(a,c,e){arguments.length===2&&(typeof c==="string"?(e=a,a=e[c],c=b):c&&!d.isFunction(c)&&(e=c,c=b)),!c&&a&&(c=function(){return a.apply(e||this,arguments)}),a&&(c.guid=a.guid=a.guid||c.guid||d.guid++);return c},access:function(a,c,e,f,g,h){var i=a.length;if(typeof c==="object"){for(var j in c)d.access(a,j,c[j],f,g,e);return a}if(e!==b){f=!h&&f&&d.isFunction(e);for(var k=0;k<i;k++)g(a[k],c,f?e.call(a[k],k,g(a[k],c)):e,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},_Deferred:function(){var a=[],b,c,e,f={done:function(){if(!e){var c=arguments,g,h,i,j,k;b&&(k=b,b=0);for(g=0,h=c.length;g<h;g++)i=c[g],j=d.type(i),j==="array"?f.done.apply(f,i):j==="function"&&a.push(i);k&&f.resolveWith(k[0],k[1])}return this},resolveWith:function(d,f){if(!e&&!b&&!c){c=1;try{while(a[0])a.shift().apply(d,f)}finally{b=[d,f],c=0}}return this},resolve:function(){f.resolveWith(d.isFunction(this.promise)?this.promise():this,arguments);return this},isResolved:function(){return c||b},cancel:function(){e=1,a=[];return this}};return f},Deferred:function(a){var b=d._Deferred(),c=d._Deferred(),e;d.extend(b,{then:function(a,c){b.done(a).fail(c);return this},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,promise:function(a,c){if(a==null){if(e)return e;e=a={}}c=z.length;while(c--)a[z[c]]=b[z[c]];return a}}),b.then(c.cancel,b.cancel),delete b.cancel,a&&a.call(b,b);return b},when:function(a){var b=arguments,c=b.length,e=c<=1&&a&&d.isFunction(a.promise)?a:d.Deferred(),f=e.promise(),g;c>1?(g=Array(c),d.each(b,function(a,b){d.when(b).then(function(b){g[a]=arguments.length>1?E.call(arguments,0):b,--c||e.resolveWith(f,g)},e.reject)})):e!==a&&e.resolve(a);return f},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}d.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.subclass=this.subclass,a.fn.init=function b(b,c){c&&c instanceof d&&!(c instanceof a)&&(c=a(c));return d.fn.init.call(this,b,c,e)},a.fn.init.prototype=a.fn;var e=a(c);return a},browser:{}}),y=d._Deferred(),d.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){H["[object "+b+"]"]=b.toLowerCase()}),w=d.uaMatch(v),w.browser&&(d.browser[w.browser]=!0,d.browser.version=w.version),d.browser.webkit&&(d.browser.safari=!0),G&&(d.inArray=function(a,b){return G.call(b,a)}),i.test(" ")&&(j=/^[\s\xA0]+/,k=/[\s\xA0]+$/),g=d(c),c.addEventListener?A=function(){c.removeEventListener("DOMContentLoaded",A,!1),d.ready()}:c.attachEvent&&(A=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",A),d.ready())});return a.jQuery=a.$=d}();(function(){d.support={};var b=c.createElement("div");b.style.display="none",b.innerHTML=" <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var e=b.getElementsByTagName("*"),f=b.getElementsByTagName("a")[0],g=c.createElement("select"),h=g.appendChild(c.createElement("option"));if(e&&e.length&&f){d.support={leadingWhitespace:b.firstChild.nodeType===3,tbody:!b.getElementsByTagName("tbody").length,htmlSerialize:!!b.getElementsByTagName("link").length,style:/red/.test(f.getAttribute("style")),hrefNormalized:f.getAttribute("href")==="/a",opacity:/^0.55$/.test(f.style.opacity),cssFloat:!!f.style.cssFloat,checkOn:b.getElementsByTagName("input")[0].value==="on",optSelected:h.selected,deleteExpando:!0,optDisabled:!1,checkClone:!1,_scriptEval:null,noCloneEvent:!0,boxModel:null,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableHiddenOffsets:!0},g.disabled=!0,d.support.optDisabled=!h.disabled,d.support.scriptEval=function(){if(d.support._scriptEval===null){var b=c.documentElement,e=c.createElement("script"),f="script"+d.now();e.type="text/javascript";try{e.appendChild(c.createTextNode("window."+f+"=1;"))}catch(g){}b.insertBefore(e,b.firstChild),a[f]?(d.support._scriptEval=!0,delete a[f]):d.support._scriptEval=!1,b.removeChild(e),b=e=f=null}return d.support._scriptEval};try{delete b.test}catch(i){d.support.deleteExpando=!1}b.attachEvent&&b.fireEvent&&(b.attachEvent("onclick",function j(){d.support.noCloneEvent=!1,b.detachEvent("onclick",j)}),b.cloneNode(!0).fireEvent("onclick")),b=c.createElement("div"),b.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";var k=c.createDocumentFragment();k.appendChild(b.firstChild),d.support.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,d(function(){var a=c.createElement("div"),b=c.getElementsByTagName("body")[0];if(b){a.style.width=a.style.paddingLeft="1px",b.appendChild(a),d.boxModel=d.support.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,d.support.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",d.support.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";var e=a.getElementsByTagName("td");d.support.reliableHiddenOffsets=e[0].offsetHeight===0,e[0].style.display="",e[1].style.display="none",d.support.reliableHiddenOffsets=d.support.reliableHiddenOffsets&&e[0].offsetHeight===0,a.innerHTML="",b.removeChild(a).style.display="none",a=e=null}});var l=function(a){var b=c.createElement("div");a="on"+a;if(!b.attachEvent)return!0;var d=a in b;d||(b.setAttribute(a,"return;"),d=typeof b[a]==="function"),b=null;return d};d.support.submitBubbles=l("submit"),d.support.changeBubbles=l("change"),b=e=f=null}})();var e=/^(?:\{.*\}|\[.*\])$/;d.extend({cache:{},uuid:0,expando:"jQuery"+(d.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?d.cache[a[d.expando]]:a[d.expando];return!!a&&!d.isEmptyObject(a)},data:function(a,c,e,f){if(d.acceptData(a)){var g=d.expando,h=typeof c==="string",i,j=a.nodeType,k=j?d.cache:a,l=j?a[d.expando]:a[d.expando]&&d.expando;if((!l||f&&l&&!k[l][g])&&h&&e===b)return;l||(j?a[d.expando]=l=++d.uuid:l=d.expando),k[l]||(k[l]={}),typeof c==="object"&&(f?k[l][g]=d.extend(k[l][g],c):k[l]=d.extend(k[l],c)),i=k[l],f&&(i[g]||(i[g]={}),i=i[g]),e!==b&&(i[c]=e);if(c==="events"&&!i[c])return i[g]&&i[g].events;return h?i[c]:i}},removeData:function(b,c,e){if(d.acceptData(b)){var f=d.expando,g=b.nodeType,h=g?d.cache:b,i=g?b[d.expando]:d.expando;if(!h[i])return;if(c){var j=e?h[i][f]:h[i];if(j){delete j[c];if(!d.isEmptyObject(j))return}}if(e){delete h[i][f];if(!d.isEmptyObject(h[i]))return}var k=h[i][f];d.support.deleteExpando||h!=a?delete h[i]:h[i]=null,k?(h[i]={},h[i][f]=k):g&&(d.support.deleteExpando?delete b[d.expando]:b.removeAttribute?b.removeAttribute(d.expando):b[d.expando]=null)}},_data:function(a,b,c){return d.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=d.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),d.fn.extend({data:function(a,c){var e=null;if(typeof a==="undefined"){if(this.length){e=d.data(this[0]);if(this[0].nodeType===1){var g=this[0].attributes,h;for(var i=0,j=g.length;i<j;i++)h=g[i].name,h.indexOf("data-")===0&&(h=h.substr(5),f(this[0],h,e[h]))}}return e}if(typeof a==="object")return this.each(function(){d.data(this,a)});var k=a.split(".");k[1]=k[1]?"."+k[1]:"";if(c===b){e=this.triggerHandler("getData"+k[1]+"!",[k[0]]),e===b&&this.length&&(e=d.data(this[0],a),e=f(this[0],a,e));return e===b&&k[1]?this.data(k[0]):e}return this.each(function(){var b=d(this),e=[k[0],c];b.triggerHandler("setData"+k[1]+"!",e),d.data(this,a,c),b.triggerHandler("changeData"+k[1]+"!",e)})},removeData:function(a){return this.each(function(){d.removeData(this,a)})}}),d.extend({queue:function(a,b,c){if(a){b=(b||"fx")+"queue";var e=d._data(a,b);if(!c)return e||[];!e||d.isArray(c)?e=d._data(a,b,d.makeArray(c)):e.push(c);return e}},dequeue:function(a,b){b=b||"fx";var c=d.queue(a,b),e=c.shift();e==="inprogress"&&(e=c.shift()),e&&(b==="fx"&&c.unshift("inprogress"),e.call(a,function(){d.dequeue(a,b)})),c.length||d.removeData(a,b+"queue",!0)}}),d.fn.extend({queue:function(a,c){typeof a!=="string"&&(c=a,a="fx");if(c===b)return d.queue(this[0],a);return this.each(function(b){var e=d.queue(this,a,c);a==="fx"&&e[0]!=="inprogress"&&d.dequeue(this,a)})},dequeue:function(a){return this.each(function(){d.dequeue(this,a)})},delay:function(a,b){a=d.fx?d.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(){var c=this;setTimeout(function(){d.dequeue(c,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var g=/[\n\t\r]/g,h=/\s+/,i=/\r/g,j=/^(?:href|src|style)$/,k=/^(?:button|input)$/i,l=/^(?:button|input|object|select|textarea)$/i,m=/^a(?:rea)?$/i,n=/^(?:radio|checkbox)$/i;d.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"},d.fn.extend({attr:function(a,b){return d.access(this,a,b,!0,d.attr)},removeAttr:function(a,b){return this.each(function(){d.attr(this,a,""),this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.addClass(a.call(this,b,c.attr("class")))});if(a&&typeof a==="string"){var b=(a||"").split(h);for(var c=0,e=this.length;c<e;c++){var f=this[c];if(f.nodeType===1)if(f.className){var g=" "+f.className+" ",i=f.className;for(var j=0,k=b.length;j<k;j++)g.indexOf(" "+b[j]+" ")<0&&(i+=" "+b[j]);f.className=d.trim(i)}else f.className=a}}return this},removeClass:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.removeClass(a.call(this,b,c.attr("class")))});if(a&&typeof a==="string"||a===b){var c=(a||"").split(h);for(var e=0,f=this.length;e<f;e++){var i=this[e];if(i.nodeType===1&&i.className)if(a){var j=(" "+i.className+" ").replace(g," ");for(var k=0,l=c.length;k<l;k++)j=j.replace(" "+c[k]+" "," ");i.className=d.trim(j)}else i.className=""}}return this},toggleClass:function(a,b){var c=typeof a,e=typeof b==="boolean";if(d.isFunction(a))return this.each(function(c){var e=d(this);e.toggleClass(a.call(this,c,e.attr("class"),b),b)});return this.each(function(){if(c==="string"){var f,g=0,i=d(this),j=b,k=a.split(h);while(f=k[g++])j=e?j:!i.hasClass(f),i[j?"addClass":"removeClass"](f)}else if(c==="undefined"||c==="boolean")this.className&&d._data(this,"__className__",this.className),this.className=this.className||a===!1?"":d._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ";for(var c=0,d=this.length;c<d;c++)if((" "+this[c].className+" ").replace(g," ").indexOf(b)>-1)return!0;return!1},val:function(a){if(!arguments.length){var c=this[0];if(c){if(d.nodeName(c,"option")){var e=c.attributes.value;return!e||e.specified?c.value:c.text}if(d.nodeName(c,"select")){var f=c.selectedIndex,g=[],h=c.options,j=c.type==="select-one";if(f<0)return null;for(var k=j?f:0,l=j?f+1:h.length;k<l;k++){var m=h[k];if(m.selected&&(d.support.optDisabled?!m.disabled:m.getAttribute("disabled")===null)&&(!m.parentNode.disabled||!d.nodeName(m.parentNode,"optgroup"))){a=d(m).val();if(j)return a;g.push(a)}}return g}if(n.test(c.type)&&!d.support.checkOn)return c.getAttribute("value")===null?"on":c.value;return(c.value||"").replace(i,"")}return b}var o=d.isFunction(a);return this.each(function(b){var c=d(this),e=a;if(this.nodeType===1){o&&(e=a.call(this,b,c.val())),e==null?e="":typeof e==="number"?e+="":d.isArray(e)&&(e=d.map(e,function(a){return a==null?"":a+""}));if(d.isArray(e)&&n.test(this.type))this.checked=d.inArray(c.val(),e)>=0;else if(d.nodeName(this,"select")){var f=d.makeArray(e);d("option",this).each(function(){this.selected=d.inArray(d(this).val(),f)>=0}),f.length||(this.selectedIndex=-1)}else this.value=e}})}}),d.extend({attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,e,f){if(!a||a.nodeType===3||a.nodeType===8||a.nodeType===2)return b;if(f&&c in d.attrFn)return d(a)[c](e);var g=a.nodeType!==1||!d.isXMLDoc(a),h=e!==b;c=g&&d.props[c]||c;if(a.nodeType===1){var i=j.test(c);if(c==="selected"&&!d.support.optSelected){var n=a.parentNode;n&&(n.selectedIndex,n.parentNode&&n.parentNode.selectedIndex)}if((c in a||a[c]!==b)&&g&&!i){h&&(c==="type"&&k.test(a.nodeName)&&a.parentNode&&d.error("type property can't be changed"),e===null?a.nodeType===1&&a.removeAttribute(c):a[c]=e);if(d.nodeName(a,"form")&&a.getAttributeNode(c))return a.getAttributeNode(c).nodeValue;if(c==="tabIndex"){var o=a.getAttributeNode("tabIndex");return o&&o.specified?o.value:l.test(a.nodeName)||m.test(a.nodeName)&&a.href?0:b}return a[c]}if(!d.support.style&&g&&c==="style"){h&&(a.style.cssText=""+e);return a.style.cssText}h&&a.setAttribute(c,""+e);if(!a.attributes[c]&&(a.hasAttribute&&!a.hasAttribute(c)))return b;var p=!d.support.hrefNormalized&&g&&i?a.getAttribute(c,2):a.getAttribute(c);return p===null?b:p}h&&(a[c]=e);return a[c]}});var o=/\.(.*)$/,p=/^(?:textarea|input|select)$/i,q=/\./g,r=/ /g,s=/[^\w\s.|`]/g,t=function(a){return a.replace(s,"\\$&")},u="events";d.event={add:function(c,e,f,g){if(c.nodeType!==3&&c.nodeType!==8){d.isWindow(c)&&(c!==a&&!c.frameElement)&&(c=a);if(f===!1)f=v;else if(!f)return;var h,i;f.handler&&(h=f,f=h.handler),f.guid||(f.guid=d.guid++);var j=d._data(c);if(!j)return;var k=j[u],l=j.handle;typeof k==="function"?(l=k.handle,k=k.events):k||(c.nodeType||(j[u]=j=function(){}),j.events=k={}),l||(j.handle=l=function(){return typeof d!=="undefined"&&!d.event.triggered?d.event.handle.apply(l.elem,arguments):b}),l.elem=c,e=e.split(" ");var m,n=0,o;while(m=e[n++]){i=h?d.extend({},h):{handler:f,data:g},m.indexOf(".")>-1?(o=m.split("."),m=o.shift(),i.namespace=o.slice(0).sort().join(".")):(o=[],i.namespace=""),i.type=m,i.guid||(i.guid=f.guid);var p=k[m],q=d.event.special[m]||{};if(!p){p=k[m]=[];if(!q.setup||q.setup.call(c,g,o,l)===!1)c.addEventListener?c.addEventListener(m,l,!1):c.attachEvent&&c.attachEvent("on"+m,l)}q.add&&(q.add.call(c,i),i.handler.guid||(i.handler.guid=f.guid)),p.push(i),d.event.global[m]=!0}c=null}},global:{},remove:function(a,c,e,f){if(a.nodeType!==3&&a.nodeType!==8){e===!1&&(e=v);var g,h,i,j,k=0,l,m,n,o,p,q,r,s=d.hasData(a)&&d._data(a),w=s&&s[u];if(!s||!w)return;typeof w==="function"&&(s=w,w=w.events),c&&c.type&&(e=c.handler,c=c.type);if(!c||typeof c==="string"&&c.charAt(0)==="."){c=c||"";for(h in w)d.event.remove(a,h+c);return}c=c.split(" ");while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+d.map(m.slice(0).sort(),t).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=w[h];if(!p)continue;if(!e){for(j=0;j<p.length;j++){q=p[j];if(l||n.test(q.namespace))d.event.remove(a,r,q.handler,j),p.splice(j--,1)}continue}o=d.event.special[h]||{};for(j=f||0;j<p.length;j++){q=p[j];if(e.guid===q.guid){if(l||n.test(q.namespace))f==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);if(f!=null)break}}if(p.length===0||f!=null&&p.length===1)(!o.teardown||o.teardown.call(a,m)===!1)&&d.removeEvent(a,h,s.handle),g=null,delete w[h]}if(d.isEmptyObject(w)){var x=s.handle;x&&(x.elem=null),delete s.events,delete s.handle,typeof s==="function"?d.removeData(a,u,!0):d.isEmptyObject(s)&&d.removeData(a,b,!0)}}},trigger:function(a,c,e){var f=a.type||a,g=arguments[3];if(!g){a=typeof a==="object"?a[d.expando]?a:d.extend(d.Event(f),a):d.Event(f),f.indexOf("!")>=0&&(a.type=f=f.slice(0,-1),a.exclusive=!0),e||(a.stopPropagation(),d.event.global[f]&&d.each(d.cache,function(){var b=d.expando,e=this[b];e&&e.events&&e.events[f]&&d.event.trigger(a,c,e.handle.elem)}));if(!e||e.nodeType===3||e.nodeType===8)return b;a.result=b,a.target=e,c=d.makeArray(c),c.unshift(a)}a.currentTarget=e;var h=e.nodeType?d._data(e,"handle"):(d._data(e,u)||{}).handle;h&&h.apply(e,c);var i=e.parentNode||e.ownerDocument;try{e&&e.nodeName&&d.noData[e.nodeName.toLowerCase()]||e["on"+f]&&e["on"+f].apply(e,c)===!1&&(a.result=!1,a.preventDefault())}catch(j){}if(!a.isPropagationStopped()&&i)d.event.trigger(a,c,i,!0);else if(!a.isDefaultPrevented()){var k,l=a.target,m=f.replace(o,""),n=d.nodeName(l,"a")&&m==="click",p=d.event.special[m]||{};if((!p._default||p._default.call(e,a)===!1)&&!n&&!(l&&l.nodeName&&d.noData[l.nodeName.toLowerCase()])){try{l[m]&&(k=l["on"+m],k&&(l["on"+m]=null),d.event.triggered=!0,l[m]())}catch(q){}k&&(l["on"+m]=k),d.event.triggered=!1}}},handle:function(c){var e,f,g,h,i,j=[],k=d.makeArray(arguments);c=k[0]=d.event.fix(c||a.event),c.currentTarget=this,e=c.type.indexOf(".")<0&&!c.exclusive,e||(g=c.type.split("."),c.type=g.shift(),j=g.slice(0).sort(),h=new RegExp("(^|\\.)"+j.join("\\.(?:.*\\.)?")+"(\\.|$)")),c.namespace=c.namespace||j.join("."),i=d._data(this,u),typeof i==="function"&&(i=i.events),f=(i||{})[c.type];if(i&&f){f=f.slice(0);for(var l=0,m=f.length;l<m;l++){var n=f[l];if(e||h.test(n.namespace)){c.handler=n.handler,c.data=n.data,c.handleObj=n;var o=n.handler.apply(this,k);o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()));if(c.isImmediatePropagationStopped())break}}}return c.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[d.expando])return a;var e=a;a=d.Event(e);for(var f=this.props.length,g;f;)g=this.props[--f],a[g]=e[g];a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=c.documentElement,i=c.body;a.pageX=a.clientX+(h&&h.scrollLeft||i&&i.scrollLeft||0)-(h&&h.clientLeft||i&&i.clientLeft||0),a.pageY=a.clientY+(h&&h.scrollTop||i&&i.scrollTop||0)-(h&&h.clientTop||i&&i.clientTop||0)}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1e8,proxy:d.proxy,special:{ready:{setup:d.bindReady,teardown:d.noop},live:{add:function(a){d.event.add(this,F(a.origType,a.selector),d.extend({},a,{handler:E,guid:a.handler.guid}))},remove:function(a){d.event.remove(this,F(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,c){d.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}},d.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},d.Event=function(a){if(!this.preventDefault)return new d.Event(a);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?w:v):this.type=a,this.timeStamp=d.now(),this[d.expando]=!0},d.Event.prototype={preventDefault:function(){this.isDefaultPrevented=w;var a=this.originalEvent;a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=w;var a=this.originalEvent;a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=w,this.stopPropagation()},isDefaultPrevented:v,isPropagationStopped:v,isImmediatePropagationStopped:v};var x=function(a){var b=a.relatedTarget;try{while(b&&b!==this)b=b.parentNode;b!==this&&(a.type=a.data,d.event.handle.apply(this,arguments))}catch(c){}},y=function(a){a.type=a.data,d.event.handle.apply(this,arguments)};d.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){d.event.special[a]={setup:function(c){d.event.add(this,b,c&&c.selector?y:x,a)},teardown:function(a){d.event.remove(this,b,a&&a.selector?y:x)}}}),d.support.submitBubbles||(d.event.special.submit={setup:function(a,c){if(this.nodeName&&this.nodeName.toLowerCase()!=="form")d.event.add(this,"click.specialSubmit",function(a){var c=a.target,e=c.type;if((e==="submit"||e==="image")&&d(c).closest("form").length){a.liveFired=b;return C("submit",this,arguments)}}),d.event.add(this,"keypress.specialSubmit",function(a){var c=a.target,e=c.type;if((e==="text"||e==="password")&&d(c).closest("form").length&&a.keyCode===13){a.liveFired=b;return C("submit",this,arguments)}});else return!1},teardown:function(a){d.event.remove(this,".specialSubmit")}});if(!d.support.changeBubbles){var z,A=function(a){var b=a.type,c=a.value;b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?d.map(a.options,function(a){return a.selected}).join("-"):"":a.nodeName.toLowerCase()==="select"&&(c=a.selectedIndex);return c},B=function B(a){var c=a.target,e,f;if(p.test(c.nodeName)&&!c.readOnly){e=d._data(c,"_change_data"),f=A(c),(a.type!=="focusout"||c.type!=="radio")&&d._data(c,"_change_data",f);if(e===b||f===e)return;if(e!=null||f){a.type="change",a.liveFired=b;return d.event.trigger(a,arguments[1],c)}}};d.event.special.change={filters:{focusout:B,beforedeactivate:B,click:function(a){var b=a.target,c=b.type;if(c==="radio"||c==="checkbox"||b.nodeName.toLowerCase()==="select")return B.call(this,a)},keydown:function(a){var b=a.target,c=b.type;if(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")return B.call(this,a)},beforeactivate:function(a){var b=a.target;d._data(b,"_change_data",A(b))}},setup:function(a,b){if(this.type==="file")return!1;for(var c in z)d.event.add(this,c+".specialChange",z[c]);return p.test(this.nodeName)},teardown:function(a){d.event.remove(this,".specialChange");return p.test(this.nodeName)}},z=d.event.special.change.filters,z.focus=z.beforeactivate}c.addEventListener&&d.each({focus:"focusin",blur:"focusout"},function(a,b){function c(a){a=d.event.fix(a),a.type=b;return d.event.handle.call(this,a)}d.event.special[b]={setup:function(){this.addEventListener(a,c,!0)},teardown:function(){this.removeEventListener(a,c,!0)}}}),d.each(["bind","one"],function(a,c){d.fn[c]=function(a,e,f){if(typeof a==="object"){for(var g in a)this[c](g,e,a[g],f);return this}if(d.isFunction(e)||e===!1)f=e,e=b;var h=c==="one"?d.proxy(f,function(a){d(this).unbind(a,h);return f.apply(this,arguments)}):f;if(a==="unload"&&c!=="one")this.one(a,e,f);else for(var i=0,j=this.length;i<j;i++)d.event.add(this[i],a,h,e);return this}}),d.fn.extend({unbind:function(a,b){if(typeof a!=="object"||a.preventDefault)for(var e=0,f=this.length;e<f;e++)d.event.remove(this[e],a,b);else for(var c in a)this.unbind(c,a[c]);return this},delegate:function(a,b,c,d){return this.live(b,c,d,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){d.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){var c=d.Event(a);c.preventDefault(),c.stopPropagation(),d.event.trigger(c,b,this[0]);return c.result}},toggle:function(a){var b=arguments,c=1;while(c<b.length)d.proxy(a,b[c++]);return this.click(d.proxy(a,function(e){var f=(d._data(this,"lastToggle"+a.guid)||0)%c;d._data(this,"lastToggle"+a.guid,f+1),e.preventDefault();return b[f].apply(this,arguments)||!1}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var D={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};d.each(["live","die"],function(a,c){d.fn[c]=function(a,e,f,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:d(this.context);if(typeof a==="object"&&!a.preventDefault){for(var p in a)n[c](p,e,a[p],m);return this}d.isFunction(e)&&(f=e,e=b),a=(a||"").split(" ");while((h=a[i++])!=null){j=o.exec(h),k="",j&&(k=j[0],h=h.replace(o,""));if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);continue}l=h,h==="focus"||h==="blur"?(a.push(D[h]+k),h=h+k):h=(D[h]||h)+k;if(c==="live")for(var q=0,r=n.length;q<r;q++)d.event.add(n[q],"live."+F(h,m),{data:e,selector:m,handler:f,origType:h,origHandler:f,preType:l});else n.unbind("live."+F(h,m),f)}return this}}),d.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){d.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},d.attrFn&&(d.attrFn[b]=!0)}),function(){function s(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var j=d[g];if(j){var k=!1;j=j[a];while(j){if(j.sizcache===c){k=d[j.sizset];break}if(j.nodeType===1){f||(j.sizcache=c,j.sizset=g);if(typeof b!=="string"){if(j===b){k=!0;break}}else if(i.filter(b,[j]).length>0){k=j;break}}j=j[a]}d[g]=k}}}function r(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);if(i.nodeName.toLowerCase()===b){j=i;break}i=i[a]}d[g]=j}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e=0,f=Object.prototype.toString,g=!1,h=!0;[0,0].sort(function(){h=!1;return 0});var i=function(b,d,e,g){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!=="string")return e;var l,m,o,p,q,r,s,u,v=!0,w=i.isXML(d),x=[],y=b;do{a.exec(""),l=a.exec(y);if(l){y=l[3],x.push(l[1]);if(l[2]){p=l[3];break}}}while(l);if(x.length>1&&k.exec(b))if(x.length===2&&j.relative[x[0]])m=t(x[0]+x[1],d);else{m=j.relative[x[0]]?[d]:i(x.shift(),d);while(x.length)b=x.shift(),j.relative[b]&&(b+=x.shift()),m=t(b,m)}else{!g&&x.length>1&&d.nodeType===9&&!w&&j.match.ID.test(x[0])&&!j.match.ID.test(x[x.length-1])&&(q=i.find(x.shift(),d,w),d=q.expr?i.filter(q.expr,q.set)[0]:q.set[0]);if(d){q=g?{expr:x.pop(),set:n(g)}:i.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),m=q.expr?i.filter(q.expr,q.set):q.set,x.length>0?o=n(m):v=!1;while(x.length)r=x.pop(),s=r,j.relative[r]?s=x.pop():r="",s==null&&(s=d),j.relative[r](o,s,w)}else o=x=[]}o||(o=m),o||i.error(r||b);if(f.call(o)==="[object Array]")if(v)if(d&&d.nodeType===1)for(u=0;o[u]!=null;u++)o[u]&&(o[u]===!0||o[u].nodeType===1&&i.contains(d,o[u]))&&e.push(m[u]);else for(u=0;o[u]!=null;u++)o[u]&&o[u].nodeType===1&&e.push(m[u]);else e.push.apply(e,o);else n(o,e);p&&(i(p,h,e,g),i.uniqueSort(e));return e};i.uniqueSort=function(a){if(p){g=h,a.sort(p);if(g)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},i.matches=function(a,b){return i(a,null,null,b)},i.matchesSelector=function(a,b){return i(b,null,null,[a]).length>0},i.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=j.order.length;e<f;e++){var g,h=j.order[e];if(g=j.leftMatch[h].exec(a)){var i=g[1];g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(/\\/g,""),d=j.find[h](g,b,c);if(d!=null){a=a.replace(j.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!=="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},i.filter=function(a,c,d,e){var f,g,h=a,k=[],l=c,m=c&&c[0]&&i.isXML(c[0]);while(a&&c.length){for(var n in j.filter)if((f=j.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=j.filter[n],r=f[1];g=!1,f.splice(1,1);if(r.substr(r.length-1)==="\\")continue;l===k&&(k=[]);if(j.preFilter[n]){f=j.preFilter[n](f,l,d,k,e,m);if(f){if(f===!0)continue}else g=o=!0}if(f)for(var s=0;(p=l[s])!=null;s++)if(p){o=q(p,f,s,l);var t=e^!!o;d&&o!=null?t?g=!0:l[s]=!1:t&&(k.push(p),g=!0)}if(o!==b){d||(l=k),a=a.replace(j.match[n],"");if(!g)return[];break}}if(a===h)if(g==null)i.error(a);else break;h=a}return l},i.error=function(a){throw"Syntax error, unrecognized expression: "+a};var j=i.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")}},relative:{"+":function(a,b){var c=typeof b==="string",d=c&&!/\W/.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1){}a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&i.filter(b,a,!0)},">":function(a,b){var c,d=typeof b==="string",e=0,f=a.length;if(d&&!/\W/.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&i.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=s;typeof b==="string"&&!/\W/.test(b)&&(b=b.toLowerCase(),d=b,g=r),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=s;typeof b==="string"&&!/\W/.test(b)&&(b=b.toLowerCase(),d=b,g=r),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!=="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!=="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!=="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(/\\/g,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(/\\/g,"")},TAG:function(a,b){return a[1].toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||i.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&i.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(/\\/g,"");!f&&j.attrMap[g]&&(a[1]=j.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(/\\/g,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=i(b[3],null,null,c);else{var g=i.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(j.match.POS.test(b[0])||j.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!i(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){return"text"===a.type},radio:function(a){return"radio"===a.type},checkbox:function(a){return"checkbox"===a.type},file:function(a){return"file"===a.type},password:function(a){return"password"===a.type},submit:function(a){return"submit"===a.type},image:function(a){return"image"===a.type},reset:function(a){return"reset"===a.type},button:function(a){return"button"===a.type||a.nodeName.toLowerCase()==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=j.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||i.getText([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,k=g.length;h<k;h++)if(g[h]===a)return!1;return!0}i.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":while(d=d.previousSibling)if(d.nodeType===1)return!1;if(c==="first")return!0;d=a;case"last":while(d=d.nextSibling)if(d.nodeType===1)return!1;return!0;case"nth":var e=b[2],f=b[3];if(e===1&&f===0)return!0;var g=b[0],h=a.parentNode;if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;for(d=h.firstChild;d;d=d.nextSibling)d.nodeType===1&&(d.nodeIndex=++i);h.sizcache=g}var j=a.nodeIndex-f;return e===0?j===0:j%e===0&&j/e>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=j.attrHandle[c]?j.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=j.setFilters[e];if(f)return f(a,c,b,d)}}},k=j.match.POS,l=function(a,b){return"\\"+(b-0+1)};for(var m in j.match)j.match[m]=new RegExp(j.match[m].source+/(?![^\[]*\])(?![^\(]*\))/.source),j.leftMatch[m]=new RegExp(/(^(?:.|\r|\n)*?)/.source+j.match[m].source.replace(/\\(\d+)/g,l));var n=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(o){n=function(a,b){var c=0,d=b||[];if(f.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length==="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var p,q;c.documentElement.compareDocumentPosition?p=function(a,b){if(a===b){g=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(p=function(a,b){var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;if(a===b){g=!0;return 0}if(h===i)return q(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return q(e[k],f[k]);return k===c?q(a,f[k],-1):q(e[k],b,1)},q=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),i.getText=function(a){var b="",c;for(var d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=i.getText(c.childNodes));return b},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(j.find.ID=function(a,c,d){if(typeof c.getElementById!=="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!=="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},j.filter.ID=function(a,b){var c=typeof a.getAttributeNode!=="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(j.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!=="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(j.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=i,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){i=function(b,e,f,g){e=e||c;if(!g&&!i.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return n(e.getElementsByTagName(b),f);if(h[2]&&j.find.CLASS&&e.getElementsByClassName)return n(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return n([e.body],f);if(h&&h[3]){var k=e.getElementById(h[3]);if(!k||!k.parentNode)return n([],f);if(k.id===h[3])return n([k],f)}try{return n(e.querySelectorAll(b),f)}catch(l){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e.getAttribute("id"),o=m||d,p=e.parentNode,q=/^\s*[+~]/.test(b);m?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),q&&p&&(e=e.parentNode);try{if(!q||p)return n(e.querySelectorAll("[id='"+o+"'] "+b),f)}catch(r){}finally{m||e.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)i[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector,d=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(e){d=!0}b&&(i.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!i.isXML(a))try{if(d||!j.match.PSEUDO.test(c)&&!/!=/.test(c))return b.call(a,c)}catch(e){}return i(c,null,null,[a]).length>0})}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;j.order.splice(1,0,"CLASS"),j.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!=="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?i.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?i.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:i.contains=function(){return!1},i.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var t=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;while(c=j.match.PSEUDO.exec(a))e+=c[0],a=a.replace(j.match.PSEUDO,"");a=j.relative[a]?a+"*":a;for(var g=0,h=f.length;g<h;g++)i(a,f[g],d);return i.filter(e,d)};d.find=i,d.expr=i.selectors,d.expr[":"]=d.expr.filters,d.unique=i.uniqueSort,d.text=i.getText,d.isXMLDoc=i.isXML,d.contains=i.contains}();var G=/Until$/,H=/^(?:parents|prevUntil|prevAll)/,I=/,/,J=/^.[^:#\[\.,]*$/,K=Array.prototype.slice,L=d.expr.match.POS,M={children:!0,contents:!0,next:!0,prev:!0};d.fn.extend({find:function(a){var b=this.pushStack("","find",a),c=0;for(var e=0,f=this.length;e<f;e++){c=b.length,d.find(a,this[e],b);if(e>0)for(var g=c;g<b.length;g++)for(var h=0;h<c;h++)if(b[h]===b[g]){b.splice(g--,1);break}}return b},has:function(a){var b=d(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(d.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(O(this,a,!1),"not",a)},filter:function(a){return this.pushStack(O(this,a,!0),"filter",a)},is:function(a){return!!a&&d.filter(a,this).length>0},closest:function(a,b){var c=[],e,f,g=this[0];if(d.isArray(a)){var h,i,j={},k=1;if(g&&a.length){for(e=0,f=a.length;e<f;e++)i=a[e],j[i]||(j[i]=d.expr.match.POS.test(i)?d(i,b||this.context):i);while(g&&g.ownerDocument&&g!==b){for(i in j)h=j[i],(h.jquery?h.index(g)>-1:d(g).is(h))&&c.push({selector:i,elem:g,level:k});g=g.parentNode,k++}}return c}var l=L.test(a)?d(a,b||this.context):null;for(e=0,f=this.length;e<f;e++){g=this[e];while(g){if(l?l.index(g)>-1:d.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b)break}}c=c.length>1?d.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a||typeof a==="string")return d.inArray(this[0],a?d(a):this.parent().children());return d.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a==="string"?d(a,b):d.makeArray(a),e=d.merge(this.get(),c);return this.pushStack(N(c[0])||N(e[0])?e:d.unique(e))},andSelf:function(){return this.add(this.prevObject)}}),d.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return d.dir(a,"parentNode")},parentsUntil:function(a,b,c){return d.dir(a,"parentNode",c)},next:function(a){return d.nth(a,2,"nextSibling")},prev:function(a){return d.nth(a,2,"previousSibling")},nextAll:function(a){return d.dir(a,"nextSibling")},prevAll:function(a){return d.dir(a,"previousSibling")},nextUntil:function(a,b,c){return d.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return d.dir(a,"previousSibling",c)},siblings:function(a){return d.sibling(a.parentNode.firstChild,a)},children:function(a){return d.sibling(a.firstChild)},contents:function(a){return d.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:d.makeArray(a.childNodes)}},function(a,b){d.fn[a]=function(c,e){var f=d.map(this,b,c),g=K.call(arguments);G.test(a)||(e=c),e&&typeof e==="string"&&(f=d.filter(e,f)),f=this.length>1&&!M[a]?d.unique(f):f,(this.length>1||I.test(e))&&H.test(a)&&(f=f.reverse());return this.pushStack(f,a,g.join(","))}}),d.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?d.find.matchesSelector(b[0],a)?[b[0]]:[]:d.find.matches(a,b)},dir:function(a,c,e){var f=[],g=a[c];while(g&&g.nodeType!==9&&(e===b||g.nodeType!==1||!d(g).is(e)))g.nodeType===1&&f.push(g),g=g[c];return f},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var P=/ jQuery\d+="(?:\d+|null)"/g,Q=/^\s+/,R=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,S=/<([\w:]+)/,T=/<tbody/i,U=/<|&#?\w+;/,V=/<(?:script|object|embed|option|style)/i,W=/checked\s*(?:[^=]|=\s*.checked.)/i,X={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};X.optgroup=X.option,X.tbody=X.tfoot=X.colgroup=X.caption=X.thead,X.th=X.td,d.support.htmlSerialize||(X._default=[1,"div<div>","</div>"]),d.fn.extend({text:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.text(a.call(this,b,c.text()))});if(typeof a!=="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return d.text(this)},wrapAll:function(a){if(d.isFunction(a))return this.each(function(b){d(this).wrapAll(a.call(this,b))});if(this[0]){var b=d(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(d.isFunction(a))return this.each(function(b){d(this).wrapInner(a.call(this,b))});return this.each(function(){var b=d(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){d(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){d.nodeName(this,"body")||d(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=d(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,d(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,e;(e=this[c])!=null;c++)if(!a||d.filter(a,[e]).length)!b&&e.nodeType===1&&(d.cleanData(e.getElementsByTagName("*")),d.cleanData([e])),e.parentNode&&e.parentNode.removeChild(e);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&d.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!0:a,b=b==null?a:b;return this.map(function(){return d.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(P,""):null;if(typeof a!=="string"||V.test(a)||!d.support.leadingWhitespace&&Q.test(a)||X[(S.exec(a)||["",""])[1].toLowerCase()])d.isFunction(a)?this.each(function(b){var c=d(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);else{a=a.replace(R,"<$1></$2>");try{for(var c=0,e=this.length;c<e;c++)this[c].nodeType===1&&(d.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(f){this.empty().append(a)}}return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(d.isFunction(a))return this.each(function(b){var c=d(this),e=c.html();c.replaceWith(a.call(this,b,e))});typeof a!=="string"&&(a=d(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;d(this).remove(),b?d(b).before(a):d(c).append(a)})}return this.pushStack(d(d.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,e){var f,g,h,i,j=a[0],k=[];if(!d.support.checkClone&&arguments.length===3&&typeof j==="string"&&W.test(j))return this.each(function(){d(this).domManip(a,c,e,!0)});if(d.isFunction(j))return this.each(function(f){var g=d(this);a[0]=j.call(this,f,c?g.html():b),g.domManip(a,c,e)});if(this[0]){i=j&&j.parentNode,d.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?f={fragment:i}:f=d.buildFragment(a,this,k),h=f.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&d.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)e.call(c?Y(this[l],g):this[l],f.cacheable||m>1&&l<n?d.clone(h,!0,!0):h)}k.length&&d.each(k,_)}return this}}),d.buildFragment=function(a,b,e){var f,g,h,i=b&&b[0]?b[0].ownerDocument||b[0]:c;a.length===1&&typeof a[0]==="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!V.test(a[0])&&(d.support.checkClone||!W.test(a[0]))&&(g=!0,h=d.fragments[a[0]],h&&(h!==1&&(f=h))),f||(f=i.createDocumentFragment(),d.clean(a,i,f,e)),g&&(d.fragments[a[0]]=h?f:1);return{fragment:f,cacheable:g}},d.fragments={},d.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){d.fn[a]=function(c){var e=[],f=d(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&f.length===1){f[b](this[0]);return this}for(var h=0,i=f.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();d(f[h])[b](j),e=e.concat(j)}return this.pushStack(e,a,f.selector)}}),d.extend({clone:function(a,b,c){var e=a.cloneNode(!0),f,g,h;if(!d.support.noCloneEvent&&(a.nodeType===1||a.nodeType===11)&&!d.isXMLDoc(a)){f=a.getElementsByTagName("*"),g=e.getElementsByTagName("*");for(h=0;f[h];++h)$(f[h],g[h]);$(a,e)}if(b){Z(a,e);if(c&&"getElementsByTagName"in a){f=a.getElementsByTagName("*"),g=e.getElementsByTagName("*");if(f.length)for(h=0;f[h];++h)Z(f[h],g[h])}}return e},clean:function(a,b,e,f){b=b||c,typeof b.createElement==="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var g=[];for(var h=0,i;(i=a[h])!=null;h++){typeof i==="number"&&(i+="");if(!i)continue;if(typeof i!=="string"||U.test(i)){if(typeof i==="string"){i=i.replace(R,"<$1></$2>");var j=(S.exec(i)||["",""])[1].toLowerCase(),k=X[j]||X._default,l=k[0],m=b.createElement("div");m.innerHTML=k[1]+i+k[2];while(l--)m=m.lastChild;if(!d.support.tbody){var n=T.test(i),o=j==="table"&&!n?m.firstChild&&m.firstChild.childNodes:k[1]==="<table>"&&!n?m.childNodes:[];for(var p=o.length-1;p>=0;--p)d.nodeName(o[p],"tbody")&&!o[p].childNodes.length&&o[p].parentNode.removeChild(o[p])}!d.support.leadingWhitespace&&Q.test(i)&&m.insertBefore(b.createTextNode(Q.exec(i)[0]),m.firstChild),i=m.childNodes}}else i=b.createTextNode(i);i.nodeType?g.push(i):g=d.merge(g,i)}if(e)for(h=0;g[h];h++)!f||!d.nodeName(g[h],"script")||g[h].type&&g[h].type.toLowerCase()!=="text/javascript"?(g[h].nodeType===1&&g.splice.apply(g,[h+1,0].concat(d.makeArray(g[h].getElementsByTagName("script")))),e.appendChild(g[h])):f.push(g[h].parentNode?g[h].parentNode.removeChild(g[h]):g[h]);return g},cleanData:function(a){var b,c,e=d.cache,f=d.expando,g=d.event.special,h=d.support.deleteExpando;for(var i=0,j;(j=a[i])!=null;i++){if(j.nodeName&&d.noData[j.nodeName.toLowerCase()])continue;c=j[d.expando];if(c){b=e[c]&&e[c][f];if(b&&b.events){for(var k in b.events)g[k]?d.event.remove(j,k):d.removeEvent(j,k,b.handle);b.handle&&(b.handle.elem=null)}h?delete j[d.expando]:j.removeAttribute&&j.removeAttribute(d.expando),delete e[c]}}}});var ba=/alpha\([^)]*\)/i,bb=/opacity=([^)]*)/,bc=/-([a-z])/ig,bd=/([A-Z])/g,be=/^-?\d+(?:px)?$/i,bf=/^-?\d/,bg={position:"absolute",visibility:"hidden",display:"block"},bh=["Left","Right"],bi=["Top","Bottom"],bj,bk,bl,bm=function(a,b){return b.toUpperCase()};d.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return d.access(this,a,c,!0,function(a,c,e){return e!==b?d.style(a,c,e):d.css(a,c)})},d.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bj(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{zIndex:!0,fontWeight:!0,opacity:!0,zoom:!0,lineHeight:!0},cssProps:{"float":d.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,e,f){if(a&&a.nodeType!==3&&a.nodeType!==8&&a.style){var g,h=d.camelCase(c),i=a.style,j=d.cssHooks[h];c=d.cssProps[h]||h;if(e===b){if(j&&"get"in j&&(g=j.get(a,!1,f))!==b)return g;return i[c]}if(typeof e==="number"&&isNaN(e)||e==null)return;typeof e==="number"&&!d.cssNumber[h]&&(e+="px");if(!j||!("set"in j)||(e=j.set(a,e))!==b)try{i[c]=e}catch(k){}}},css:function(a,c,e){var f,g=d.camelCase(c),h=d.cssHooks[g];c=d.cssProps[g]||g;if(h&&"get"in h&&(f=h.get(a,!0,e))!==b)return f;if(bj)return bj(a,c,g)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]},camelCase:function(a){return a.replace(bc,bm)}}),d.curCSS=d.css,d.each(["height","width"],function(a,b){d.cssHooks[b]={get:function(a,c,e){var f;if(c){a.offsetWidth!==0?f=bn(a,b,e):d.swap(a,bg,function(){f=bn(a,b,e)});if(f<=0){f=bj(a,b,b),f==="0px"&&bl&&(f=bl(a,b,b));if(f!=null)return f===""||f==="auto"?"0px":f}if(f<0||f==null){f=a.style[b];return f===""||f==="auto"?"0px":f}return typeof f==="string"?f:f+"px"}},set:function(a,b){if(!be.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),d.support.opacity||(d.cssHooks.opacity={get:function(a,b){return bb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style;c.zoom=1;var e=d.isNaN(b)?"":"alpha(opacity="+b*100+")",f=c.filter||"";c.filter=ba.test(f)?f.replace(ba,e):c.filter+" "+e}}),c.defaultView&&c.defaultView.getComputedStyle&&(bk=function(a,c,e){var f,g,h;e=e.replace(bd,"-$1").toLowerCase();if(!(g=a.ownerDocument.defaultView))return b;if(h=g.getComputedStyle(a,null))f=h.getPropertyValue(e),f===""&&!d.contains(a.ownerDocument.documentElement,a)&&(f=d.style(a,e));return f}),c.documentElement.currentStyle&&(bl=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!be.test(d)&&bf.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return d===""?"auto":d}),bj=bk||bl,d.expr&&d.expr.filters&&(d.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!d.support.reliableHiddenOffsets&&(a.style.display||d.css(a,"display"))==="none"},d.expr.filters.visible=function(a){return!d.expr.filters.hidden(a)});var bo=/%20/g,bp=/\[\]$/,bq=/\r?\n/g,br=/#.*$/,bs=/^(.*?):\s*(.*?)\r?$/mg,bt=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bu=/^(?:GET|HEAD)$/,bv=/^\/\//,bw=/\?/,bx=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,by=/^(?:select|textarea)/i,bz=/\s+/,bA=/([?&])_=[^&]*/,bB=/^(\w+:)\/\/([^\/?#:]+)(?::(\d+))?/,bC=d.fn.load,bD={},bE={};d.fn.extend({load:function(a,b,c){if(typeof a!=="string"&&bC)return bC.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var f=a.slice(e,a.length);a=a.slice(0,e)}var g="GET";b&&(d.isFunction(b)?(c=b,b=null):typeof b==="object"&&(b=d.param(b,d.ajaxSettings.traditional),g="POST"));var h=this;d.ajax({url:a,type:g,dataType:"html",data:b,complete:function(a,b,e){e=a.responseText,a.isResolved()&&(a.done(function(a){e=a}),h.html(f?d("<div>").append(e.replace(bx,"")).find(f):e)),c&&h.each(c,[e,b,a])}});return this},serialize:function(){return d.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?d.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||by.test(this.nodeName)||bt.test(this.type))}).map(function(a,b){var c=d(this).val();return c==null?null:d.isArray(c)?d.map(c,function(a,c){return{name:b.name,value:a.replace(bq,"\r\n")}}):{name:b.name,value:c.replace(bq,"\r\n")}}).get()}}),d.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){d.fn[b]=function(a){return this.bind(b,a)}}),d.each(["get","post"],function(a,b){d[b]=function(a,c,e,f){d.isFunction(c)&&(f=f||e,e=c,c=null);return d.ajax({type:b,url:a,data:c,success:e,dataType:f})}}),d.extend({getScript:function(a,b){return d.get(a,null,b,"script")},getJSON:function(a,b,c){return d.get(a,b,c,"json")},ajaxSetup:function(a){d.extend(!0,d.ajaxSettings,a),a.context&&(d.ajaxSettings.context=a.context)},ajaxSettings:{url:location.href,global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":d.parseJSON,"text xml":d.parseXML}},ajaxPrefilter:bF(bD),ajaxTransport:bF(bE),ajax:function(a,e){function w(a,c,e,l){if(t!==2){t=2,p&&clearTimeout(p),o=b,m=l||"",v.readyState=a?4:0;var n,q,r,s=e?bI(f,v,e):b,u,w;if(a>=200&&a<300||a===304){if(f.ifModified){if(u=v.getResponseHeader("Last-Modified"))d.lastModified[f.url]=u;if(w=v.getResponseHeader("Etag"))d.etag[f.url]=w}if(a===304)c="notmodified",n=!0;else try{q=bJ(f,s),c="success",n=!0}catch(x){c="parsererror",r=x}}else r=c,a&&(c="error",a<0&&(a=0));v.status=a,v.statusText=c,n?i.resolveWith(g,[q,c,v]):i.rejectWith(g,[v,c,r]),v.statusCode(k),k=b,f.global&&h.trigger("ajax"+(n?"Success":"Error"),[v,f,n?q:r]),j.resolveWith(g,[v,c]),f.global&&(h.trigger("ajaxComplete",[v,f]),--d.active||d.event.trigger("ajaxStop"))}}typeof e!=="object"&&(e=a,a=b),e=e||{};var f=d.extend(!0,{},d.ajaxSettings,e),g=(f.context=("context"in e?e:d.ajaxSettings).context)||f,h=g===f?d.event:d(g),i=d.Deferred(),j=d._Deferred(),k=f.statusCode||{},l={},m,n,o,p,q=c.location,r=q.protocol||"http:",s,t=0,u,v={readyState:0,setRequestHeader:function(a,b){t===0&&(l[a.toLowerCase()]=b);return this},getAllResponseHeaders:function(){return t===2?m:null},getResponseHeader:function(a){var b;if(t===2){if(!n){n={};while(b=bs.exec(m))n[b[1].toLowerCase()]=b[2]}b=n[a.toLowerCase()]}return b||null},abort:function(a){a=a||"abort",o&&o.abort(a),w(0,a);return this}};i.promise(v),v.success=v.done,v.error=v.fail,v.complete=j.done,v.statusCode=function(a){if(a){var b;if(t<2)for(b in a)k[b]=[k[b],a[b]];else b=a[v.status],v.then(b,b)}return this},f.url=(""+(a||f.url)).replace(br,"").replace(bv,r+"//"),f.dataTypes=d.trim(f.dataType||"*").toLowerCase().split(bz),f.crossDomain||(s=bB.exec(f.url.toLowerCase()),f.crossDomain=s&&(s[1]!=r||s[2]!=q.hostname||(s[3]||(s[1]==="http:"?80:443))!=(q.port||(r==="http:"?80:443)))),f.data&&f.processData&&typeof f.data!=="string"&&(f.data=d.param(f.data,f.traditional)),bG(bD,f,e,v),f.type=f.type.toUpperCase(),f.hasContent=!bu.test(f.type),f.global&&d.active++===0&&d.event.trigger("ajaxStart");if(!f.hasContent){f.data&&(f.url+=(bw.test(f.url)?"&":"?")+f.data);if(f.cache===!1){var x=d.now(),y=f.url.replace(bA,"$1_="+x);f.url=y+(y===f.url?(bw.test(f.url)?"&":"?")+"_="+x:"")}}if(f.data&&f.hasContent&&f.contentType!==!1||e.contentType)l["content-type"]=f.contentType;f.ifModified&&(d.lastModified[f.url]&&(l["if-modified-since"]=d.lastModified[f.url]),d.etag[f.url]&&(l["if-none-match"]=d.etag[f.url])),l.accept=f.dataTypes[0]&&f.accepts[f.dataTypes[0]]?f.accepts[f.dataTypes[0]]+(f.dataTypes[0]!=="*"?", */*; q=0.01":""):f.accepts["*"];for(u in f.headers)l[u.toLowerCase()]=f.headers[u];if(!f.beforeSend||f.beforeSend.call(g,v,f)!==!1&&t!==2){for(u in {success:1,error:1,complete:1})v[u](f[u]);o=bG(bE,f,e,v);if(o){t=v.readyState=1,f.global&&h.trigger("ajaxSend",[v,f]),f.async&&f.timeout>0&&(p=setTimeout(function(){v.abort("timeout")},f.timeout));try{o.send(l,w)}catch(z){status<2?w(-1,z):d.error(z)}}else w(-1,"No Transport")}else w(0,"abort"),v=!1;return v},param:function(a,c){var e=[],f=function(a,b){b=d.isFunction(b)?b():b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=d.ajaxSettings.traditional);if(d.isArray(a)||a.jquery)d.each(a,function(){f(this.name,this.value)});else for(var g in a)bH(g,a[g],c,f);return e.join("&").replace(bo,"+")}}),d.extend({active:0,lastModified:{},etag:{}});var bK=d.now(),bL=/(\=)\?(&|$)|()\?\?()/i;d.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return d.expando+"_"+bK++}}),d.ajaxPrefilter("json jsonp",function(b,c,e){e=typeof b.data==="string";if(b.dataTypes[0]==="jsonp"||c.jsonpCallback||c.jsonp!=null||b.jsonp!==!1&&(bL.test(b.url)||e&&bL.test(b.data))){var f,g=b.jsonpCallback=d.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h=a[g],i=b.url,j=b.data,k="$1"+g+"$2";b.jsonp!==!1&&(i=i.replace(bL,k),b.url===i&&(e&&(j=j.replace(bL,k)),b.data===j&&(i+=(/\?/.test(i)?"&":"?")+b.jsonp+"="+g))),b.url=i,b.data=j,a[g]=function(a){f=[a]},b.complete=[function(){a[g]=h;if(h)f&&d.isFunction(h)&&a[g](f[0]);else try{delete a[g]}catch(b){}},b.complete],b.converters["script json"]=function(){f||d.error(g+" was not called");return f[0]},b.dataTypes[0]="json";return"script"}}),d.ajaxSetup({accepts:{script:"text/javascript, application/javascript"},contents:{script:/javascript/},converters:{"text script":function(a){d.globalEval(a);return a}}}),d.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),d.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var bM=d.now(),bN={},bO,bP;d.ajaxSettings.xhr=a.ActiveXObject?function(){if(a.location.protocol!=="file:")try{return new a.XMLHttpRequest}catch(b){}try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(c){}}:function(){return new a.XMLHttpRequest};try{bP=d.ajaxSettings.xhr()}catch(bQ){}d.support.ajax=!!bP,d.support.cors=bP&&"withCredentials"in bP,bP=b,d.support.ajax&&d.ajaxTransport(function(b){if(!b.crossDomain||d.support.cors){var c;return{send:function(e,f){bO||(bO=1,d(a).bind("unload",function(){d.each(bN,function(a,b){b.onreadystatechange&&b.onreadystatechange(1)})}));var g=b.xhr(),h;b.username?g.open(b.type,b.url,b.async,b.username,b.password):g.open(b.type,b.url,b.async),(!b.crossDomain||b.hasContent)&&!e["x-requested-with"]&&(e["x-requested-with"]="XMLHttpRequest");try{d.each(e,function(a,b){g.setRequestHeader(a,b)})}catch(i){}g.send(b.hasContent&&b.data||null),c=function(a,e){if(c&&(e||g.readyState===4)){c=0,h&&(g.onreadystatechange=d.noop,delete bN[h]);if(e)g.readyState!==4&&g.abort();else{var i=g.status,j,k=g.getAllResponseHeaders(),l={},m=g.responseXML;m&&m.documentElement&&(l.xml=m),l.text=g.responseText;try{j=g.statusText}catch(n){j=""}i=i===0?!b.crossDomain||j?k?304:0:302:i==1223?204:i,f(i,j,l,k)}}},b.async&&g.readyState!==4?(h=bM++,bN[h]=g,g.onreadystatechange=c):c()},abort:function(){c&&c(0,1)}}}});var bR={},bS=/^(?:toggle|show|hide)$/,bT=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,bU,bV=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];d.fn.extend({show:function(a,b,c){var e,f;if(a||a===0)return this.animate(bW("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)e=this[g],f=e.style.display,!d._data(e,"olddisplay")&&f==="none"&&(f=e.style.display=""),f===""&&d.css(e,"display")==="none"&&d._data(e,"olddisplay",bX(e.nodeName));for(g=0;g<h;g++){e=this[g],f=e.style.display;if(f===""||f==="none")e.style.display=d._data(e,"olddisplay")||""}return this},hide:function(a,b,c){if(a||a===0)return this.animate(bW("hide",3),a,b,c);for(var e=0,f=this.length;e<f;e++){var g=d.css(this[e],"display");g!=="none"&&!d._data(this[e],"olddisplay")&&d._data(this[e],"olddisplay",g)}for(e=0;e<f;e++)this[e].style.display="none";return this},_toggle:d.fn.toggle,toggle:function(a,b,c){var e=typeof a==="boolean";d.isFunction(a)&&d.isFunction(b)?this._toggle.apply(this,arguments):a==null||e?this.each(function(){var b=e?a:d(this).is(":hidden");d(this)[b?"show":"hide"]()}):this.animate(bW("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,e){var f=d.speed(b,c,e);if(d.isEmptyObject(a))return this.each(f.complete);return this[f.queue===!1?"each":"queue"](function(){var b=d.extend({},f),c,e=this.nodeType===1,g=e&&d(this).is(":hidden"),h=this;for(c in a){var i=d.camelCase(c);c!==i&&(a[i]=a[c],delete a[c],c=i);if(a[c]==="hide"&&g||a[c]==="show"&&!g)return b.complete.call(this);if(e&&(c==="height"||c==="width")){b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY];if(d.css(this,"display")==="inline"&&d.css(this,"float")==="none")if(d.support.inlineBlockNeedsLayout){var j=bX(this.nodeName);j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)}else this.style.display="inline-block"}d.isArray(a[c])&&((b.specialEasing=b.specialEasing||{})[c]=a[c][1],a[c]=a[c][0])}b.overflow!=null&&(this.style.overflow="hidden"),b.curAnim=d.extend({},a),d.each(a,function(c,e){var f=new d.fx(h,b,c);if(bS.test(e))f[e==="toggle"?g?"show":"hide":e](a);else{var i=bT.exec(e),j=f.cur()||0;if(i){var k=parseFloat(i[2]),l=i[3]||"px";l!=="px"&&(d.style(h,c,(k||1)+l),j=(k||1)/f.cur()*j,d.style(h,c,j+l)),i[1]&&(k=(i[1]==="-="?-1:1)*k+j),f.custom(j,k,l)}else f.custom(j,e,"")}});return!0})},stop:function(a,b){var c=d.timers;a&&this.queue([]),this.each(function(){for(var a=c.length-1;a>=0;a--)c[a].elem===this&&(b&&c[a](!0),c.splice(a,1))}),b||this.dequeue();return this}}),d.each({slideDown:bW("show",1),slideUp:bW("hide",1),slideToggle:bW("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){d.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),d.extend({speed:function(a,b,c){var e=a&&typeof a==="object"?d.extend({},a):{complete:c||!c&&b||d.isFunction(a)&&a,duration:a,easing:c&&b||b&&!d.isFunction(b)&&b};e.duration=d.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in d.fx.speeds?d.fx.speeds[e.duration]:d.fx.speeds._default,e.old=e.complete,e.complete=function(){e.queue!==!1&&d(this).dequeue(),d.isFunction(e.old)&&e.old.call(this)};return e},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig||(b.orig={})}}),d.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(d.fx.step[this.prop]||d.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a=parseFloat(d.css(this.elem,this.prop));return a||0},custom:function(a,b,c){function g(a){return e.step(a)}var e=this,f=d.fx;this.startTime=d.now(),this.start=a,this.end=b,this.unit=c||this.unit||"px",this.now=this.start,this.pos=this.state=0,g.elem=this.elem,g()&&d.timers.push(g)&&!bU&&(bU=setInterval(f.tick,f.interval))},show:function(){this.options.orig[this.prop]=d.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),d(this.elem).show()},hide:function(){this.options.orig[this.prop]=d.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b=d.now(),c=!0;if(a||b>=this.options.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),this.options.curAnim[this.prop]=!0;for(var e in this.options.curAnim)this.options.curAnim[e]!==!0&&(c=!1);if(c){if(this.options.overflow!=null&&!d.support.shrinkWrapBlocks){var f=this.elem,g=this.options;d.each(["","X","Y"],function(a,b){f.style["overflow"+b]=g.overflow[a]})}this.options.hide&&d(this.elem).hide();if(this.options.hide||this.options.show)for(var h in this.options.curAnim)d.style(this.elem,h,this.options.orig[h]);this.options.complete.call(this.elem)}return!1}var i=b-this.startTime;this.state=i/this.options.duration;var j=this.options.specialEasing&&this.options.specialEasing[this.prop],k=this.options.easing||(d.easing.swing?"swing":"linear");this.pos=d.easing[j||k](this.state,i,0,1,this.options.duration),this.now=this.start+(this.end-this.start)*this.pos,this.update();return!0}},d.extend(d.fx,{tick:function(){var a=d.timers;for(var b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||d.fx.stop()},interval:13,stop:function(){clearInterval(bU),bU=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){d.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}}),d.expr&&d.expr.filters&&(d.expr.filters.animated=function(a){return d.grep(d.timers,function(b){return a===b.elem}).length});var bY=/^t(?:able|d|h)$/i,bZ=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?d.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){d.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return d.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(e){}var f=b.ownerDocument,g=f.documentElement;if(!c||!d.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=f.body,i=b$(f),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||d.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||d.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:d.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){d.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return d.offset.bodyOffset(b);d.offset.initialize();var c,e=b.offsetParent,f=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(d.offset.supportsFixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===e&&(l+=b.offsetTop,m+=b.offsetLeft,d.offset.doesNotAddBorder&&(!d.offset.doesAddBorderForTableAndCells||!bY.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),f=e,e=b.offsetParent),d.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;d.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},d.offset={initialize:function(){var a=c.body,b=c.createElement("div"),e,f,g,h,i=parseFloat(d.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";d.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),e=b.firstChild,f=e.firstChild,h=e.nextSibling.firstChild.firstChild,this.doesNotAddBorder=f.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,f.style.position="fixed",f.style.top="20px",this.supportsFixedPosition=f.offsetTop===20||f.offsetTop===15,f.style.position=f.style.top="",e.style.overflow="hidden",e.style.position="relative",this.subtractsBorderForOverflowNotVisible=f.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),a=b=e=f=g=h=null,d.offset.initialize=d.noop},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;d.offset.initialize(),d.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(d.css(a,"marginTop"))||0,c+=parseFloat(d.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var e=d.css(a,"position");e==="static"&&(a.style.position="relative");var f=d(a),g=f.offset(),h=d.css(a,"top"),i=d.css(a,"left"),j=e==="absolute"&&d.inArray("auto",[h,i])>-1,k={},l={},m,n;j&&(l=f.position()),m=j?l.top:parseInt(h,10)||0,n=j?l.left:parseInt(i,10)||0,d.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):f.css(k)}},d.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),e=bZ.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(d.css(a,"marginTop"))||0,c.left-=parseFloat(d.css(a,"marginLeft"))||0,e.top+=parseFloat(d.css(b[0],"borderTopWidth"))||0,e.left+=parseFloat(d.css(b[0],"borderLeftWidth"))||0;return{top:c.top-e.top,left:c.left-e.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&(!bZ.test(a.nodeName)&&d.css(a,"position")==="static"))a=a.offsetParent;return a})}}),d.each(["Left","Top"],function(a,c){var e="scroll"+c;d.fn[e]=function(c){var f=this[0],g;if(!f)return null;if(c!==b)return this.each(function(){g=b$(this),g?g.scrollTo(a?d(g).scrollLeft():c,a?c:d(g).scrollTop()):this[e]=c});g=b$(f);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:d.support.boxModel&&g.document.documentElement[e]||g.document.body[e]:f[e]}}),d.each(["Height","Width"],function(a,c){var e=c.toLowerCase();d.fn["inner"+c]=function(){return this[0]?parseFloat(d.css(this[0],e,"padding")):null},d.fn["outer"+c]=function(a){return this[0]?parseFloat(d.css(this[0],e,a?"margin":"border")):null},d.fn[e]=function(a){var f=this[0];if(!f)return a==null?null:this;if(d.isFunction(a))return this.each(function(b){var c=d(this);c[e](a.call(this,b,c[e]()))});if(d.isWindow(f)){var g=f.document.documentElement["client"+c];return f.document.compatMode==="CSS1Compat"&&g||f.document.body["client"+c]||g}if(f.nodeType===9)return Math.max(f.documentElement["client"+c],f.body["scroll"+c],f.documentElement["scroll"+c],f.body["offset"+c],f.documentElement["offset"+c]);if(a===b){var h=d.css(f,e),i=parseFloat(h);return d.isNaN(i)?h:i}return this.css(e,typeof a==="string"?a:a+"px")}})})(window);
jQuery(function($) {
    $('form a.add_nested_fields').live('click', function() {
        // Setup
        var assoc = $(this).attr('data-association'); // Name of child
        var content = $('#' + assoc + '_fields_blueprint').html(); // Fields template

        // Make the context correct by replacing new_<parents> with the generated ID
        // of each of the parent objects
        var context = ($(this).closest('.fields').find('input:first').attr('name') || '').replace(new RegExp('\[[a-z]+\]$'), '');

        // context will be something like this for a brand new form:
        // project[tasks_attributes][new_1255929127459][assignments_attributes][new_1255929128105]
        // or for an edit form:
        // project[tasks_attributes][0][assignments_attributes][1]
        if(context) {
            var parent_names = context.match(/[a-z_]+_attributes/g) || [];
            var parent_ids = context.match(/(new_)?[0-9]+/g) || [];

            for(i = 0; i < parent_names.length; i++) {
                if(parent_ids[i]) {
                    content = content.replace(
                        new RegExp('(_' + parent_names[i] + ')_.+?_', 'g'),
                        '$1_' + parent_ids[i] + '_');

                    content = content.replace(
                        new RegExp('(\\[' + parent_names[i] + '\\])\\[.+?\\]', 'g'),
                        '$1[' + parent_ids[i] + ']');
                }
            }
        }

        // Make a unique ID for the new child
        var regexp = new RegExp('new_' + assoc, 'g');
        var new_id = new Date().getTime();
        content = content.replace(regexp, "new_" + new_id);

        $(this).before(content);
        $(this).closest("form").trigger('nested:fieldAdded');
        return false;
    });

    $('form a.remove_nested_fields').live('click', function() {
        var hidden_field = $(this).prev('input[type=hidden]')[0];
        if(hidden_field) {
            hidden_field.value = '1';
        }
        $(this).closest('.fields').hide();
        $(this).closest("form").trigger('nested:fieldRemoved');
        return false;
    });
});
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.3 or later.
 * https://github.com/rails/jquery-ujs
 */


(function($) {
    // Make sure that every Ajax request sends the CSRF token
    function CSRFProtection(fn) {
        var token = $('meta[name="csrf-token"]').attr('content');
        if (token) fn(function(xhr) { xhr.setRequestHeader('X-CSRF-Token', token) });
    }
    if ($().jquery == '1.5') { // gruesome hack
        var factory = $.ajaxSettings.xhr;
        $.ajaxSettings.xhr = function() {
            var xhr = factory();
            CSRFProtection(function(setHeader) {
                var open = xhr.open;
                xhr.open = function() { open.apply(this, arguments); setHeader(this) };
            });
            return xhr;
        };
    }
    else $(document).ajaxSend(function(e, xhr) {
        CSRFProtection(function(setHeader) { setHeader(xhr) });
    });

    // Triggers an event on an element and returns the event result
    function fire(obj, name, data) {
        var event = new $.Event(name);
        obj.trigger(event, data);
        return event.result !== false;
    }

    // Submits "remote" forms and links with ajax
    function handleRemote(element) {
        var method, url, data,
            dataType = element.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
            method = element.attr('method');
            url = element.attr('action');
            data = element.serializeArray();
            // memoized value from clicked submit button
            var button = element.data('ujs:submit-button');
            if (button) {
                data.push(button);
                element.data('ujs:submit-button', null);
            }
        } else {
            method = element.attr('data-method');
            url = element.attr('href');
            data = null;
        }

        $.ajax({
            url: url, type: method || 'GET', data: data, dataType: dataType,
            // stopping the "ajax:beforeSend" event will cancel the ajax request
            beforeSend: function(xhr, settings) {
                if (settings.dataType === undefined) {
                    xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
                }
                return fire(element, 'ajax:beforeSend', [xhr, settings]);
            },
            success: function(data, status, xhr) {
                element.trigger('ajax:success', [data, status, xhr]);
            },
            complete: function(xhr, status) {
                element.trigger('ajax:complete', [xhr, status]);
            },
            error: function(xhr, status, error) {
                element.trigger('ajax:error', [xhr, status, error]);
            }
        });
    }

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    function handleMethod(link) {
        var href = link.attr('href'),
            method = link.attr('data-method'),
            csrf_token = $('meta[name=csrf-token]').attr('content'),
            csrf_param = $('meta[name=csrf-param]').attr('content'),
            form = $('<form method="post" action="' + href + '"></form>'),
            metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

        if (csrf_param !== undefined && csrf_token !== undefined) {
            metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
        }

        form.hide().append(metadata_input).appendTo('body');
        form.submit();
    }

    function disableFormElements(form) {
        form.find('input[data-disable-with]').each(function() {
            var input = $(this);
            input.data('ujs:enable-with', input.val())
                .val(input.attr('data-disable-with'))
                .attr('disabled', 'disabled');
        });
    }

    function enableFormElements(form) {
        form.find('input[data-disable-with]').each(function() {
            var input = $(this);
            input.val(input.data('ujs:enable-with')).removeAttr('disabled');
        });
    }

    function allowAction(element) {
        var message = element.attr('data-confirm');
        return !message || (fire(element, 'confirm') && confirm(message));
    }

    function requiredValuesMissing(form) {
        var missing = false;
        form.find('input[name][required]').each(function() {
            if (!$(this).val()) missing = true;
        });
        return missing;
    }

    $('a[data-confirm], a[data-method], a[data-remote]').live('click.rails', function(e) {
        var link = $(this);
        if (!allowAction(link)) return false;

        if (link.attr('data-remote') != undefined) {
            handleRemote(link);
            return false;
        } else if (link.attr('data-method')) {
            handleMethod(link);
            return false;
        }
    });

    $('form').live('submit.rails', function(e) {
        var form = $(this), remote = form.attr('data-remote') != undefined;
        if (!allowAction(form)) return false;

        // skip other logic when required values are missing
        if (requiredValuesMissing(form)) return !remote;

        if (remote) {
            handleRemote(form);
            return false;
        } else {
            // slight timeout so that the submit button gets properly serialized
            setTimeout(function(){ disableFormElements(form) }, 13);
        }
    });

    $('form input[type=submit], form button[type=submit], form button:not([type])').live('click.rails', function() {
        var button = $(this);
        if (!allowAction(button)) return false;
        // register the pressed submit button
        var name = button.attr('name'), data = name ? {name:name, value:button.val()} : null;
        button.closest('form').data('ujs:submit-button', data);
    });

    $('form').live('ajax:beforeSend.rails', function(event) {
        if (this == event.target) disableFormElements($(this));
    });

    $('form').live('ajax:complete.rails', function(event) {
        if (this == event.target) enableFormElements($(this));
    });
})( jQuery );
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//





;
