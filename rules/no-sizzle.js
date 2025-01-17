'use strict';

const utils = require( './utils.js' );

module.exports = {
	meta: {
		docs: {},
		schema: [
			{
				type: 'object',
				properties: {
					allowPositional: {
						type: 'boolean'
					},
					allowOther: {
						type: 'boolean'
					}
				},
				additionalProperties: false
			}
		]
	},

	create: function ( context ) {
		const forbiddenPositional = /:eq|:even|:first([^-]|$)|:gt|:last([^-]|$)|:lt|:nth|:odd/;
		const forbiddenOther = /:animated|:button|:checkbox|:file|:has|:header|:hidden|:image|:input|:parent|:password|:radio|:reset|:selected|:submit|:text|:visible/;
		const traversals = [
			'children',
			'closest',
			'filter',
			'find',
			'has',
			'is',
			'next',
			'nextAll',
			'nextUntil',
			'not',
			'parent',
			'parents',
			'parentsUntil',
			'prev',
			'prevAll',
			'prevUntil',
			'siblings'
		];

		return {
			CallExpression: function ( node ) {
				if (
					!node.arguments[ 0 ] ||
					!utils.isjQuery( node ) ||
					(
						node.callee.type === 'MemberExpression' &&
						traversals.indexOf( node.callee.property.name ) === -1
					)
				) {
					return;
				}

				const allowPositional = context.options[ 0 ] &&
					context.options[ 0 ].allowPositional;
				const allowOther = context.options[ 0 ] &&
					context.options[ 0 ].allowOther;

				if ( !allowPositional && forbiddenPositional.test( node.arguments[ 0 ].value ) ) {
					context.report( {
						node: node,
						message: 'Positional selector extensions are not allowed'
					} );
				} else if ( !allowOther && forbiddenOther.test( node.arguments[ 0 ].value ) ) {
					context.report( {
						node: node,
						message: 'Selector extensions are not allowed'
					} );
				}
			}
		};
	}
};
