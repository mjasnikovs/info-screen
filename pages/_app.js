import {AppProps} from 'next/app'
import Head from 'next/head'
import {MantineProvider} from '@mantine/core'

const App = props => {
	const {Component, pageProps} = props

	return (
		<>
			<Head>
				<title>Info Screen</title>
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: 'dark'
				}}
			>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	)
}

export default App
