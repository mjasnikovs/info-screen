import React from 'react'
import {Group, Text} from '@mantine/core'
import {FileUpload} from 'tabler-icons-react'

const dropBox = status => (
	<Group position='center' spacing='xl'>
		<FileUpload status={status} size={80} />
		<div>
			<Text size='xl' inline>
				Uzvelc failu šeit vai noklikšķini lai izvēlētos.
			</Text>
		</div>
	</Group>
)

export default dropBox
