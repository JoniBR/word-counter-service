import Redis from '../utils/redis'
import { Readable } from 'stream'
import WordCounterService from '../WordCounterService'
const wordCounterService = new WordCounterService()

const sleep = (ms:number) => {
    return new Promise(resolve => {
        setTimeout(() => {resolve()}, ms)
    })
}

describe('Unit tests', () =>{
    let redis:Redis

    beforeAll(() =>{
        redis = new Redis()
    })

    beforeEach(async () => {
        console.info('PURGING REDIS')
        await redis.purge()
    })

    afterAll(() =>{
         redis.disconnect()
    })

    test('Simple stream request', async () => {
        const sampleText = 'Hi! My name is (what?), my name is (who?), my name is Slim Shady'
        const stream = Readable.from(sampleText)
        await wordCounterService.countWords(stream)
        sleep(500)
        expect(await wordCounterService.getWordCount('my')).toEqual(3)
        expect(await wordCounterService.getWordCount('what')).toEqual(1)
        expect(await wordCounterService.getWordCount('My')).toEqual(0)
    })
    
    test('Simple file request', async () => {
        const sampleText = '/var/www/app/src/test/assets/test-file.txt'
        const stream = Readable.from(sampleText)
        await wordCounterService.countWords(stream)
        sleep(500)
        expect(await wordCounterService.getWordCount('citaaay')).toEqual(9)
        expect(await wordCounterService.getWordCount('shake')).toEqual(26)
        expect(await wordCounterService.getWordCount('pokemon')).toEqual(0)
    })
})
/** deletes DB before each test */
