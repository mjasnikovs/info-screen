import {useState, useEffect, useCallback} from 'react'
import Head from 'next/head'
import {Alert, Space, Image, Container, Progress} from '@mantine/core'
import {AlertCircle} from 'tabler-icons-react'

const style = {padding: 0, margin: 0, overflow: 'hidden', backgroundColor: 'white', height: '100%', position: 'absolute', top: 0, left: 0}

const imageTimeout = null
const imageErrorTimeout = null

const Index = () => {
	const [error, setError] = useState(false)
	const [images, setImages] = useState([])
	const [image, setImage] = useState(null)
	const [time, setTime] = useState(0)

	const handleImageList = useCallback(() => {
		clearTimeout(imageErrorTimeout)
		fetch('/api/list', {method: 'GET'})
			.then(res => {
				if (res.ok) {
					return res.json()
				}
				return {error: `Status: "${res.status}". ${res.statusText}.`}
			})
			.then(res => {
				if (typeof res.error !== 'undefined') {
					imageErrorTimeout = setTimeout(() => {
						setError(null)
						handleImageList()
					}, 10000)
					return setError(res.error)
				}
				setTime(0)
				const firstImage = res.shift()
				setImage(firstImage)
				return setImages(res)
			})
			.catch(err => {
				imageErrorTimeout = setTimeout(() => {
					setError(null)
					handleImageList()
				}, 10000)
				return setError(err.message)
			})
	}, [])

	useEffect(() => {
		clearTimeout(imageTimeout)
		imageTimeout = setTimeout(() => {
			if (++time >= 30) {
				if (!images || images.length === 0) {
					return handleImageList()
				}
				const firstImage = images.shift()
				setTime(0)
				setImage(firstImage)
				return setImages(images)
			}
			return setTime(time)
		}, 1000)

		return () => {
			clearTimeout(imageTimeout)
		}
	}, [images, time, handleImageList])

	useEffect(handleImageList, [handleImageList])

	return (
		<Container fluid style={style}>
			<Head>
				<title>Info Screen</title>
				<meta name='description' content='Display image in carousel' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			{error && (
				<>
					<Space h='md' />
					<Alert icon={<AlertCircle size={16} />} title='Kļūda' color='red'>
						{error}
					</Alert>
				</>
			)}

			{image && <Image src={`${process.env.NEXT_PUBLIC_CDN}${image}`} alt={image} />}
			<Progress size='sm' value={(time * 100) / 30} style={{position: 'absolute', top: 0, left: 0, width: '100%'}} />
		</Container>
	)
}

export default Index
