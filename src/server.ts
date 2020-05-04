import express from 'express'
import routes from './routes'
import WordCounterService from './WordCounterService'
import { SERVICE_NAME } from './constants'
const app = express()
const wordCounterService = new WordCounterService();

app.set(SERVICE_NAME, wordCounterService)

app.use('/' , routes)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
