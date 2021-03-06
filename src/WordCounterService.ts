import Redis from './utils/redis'
import {Readable} from 'stream'
import { fileLoader, urlLoader } from './utils/dataLoaders'
const peek = require('buffer-peek-stream').promise

export default class WordCounterService{
    private redis:Redis

    constructor(){
        this.redis = new Redis()
    }

    public destroy(){
        this.redis.disconnect()
    }

    private isStringUrl(str:string):boolean{
        const urlPrefixes = ['http://','https://','www.']
        for(const prefix of urlPrefixes){
            if(str.startsWith(prefix)){
                return true
            }
        }
        return false
    }

    private isStringFilePath(str:string):boolean{
        return str.startsWith('/')
    } 
    
    public async getWordCount(word:string):Promise<number>{
        return await this.redis.getWordCount(word)
    }
    /** finds the right stream, file, url or request and calls countWordsFromStream  */
    public async countWords(stream:Readable):Promise<void>{
        const source = await this.getSourceStream(stream)
        await this.countWordsFromStream(source)
    }
    /**
     * @returns a file stream if text is a file path,
     * a url stream if text is a url or the input stream otherwise
     * @param stream 
     */
    private async getSourceStream(stream:Readable):Promise<Readable> {
        const [buffer, outputStream] = await peek(stream, 65536)
        const text = buffer.toString('utf-8')
        if(this.isStringFilePath(text)){
            return await fileLoader(text)
        } else if(this.isStringUrl(text)){
            return await urlLoader(text)
        }
        return outputStream 
       
    }

    /**
     * counts words from the stream and adds to redis
     * @param stream Readable stream of text
     */
    private async countWordsFromStream(stream:Readable){
        await new Promise((resolve, reject) => {
            let prevWord = ''
            stream.on('data', async (chunk) => {
                const text = Buffer.from(chunk).toString('utf-8')

                if (prevWord && /\s/.test(text.charAt(0))) {
                    await this.redis.increaseWordCount(prevWord)
                    prevWord = ''
                }

                const words = text.split(/\s+/)
                    .map(word => word.replace(/[^A-Za-z'-]/g, '').toLowerCase())
                    .filter(word => word)
                let wordsToInc: string[] = []
                for (let i = 0; i < words.length; i++) {
                    let word = words[i]
                    if (i === 0 && prevWord) {
                        word = prevWord + word
                        prevWord = ''
                    }
                    else if (i === words.length - 1 && !/\s/.test(text.charAt(text.length - 1))) {
                        prevWord = word        
                        stream.emit('done')
                        break
                    }
                    wordsToInc.push(word)
                }
                await this.redis.increaseWordsCount(words)

            })

            /** this handles the edge case that the last
             * word in the text is written to prevWord but isn't used in the next iteration*/
            stream.on('end', () => {
                stream.on('done', async () => {
                    if (prevWord) {
                        await this.redis.increaseWordCount(prevWord)
                    }
                })
                resolve()
            })
           
            stream.on('error' ,(err) =>{
                reject(err)
            })
        })

    
    }
}