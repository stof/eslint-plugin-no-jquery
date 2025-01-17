'use strict';

const utils = require( './utils.js' );

module.exports = {
	meta: {
		docs: {},
		schema: [
			{
				type: 'object',
				properties: {
					allowScroll: {
						type: 'boolean'
					}
				},
				additionalProperties: false
			}
		]
	},

	create: function ( context ) {
		return {
			CallExpression: function ( node ) {
				if (
					node.callee.type !== 'MemberExpression' ||
					node.callee.property.name !== 'animate'
				) {
					return;
				}
				const allowScroll = context.options[ 0 ] && context.options[ 0 ].allowScroll;
				if ( allowScroll ) {
					const arg = node.arguments[ 0 ];
					// Check properties list has more than just scrollTop/scrollLeft
					if ( arg && arg.type === 'ObjectExpression' ) {
						if (
							arg.properties.every(
								( prop ) => prop.key.name === 'scrollTop' || prop.key.name === 'scrollLeft'
							)
						) {
							return;
						}
					}
				}

				if ( utils.isjQuery( node ) ) {
					context.report( {
						node: node,
						message: allowScroll ?
							'Prefer CSS transitions to $.animate' :
							'Prefer CSS transitions or CSS scroll-behaviour to $.animate'
					} );
				}
			}
		};
	}
};
