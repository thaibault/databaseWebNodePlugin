module.exports=function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=11)}([function(a){a.exports=require('source-map-support/register')},function(a){a.exports=require('babel-runtime/core-js/object/keys')},function(a){a.exports=require('babel-runtime/core-js/promise')},function(a){a.exports=require('babel-runtime/helpers/asyncToGenerator')},function(a){a.exports=require('clientnode')},function(a){a.exports=require('path')},function(module,exports,__webpack_require__){'use strict';function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}exports.__esModule=!0,exports.Helper=void 0;var _keys=__webpack_require__(1),_keys2=_interopRequireDefault(_keys),_promise=__webpack_require__(2),_promise2=_interopRequireDefault(_promise),_asyncToGenerator2=__webpack_require__(3),_asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2),_child_process=__webpack_require__(7),_clientnode=__webpack_require__(4),_clientnode2=_interopRequireDefault(_clientnode),_nodeFetch=__webpack_require__(8),_nodeFetch2=_interopRequireDefault(_nodeFetch),_path=__webpack_require__(5),_path2=_interopRequireDefault(_path),_pluginAPI=__webpack_require__(9),_pluginAPI2=_interopRequireDefault(_pluginAPI);try{__webpack_require__(0)}catch(a){}global.fetch=_nodeFetch2.default;class Helper{static ensureValidationDocumentPresence(a,b,c,d,e=!0){return(0,_asyncToGenerator3.default)(function*(){const f=_clientnode2.default.extendObject({_id:`_design/${b}`,language:'javascript'},c);try{const c=yield a.get(`_design/${b}`);f._rev=c._rev,yield a.put(f),e&&console.info(`${d} updated.`)}catch(b){e&&('not_found'===b.error?console.info(`${d} not available: create new one.`):console.info(`${d} couldn't be updated: "`+`${_clientnode2.default.representObject(b)}" create new one.`));try{yield a.put(f),e&&console.info(`${d} installed/updated.`)}catch(a){throw new Error(`${d} couldn't be installed/updated: "`+`${_clientnode2.default.representObject(a)}".`)}}})()}static initializeConnection(a,b){a.database.connection=new a.database.connector(_clientnode2.default.stringFormat(b.database.url,`${b.database.user.name}:`+`${b.database.user.password}@`)+`/${b.name}`,b.database.connector),a.database.connection.setMaxListeners(Infinity);const c=b.database.model.property.name.special.id,d=b.database.model.property.name.special.revision;for(const e of['post','put']){const f=a.database.connection[e].bind(a.database.connection);a.database.connection[e]=(()=>{var a=(0,_asyncToGenerator3.default)(function*(a,...e){try{return yield f(a,...e)}catch(e){if(c in a&&b.database.ignoreNoChangeError&&'name'in e&&'forbidden'===e.name&&'message'in e&&e.message.startsWith('NoChange:')){const b={id:a[c],ok:!0};try{b.rev=d in a&&!['latest','upsert'].includes(a[d])?a[d]:(yield this.get(b.id))[d]}catch(a){throw a}return b}throw e}});return function(){return a.apply(this,arguments)}})()}return a}static startServer(services,configuration){var _this=this;return(0,_asyncToGenerator3.default)(function*(){services.database.server.process=(0,_child_process.spawn)(services.database.server.binaryFilePath,['--config',configuration.database.configurationFilePath,'--dir',_path2.default.resolve(configuration.database.path),'--host',configuration.database['httpd/host'],'--port',`${configuration.database.port}`],{cwd:eval('process').cwd(),env:eval('process').env,shell:!0,stdio:'inherit'}),new _promise2.default(function(a,b){for(const c of _clientnode2.default.closeEventNames)services.database.server.process.on(c,_clientnode2.default.getProcessCloseHandler(a,b,{reason:c,process:services.database.server.process}))}).then(function(...a){services.database&&services.database.server&&services.database.server.resolve&&services.database.server.resolve.apply(_this,a)},function(...a){services.database&&services.database.server&&services.database.server.resolve&&services.database.server.reject.apply(_this,a)}),yield _clientnode2.default.checkReachability(_clientnode2.default.stringFormat(configuration.database.url,''),!0)})()}static restartServer(a,b,c){return(0,_asyncToGenerator3.default)(function*(){const d=a.database.server.resolve,e=a.database.server.reject;return a.database.server.resolve=a.database.server.reject=_clientnode2.default.noop,yield Helper.stopServer(a,b),a.database.server.resolve=d,a.database.server.reject=e,yield Helper.startServer(a,b),Helper.initializeConnection(a,b),yield _pluginAPI2.default.callStack('restartDatabase',c,b,a),a})()}static stopServer(a,b){return(0,_asyncToGenerator3.default)(function*(){return a.database.connection&&a.database.connection.close(),a.database.server.process&&a.database.server.process.kill('SIGINT'),yield _clientnode2.default.checkUnreachability(_clientnode2.default.stringFormat(b.database.url,''),!0),a})()}static determineAllowedModelRolesMapping(a){const b=a.property.name.special.allowedRole,c={},d=Helper.extendModels(a);for(const e in d)if(d.hasOwnProperty(e)&&d[e].hasOwnProperty(b))for(const a in c[e]=Helper.normalizeAllowedModelRoles(d[e][b]),c[e].properties={},d[e])d[e].hasOwnProperty(a)&&d[e][a].hasOwnProperty('allowedRoles')&&d[e][a].allowedRoles&&(c[e].properties[a]=Helper.normalizeAllowedModelRoles(d[e][a].allowedRoles));else c[e]={read:[],write:[],properties:{}};return c}static determineGenericIndexablePropertyNames(a,b){const c=a.property.name.special;return(0,_keys2.default)(b).filter((d)=>b[d].index||!(b[d].hasOwnProperty('index')&&!b[d].index||a.property.name.reserved.concat(c.additional,c.allowedRole,c.attachment,c.conflict,c.constraint.execution,c.constraint.expression,c.deleted,c.deleted_conflict,c.extend,c.id,c.maximumAggregatedSize,c.minimumAggregatedSize,c.revision,c.revisions,c.revisionsInformation,c.type).includes(d)||b[d].type&&('string'==typeof b[d].type&&b[d].type.endsWith('[]')||Array.isArray(b[d].type)&&b[d].type.length&&Array.isArray(b[d].type[0])||a.entities.hasOwnProperty(b[d].type)))).concat(c.id,c.revision)}static extendModel(a,b,c='_extends'){if('_base'===a)return b[a];if(b.hasOwnProperty('_base')&&(b[a].hasOwnProperty(c)?b[a][c]=['_base'].concat(b[a][c]):b[a][c]='_base'),b[a].hasOwnProperty(c)){for(const d of[].concat(b[a][c]))b[a]=_clientnode2.default.extendObject(!0,{},Helper.extendModel(d,b,c),b[a]);delete b[a][c]}return b[a]}static extendModels(a){const b=a.property.name.special,c={};for(const d in a.entities)if(a.entities.hasOwnProperty(d)){if(!(new RegExp(a.property.name.typeRegularExpressionPattern.public).test(d)||new RegExp(a.property.name.typeRegularExpressionPattern.private).test(d)))throw new Error('Model names have to match "'+a.property.name.typeRegularExpressionPattern.public+'" or "'+a.property.name.typeRegularExpressionPattern.private+`" for private one (given name: "${d}").`);c[d]=Helper.extendModel(d,a.entities,b.extend)}for(const d in c)if(c.hasOwnProperty(d))for(const e in c[d])if(c[d].hasOwnProperty(e))if(e===b.attachment)for(const b in c[d][e])c[d][e].hasOwnProperty(b)&&(c[d][e][b]=_clientnode2.default.extendObject(!0,_clientnode2.default.copy(a.property.defaultSpecification),c[d][e][b]));else[b.allowedRole,b.constraint.execution,b.constraint.expression,b.extend,b.maximumAggregatedSize,b.minimumAggregatedSize].includes(e)||(c[d][e]=_clientnode2.default.extendObject(!0,_clientnode2.default.copy(a.property.defaultSpecification),c[d][e]));return c}static normalizeAllowedModelRoles(a){if(Array.isArray(a))return{read:a,write:a};if('object'==typeof a){const b={read:[],write:[]};for(const c in b)a.hasOwnProperty(c)&&(b[c]=Array.isArray(a[c])?a[c]:[a[c]]);return b}return{read:[a],write:[a]}}}exports.Helper=Helper,exports.default=Helper},function(a){a.exports=require('child_process')},function(a){a.exports=require('node-fetch')},function(a){a.exports=require('web-node/pluginAPI.compiled')},,function(a,b,c){a.exports=c(6)}]);