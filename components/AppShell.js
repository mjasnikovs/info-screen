import React from 'react'
import {AppShell, Header, Text, Container, Group, Anchor} from '@mantine/core'
import Link from 'next/link'

const App = ({children}) => {
	return (
		<AppShell
			navbarOffsetBreakpoint='sm'
			asideOffsetBreakpoint='sm'
			fixed
			header={
				<Header height={70} p='md'>
					<div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
						<Group>
							<Text>Info Screen</Text>
							<Link href={process.env.NEXT_PUBLIC_URL}>
								<Anchor>Ielāde</Anchor>
							</Link>
							<Link href={`${process.env.NEXT_PUBLIC_URL}tv`}>
								<Anchor>Ekrāns</Anchor>
							</Link>
						</Group>
					</div>
				</Header>
			}
		>
			<Container>{children}</Container>
		</AppShell>
	)
}

export default App
