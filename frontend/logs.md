vue3-easy-data-table.es.js:906 Uncaught (in promise) TypeError: itemsSearching.value is not iterable
    at eval (vue3-easy-data-table.es.js:906:44)
    at ReactiveEffect.eval [as fn] (reactivity.esm-bundler.js:1038:13)
    at ReactiveEffect.run (reactivity.esm-bundler.js:221:19)
    at get value (reactivity.esm-bundler.js:1050:147)
    at triggerComputed (reactivity.esm-bundler.js:240:19)
    at get dirty (reactivity.esm-bundler.js:193:11)
    at job (runtime-core.esm-bundler.js:2078:35)
    at flushPreFlushCbs (runtime-core.esm-bundler.js:489:7)
    at updateComponentPreRender (runtime-core.esm-bundler.js:6260:5)
    at ReactiveEffect.componentUpdateFn [as fn] (runtime-core.esm-bundler.js:6173:11)
Promise.then		
eval	@	main.js:36
./src/main.js	@	app.js:1306
__webpack_require__	@	app.js:5028
(anonymous)	@	app.js:6257
__webpack_require__.O	@	app.js:5077
(anonymous)	@	app.js:6258
(anonymous)	@	app.js:6260
