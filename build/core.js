function prop(e,r){if("object"!=typeof e||"string"!=typeof r)return e;for(var n=r.split("."),t=0;t<n.length;t++){var i=n[t];if(null===(e=e.hasOwnProperty(i)?e[i]:null))break}return e}function pope(e,r,n){n=n||{skipUndefined:!1,throwOnUndefined:!1};for(var t,i=/{{2}(.+?)}{2}/g,a=e;null!==(t=i.exec(e));){var o=t[1].trim();if(o){var s=prop(r,o);if(void 0!==s&&null!==s)a=a.replace(t[0],s);else{if(n.throwOnUndefined){var u=new Error("Missing value for "+t[0]);throw u.key=o,u.code="E_MISSING_KEY",u}n.skipUndefined||(a=a.replace(t[0],""))}}}return a}function PLazy(e){this.fn=e,this._promise=null}function onResolved(e){return{fullFilled:!0,rejected:!1,value:e,reason:null}}function onRejected(e){return{fullFilled:!1,rejected:!0,value:null,reason:e}}function pSeries(e,r){function n(r,a){return r>=i?Promise.resolve(t):e[r].then(function(e){return t.push(onResolved(e)),n(r+1,a)}).catch(function(e){return t.push(onRejected(e)),a?Promise.resolve(t):n(r+1,a)})}var t=[],i=e.length;return n(0,r)}function Pipe(e,r){r.add();const n=e.length;let t=0,i="name";for(;t<n;){const n=e[t++],a=n.charCodeAt(0);58===a||44===a?(i="arg",r.shiftValue()):124===a?(i="name",r.add()):"arg"===i?r.appendValue(n):r.appendKey(n,a)}return r.toJSON()}function ArrayPresenter(){return{nodes:[],currentNode:null,add(){this.currentNode={name:"",args:[]},this.nodes.push(this.currentNode)},appendKey(e,r){32!==r&&(this.currentNode.name+=e)},appendValue(e){this.currentNode.args[this.currentNode.args.length-1]+=e},shiftValue(){this.currentNode.args.push("")},toJSON(){return this.nodes}}}function starToIndex(e,r,n,t){if(!r)return[];n=n||0;var i=e[n++],a=e[n];return t||(t=[i],i=""),t=t.reduce(function(e,n){var t=i?n+"."+i:n;if(void 0!==a){var o=prop(r,t);if(Array.isArray(o))for(var s=o.length,u=0;u<s;u++)e.push(t+"."+u)}else e.push(t);return e},[]),n===e.length?t:starToIndex(e,r,n,t)}function parseRules(e,r){return r=r||{},Object.keys(e).reduce(function(n,t){var i=e[t];if("string"==typeof i)i=hayePipe(i,new hayeArrayPresenter);else if(!Array.isArray(i))throw new Error("Rules must be defined as a string or an array");if(t.includes("*")){starToIndex(t.split(/\.\*\.?/),r).forEach(function(e){n[e]=i})}else n[t]=i;return n},{})}function getMessage(e,r,n,t){var i=e[(r=r.replace(/\.\d/g,".*"))+"."+n]||e[n]||"{{validation}} validation failed on {{ field }}";return"function"==typeof i?i(r,n,t):pope(i,{field:r,validation:n,argument:t})}function VanillaFormatter(){this.errors=[]}function validationFn(e,r,n,t,i,a){var o=r.name,s=r.args;return new PLazy(function(r,a){if("function"!=typeof e[o])throw new Error(o+" is not defined as a validation rule");var u=getMessage(i,n,o,s);e[o](t,n,u,s,prop).then(r).catch(a)}).catch(function(e){a.addError(e,n,o)})}function getValidationsStack(e,r,n,t,i){return Object.keys(r).reduce(function(a,o){return r[o].map(function(r){a.push(validationFn(e,r,o,n,t,i))}),a},[])}function _validate(e,r,n,t,i,a){return a=a||new VanillaFormatter,new Promise(function(o,s){i=i||{};var u=parseRules(t);pSeries(getValidationsStack(e,u,n,i,a),r).then(function(e){var r=a.toJSON();if(r.length)return s(r);o(n)})})}PLazy.prototype.then=function(e,r){return this._promise=this._promise||new Promise(this.fn),this._promise.then(e,r)},PLazy.prototype.catch=function(e){return this._promise=this._promise||new Promise(this.fn),this._promise.catch(e)};var hayePipe=Pipe,hayeArrayPresenter=ArrayPresenter;VanillaFormatter.prototype.addError=function(e,r,n){var t=e;e instanceof Error&&(n="ENGINE_EXCEPTION",t=e.message),this.errors.push({message:t,field:r,validation:n})},VanillaFormatter.prototype.toJSON=function(){return this.errors};var validator=function(e){return{validate:function(r,n,t,i){return _validate(e,!0,r,n,t,i)},validateAll:function(r,n,t,i){return _validate(e,!1,r,n,t,i)}}};export default validator;