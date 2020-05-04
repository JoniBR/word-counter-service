import { Router, Request, Response } from 'express'
import WordCounterService from './WordCounterService'
import { SERVICE_NAME } from './constants'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
    const service: WordCounterService = req.app.get(SERVICE_NAME)
    try{
        await service.countWords(req)
        res.status(200).send('ok').end()
    }catch(error){
        res.status(500).send('error').end()
    }
})

router.get('/statistics/:word', async (req: Request, res: Response) => {
    const service: WordCounterService = req.app.get(SERVICE_NAME)
    const word = req.params.word
    if(!word){
        res.status(401).send('error').end()
        return
    }
    try {
        const count = await service.getWordCount(word)
        res.status(200).send(count + '').end()
    } catch (error) {
        console.error(error)
        res.status(500).send('error').end()
    }
})



export default router