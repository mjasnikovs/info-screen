module.exports = {
	extends: 'next/core-web-vitals',
	rules: {
		indent: [2, 'tab'],
		'no-tabs': 0,
		'import/no-anonymous-default-export': 0,
		'object-curly-spacing': [2, 'never'],
		'array-bracket-spacing': [2, 'never'],
		'computed-property-spacing': [2, 'never'],
		'linebreak-style': [2, 'unix'],
		quotes: [2, 'single'],
		semi: [2, 'never'],
		'brace-style': [2, '1tbs'],
		camelcase: [0, {properties: 'always'}],
		'keyword-spacing': [2],
		'eol-last': [1],
		'no-trailing-spaces': [2],
		'no-redeclare': 2,
		'no-shadow': 2,
		'no-console': [1, {allow: ['warn', 'error']}],
		'no-eval': 'error',
		'import/first': 'error',
		'no-unused-vars': 1,
		'no-undef': 2,
		'no-restricted-globals': [2]
	}
}
