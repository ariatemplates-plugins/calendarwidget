(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : basePath + "LazyLoader",
        $singleton : true,
        $dependencies : ["aria.utils.Json"],
        $statics : {
            LOADING : 1,
            LOADED : 2
        },
        $prototype : {
            /**
             * Map of registered dependencies
             * @type Object
             * @private
             */
            _depMap : {},

            /**
             * Map of the status of these dependencies
             * @type Object
             * @private
             */
            _status : {},

            /**
             * Map of the registered callbacks for a dependency
             * @type Object
             * @private
             */
            _callbacks : {},

            /**
             * Register a group of dependencies
             * @param {String} name Name of the lazy dependencies to register
             * @param {Object} dependencies
             */
            register : function (name, dependencies) {
                this._depMap[name] = dependencies;
                this._callbacks[name] = [];
            },

            /**
             * Load dependencies registered under a certain name
             * @param {String} name
             * @param {aria.core.CfgBeans.Callback} callback
             */
            load : function (name, callback) {
                var dep = this._depMap[name];
                if (dep) {
                    var status = this._status[name];
                    if (status == this.LOADING) {
                        this._callbacks[name].push(callback);
                        return;
                    }
                    if (status == this.LOADED) {
                        this.$callback(callback);
                        return;
                    }
                    var loadCfg = aria.utils.Json.copy(dep);
                    this._callbacks[name].push(callback);

                    loadCfg.oncomplete = {
                        fn : this._executeCallbacks,
                        scope : this,
                        args : name,
                        resIndex : -1
                    };

                    Aria.load(loadCfg);
                }
            },

            /**
             * Whether the dependencies are loaded or not
             * @param {String} name Name of the lazy dependencies
             * @return {Boolean}
             */
            isLoaded : function (name) {
                return this._status[name] == this.LOADED || false;
            },

            /**
             * Ecxecute registered callbacks
             * @param {String} name Name of the lazy dependencies
             * @private
             */
            _executeCallbacks : function (name) {
                this._status[name] = this.LOADED;
                var callbacks = this._callbacks[name];
                for (var i = 0, length = callbacks.length; i < length; i++) {
                    this.$callback(callbacks[i]);
                }
                this._callbacks[name] = [];
            }
        }
    });
})();