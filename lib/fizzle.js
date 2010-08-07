/*!
 * Fizzle E4X CSS Selector Engine
 * Copyright 2010, Nicholas R. Perez (nperez)
 * Licensed under the GPL
 *
 * Derived from the awesome:
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
var Fizzle = (function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Fizzle = function(selector, context, results, seed) {
	results = results || <></>;

    if(typeof context === "string")
    {
        context = new XML(context);
    }
    else if(!(context instanceof XML))
    {
        throw "Context must be either a string of XML or an instanceof xml";
    }

	var origContext = context;

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra,
		soFar = selector, ret, cur, pop, i;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec("");
		m = chunker.exec(soFar);

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
			set = Fizzle.posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ? context : Fizzle( parts.shift(), context );
			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				set = Fizzle.posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
            ret = Fizzle.find( parts.shift(), context );
			context = ret.expr ? (
                
                Fizzle.filter( ret.expr, ret.set, false )[0]) : ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: seed.copy() } :
				Fizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parent() != null ? context.parent() : context);
			set = ret.expr ? Fizzle.filter( ret.expr, ret.set, false ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = set.copy();
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
				Expr.relative[ cur ]( checkSet, pop );
			}
		} else {
			checkSet = <></>;
            parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Fizzle.error( cur || selector );
	}
    
    if(results.length() > 0)
    {
        for each (var i in checkSet)
        {
            results[results.length()] = i.copy();
        }
    }
    else
    {
        results = checkSet;
    }

	if ( extra ) 
    {
		results = Fizzle( extra, origContext, results, seed );
		Fizzle.uniqueSort( results );
	}
    
	return results;
};

Fizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length(); i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Fizzle.matches = function(expr, set){
	var result = Fizzle(expr, null, null, set);
    return result;
};

Fizzle.find = function(expr, context){
	var set;

	if ( !expr ) {
		return {};
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context );
				if ( set.length() ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.*;
	}
    
	return {set: set, expr: expr};
};

Fizzle.filter = function(expr, set, not){
	var old = expr, result = <></>, match, anyFound;

    if(expr.length < 1)
    {
        return set;
    }

	while ( expr.length && set.length() ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filterfunc = Expr.filter[ type ], found = false, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

                if ( Expr.preFilter[ type ] ) {
 					match = Expr.preFilter[ type ]( match, set, result, not );
 					if ( !match ) {
 						anyFound = found = true;
 					} else if ( match === true ) {
 						continue;
 					}
 				}

				if ( match ) {
					for ( var i = 0; (item = set[i]) != null; i++ ) {
						if ( item ) {
							found = filterfunc( item, match, i, set );
							var pass = not ^ !!found;

							if ( pass ) {
								result[result.length()] = item.copy();
								anyFound = true;
							}
						}
					}
				}

				if ( found ) {
					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return <></>;
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Fizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return result;
};

Fizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Fizzle.selectors = {
	order: [ "ID", "CLASS", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.@href;
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length(), elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.parent().children()[elem.childIndex() - 1])) {}

					checkSet[i] = isPartStrNotTag || elem && elem.localName() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Fizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string",
				elem, i = 0, l = checkSet.length();

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];
					if ( elem ) {
						var elem_parent = elem.parent();
						checkSet[i] = elem_parent.localName().toLowerCase() === part ? elem_parent : false;
					}
				}
			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = elem.parent() != null ? elem.parent().toXMLString() === part.toXMLString() : elem;
					}
				}

				if ( isPartStr ) {
					Fizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part){
			var doneName = done++, checkFn = dirCheck, nodeCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck);
		},
		"~": function(checkSet, part){
			var doneName = done++, checkFn = dirCheck, nodeCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck);
		}
	},
	find: {
		ID: function(match, context){
            return context..*.(function::attribute("id") == match[1]);
		},
		NAME: function(match, context){
			return context..*.(function::attribute("name") == match[1]);
		},
		TAG: function(match, context){
			return context.localName().toLowerCase() === match[1].toLowerCase() ?  context : context.descendants(match[1]);
		},
        CLASS: function(match, context){
            return context..*.(function::attribute("class") == match[1]);
        }
	},
 	preFilter: {
        CLASS: function(match){
 			return match[1].replace(/\\/g, "");
 		},
 		ID: function(match){
 			return match[1].replace(/\\/g, "");
 		},
 		TAG: function(match){
 			return match[1].toLowerCase();
 		},
 		CHILD: function(match){
 			if ( match[1] === "nth" ) {
 				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
 				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
 					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
 					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);
 
 				// calculate the numbers (first)n+(last) including if they are negative
 				match[2] = (test[1] + (test[2] || 1)) - 0;
 				match[3] = test[3] - 0;
 			}
 
 			// TODO: Move to normal caching system
 			match[0] = done++;
 
 			return match;
 		},
 		ATTR: function(match, curLoop, result, not){
 			var name = match[1].replace(/\\/g, "");
 			
 			if ( !isXML && Expr.attrMap[name] ) {
 				match[1] = Expr.attrMap[name];
 			}
 
 			if ( match[2] === "~=" ) {
 				match[4] = " " + match[4] + " ";
 			}
 
 			return match;
 		},
 		PSEUDO: function(match, curLoop, result, not){
 			if ( match[1] === "not" ) {
 				// If we're dealing with a complex expression, or a simple one
 				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
 					match[3] = Sizzle(match[3], null, null, curLoop);
 				} else {
 					var ret = Sizzle.filter(match[3], curLoop, true ^ not);
                    result[result.length()] = ret;
 					return false;
 				}
 			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
 				return true;
 			}
 			
 			return match;
 		},
 		POS: function(match){
 			match.unshift( true );
 			return match;
 		}
 	},
	filters: {
		enabled: function(elem){
			return elem.@disabled === "undefined" && elem.@type !== "hidden";
		},
		disabled: function(elem){
			return elem.@disabled === "disabled";
		},
		checked: function(elem){
			return elem.@checked === "checked";
		},
		selected: function(elem){
			return elem.@selected === "selected";
		},
		parent: function(elem){
			return elem.parent() !== "undefined";
		},
		empty: function(elem){
			return elem.*.length() == 0;
		},
		has: function(elem, i, match){
			return !!Fizzle( match[3], elem ).length();
		},
		header: function(elem){
			return (/h\d/i).test( elem.localName() );
		},
		text: function(elem){
			return "text" === elem.@type;
		},
		radio: function(elem){
			return "radio" === elem.@type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.@type;
		},
		file: function(elem){
			return "file" === elem.@type;
		},
		password: function(elem){
			return "password" === elem.@type;
		},
		submit: function(elem){
			return "submit" === elem.@type;
		},
		image: function(elem){
			return "image" === elem.@type;
		},
		reset: function(elem){
			return "reset" === elem.@type;
		},
		button: function(elem){
			return "button" === elem.@type || elem.localName() === "button";
		},
		input: function(elem){
			return (/input|select|textarea|button/i).test(elem.localName());
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length() - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return elem.toString().indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				Fizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					var index = node.childIndex();
                    if ( !isNaN(index) ? index > 0 : false  )
                    {
                        return false;
                    }

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;
				case 'last':
                    var index = node.childIndex();
                    
                    if(isNaN(index))
                    {
                        return true;
                    }
                    else if( index == node.parent().children().length() -1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var diff = elem.childIndes() - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.@id === match;
		},
		TAG: function(elem, match){
			return (match === "*" ) || elem.localName() === match;
		},
		CLASS: function(elem, match){
            return elem.@class === match;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
						elem.attribute( name ),
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
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

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

function dirExecute( dir, elem ) {
    var ret;
    switch( dir )
    {
        case "parentNode":
            ret = elem.parent();
            break;
        case "previousSibling":
            ret = elem.parent().children()[elem.childIndex() - 1];
            break;
    }

    return ret;
}

function dirNodeCheck( dir, cur, doneName, checkSet ) {

	for ( var i = 0, l = checkSet.length(); i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
            elem = dirExecute( dir, elem );
			var match = false;

			while ( elem ) {

				if ( elem.localName().toLowerCase() === cur.toLowerCase() ) {
					match = elem;
					break;
				}

                elem = dirExecute( dir, elem );
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet ) {
	for ( var i = 0, l = checkSet.length(); i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
            elem = dirExecute( dir, elem );
			var match = false;

			while ( elem ) {
                if ( elem.toXMLString() === cur.toXMLString() ) {
                    match = true;
                    break;
                }

                elem = dirExecute( dir, elem );
			}

			checkSet[i] = match;
		}
	}
}

Fizzle.contains = function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

Fizzle.posProcess = function(selector, context){
	var tmpSet = <></>, later = "", match,
		root = context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

    tmpSet = Fizzle( selector, root, tmpSet );
	return Fizzle.filter( later, tmpSet, false );
};

return Fizzle;

})();
