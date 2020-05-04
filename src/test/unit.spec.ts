import Redis from '../utils/redis'
import { Readable } from 'stream'
import WordCounterService from '../WordCounterService'


const sleep = (ms:number) =>{
    return new Promise(resolve =>{
        setTimeout(() => resolve() , ms)
    })
}
describe('Unit tests', () => {
     let redis:Redis
     let wordCounterService: WordCounterService


    beforeEach(async () => {
        console.info('PURGING REDIS')      
        redis = new Redis()
        wordCounterService = new WordCounterService()
        await redis.purge()
    })

     afterEach(async() =>{
          redis.disconnect()
          wordCounterService.destroy()
     })

    test('Simple stream request', async (done) => {
        const sampleText = 'Hi! My name is (what?), my name is (who?), my name is Slim Shady'
        const stream = Readable.from(sampleText)
        await wordCounterService.countWords(stream)
        const res1 = await wordCounterService.getWordCount('my')
        expect(res1).toEqual(3)
        const res2 = await wordCounterService.getWordCount('what')
        expect(res2).toEqual(1)
        const res3 = await wordCounterService.getWordCount('My')
        expect(res3).toEqual(0)
        done()
    })
    
    test('Simple file request', async (done) => {
        const sampleText = '/var/www/app/src/test/assets/test-file.txt'
        const stream = Readable.from(sampleText)
        await wordCounterService.countWords(stream)
        const res1 = await wordCounterService.getWordCount('citaaay')
        expect(res1).toEqual(9)
        const res2 = await wordCounterService.getWordCount('shake')
        console.log(res2)
        expect(res2).toEqual(26)
        const res3 = await wordCounterService.getWordCount('morty')
        expect(res3).toEqual(0)
        done()
    })

    test('Simple url request', async (done) => {
        const sampleText = 'https://www.gutenberg.org/files/1342/1342-0.txt'
        const stream = Readable.from(sampleText)
        await wordCounterService.countWords(stream)
        await sleep(2000) // for big files it might take some time for the cache to finish updating
        const res1 = await wordCounterService.getWordCount('chapter')
        expect(res1).toEqual(122)
        const res2 = await wordCounterService.getWordCount('pride')
        expect(res2).toEqual(50)
        const res3 = await wordCounterService.getWordCount('pokemon')
        expect(res3).toEqual(0)
        done()
    })
})


