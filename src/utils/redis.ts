import IORedis from 'ioredis'
export default class Redis{

    private client: IORedis.Redis

    constructor(){
        const redisUrl = process.env.REDIS_URL
        if(!redisUrl){
            throw new Error('Missing `REDIS_URL` env variable')
        }
            this.client = new IORedis(redisUrl)
    }


    public disconnect():void {
        try {
            console.info('Disconnecting from Redis')
             this.client.disconnect()
        } catch (err) {
            console.error('Failed to disconnect from redis with error', err)
            throw err
        }
    }

    /**
     *  increase the count of one word
     * @param word 
     */
    public async increaseWordCount(word:string):Promise<void>{
        try{
            await this.client.incr(word)
        } catch(err){
            console.error('Increasing word count failed with error' , err)
        }
    }
    /**
     * increases the count of multiple words
     * @param words 
     */
    public async increaseWordsCount(words: string[]): Promise<void> {
        try {
            const pipeline = this.client.pipeline()
            for(const word of words){
                pipeline.incr(word)
            }
            await pipeline.exec()
        } catch (err) {
            console.error('Increasing word count failed with error', err)
        }
    }
    
    /**
     * get the count of one word from cache, if the word doesn't exists return 0
     * @param word 
     */
    public async getWordCount(word:string) :Promise<number>{
            const wordCount =  await this.client.get(word) 
            if(!wordCount){
                return 0
            } else{
                return parseInt(wordCount)
            }
        }

    public async purge(){
        await this.client.flushall()
    }
       
}