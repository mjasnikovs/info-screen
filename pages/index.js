import {useState, useEffect} from 'react'
import Head from 'next/head'
import {Button, Grid, Alert, Space, Image, Card} from '@mantine/core'
import {Dropzone, MIME_TYPES} from '@mantine/dropzone'
import {AlertCircle} from 'tabler-icons-react'

import App from '../components/AppShell'
import DropBox from '../components/DropBox'

const Index = () => {
	const [formLoading, setFormLoading] = useState(false)
	const [formError, setFormError] = useState(false)
	const [images, setImages] = useState([])

	const handleFileUpload = files => {
		setFormError(null)
		setFormLoading(true)

		const formData = new FormData()
		files.forEach(file => formData.append('files', file))

		fetch('/api/upload', {
			method: 'POST',
			body: formData
		})
			.then(res => {
				if (res.ok) {
					return res.json()
				}
				return {error: `Status: "${res.status}". ${res.statusText}.`}
			})
			.then(res => {
				setFormLoading(false)
				if (typeof res.error !== 'undefined') {
					return setFormError(res.error)
				}
				handleImageList()
				return
			})
			.catch(err => {
				setFormLoading(false)
				return setFormError(err.message)
			})
	}

	const handleImageList = () => {
		fetch('/api/list', {method: 'GET'})
			.then(res => {
				if (res.ok) {
					return res.json()
				}
				return {error: `Status: "${res.status}". ${res.statusText}.`}
			})
			.then(res => {
				if (typeof res.error !== 'undefined') {
					return setFormError(res.error)
				}
				return setImages(res)
			})
			.catch(err => {
				return setFormError(err.message)
			})
	}

	const handleImageDelete = image => {
		fetch('/api/delete', {method: 'POST', body: JSON.stringify({image})})
			.then(res => {
				if (res.ok) {
					return handleImageList()
				}
				return {error: `Status: "${res.status}". ${res.statusText}.`}
			})
			.catch(err => {
				return setFormError(err.message)
			})
	}

	useEffect(handleImageList, [])

	return (
		<App>
			<Head>
				<title>Info Screen</title>
				<meta name='description' content='Display image in carousel' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Grid grow>
				<Grid.Col span={8}>
					<Grid>
						{images.map(image => (
							<Grid.Col key={image} span={4}>
								<Card shadow='sm' p='lg'>
									<Card.Section>
										<Image src={`${process.env.NEXT_PUBLIC_CDN}${image}`} alt={image} />
									</Card.Section>
									<Space h='md' />
									<Button onClick={() => handleImageDelete(image)} variant='light' color='red' fullWidth>
										Dzēst
									</Button>
								</Card>
							</Grid.Col>
						))}
					</Grid>
					<Space h='md' />
				</Grid.Col>
				<Grid.Col span={4}>
					<Dropzone
						loading={formLoading}
						onDrop={handleFileUpload}
						onReject={() => setFormError('Faila/u augšuplāde neizdevās.')}
						accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf, MIME_TYPES.pptx, MIME_TYPES.ppt]}
					>
						{status => DropBox(status)}
					</Dropzone>
					{formError && (
						<>
							<Space h='md' />
							<Alert icon={<AlertCircle size={16} />} title='Kļūda' color='red'>
								{formError}
							</Alert>
						</>
					)}
				</Grid.Col>
			</Grid>
		</App>
	)
}

export default Index
