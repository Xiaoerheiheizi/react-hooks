const { addLessLoader } = require('customize-cra');

module.exports = function override(config, env) {
	config = addLessLoader({
		javascriptEnabled : true
	})(config, env);
	return config;
};