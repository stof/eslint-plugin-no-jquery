'use strict';

const utils = require( './utils.js' );

module.exports = utils.createUtilMethodRule(
	'isArray',
	'Prefer Array#isArray to $.isArray'
);
