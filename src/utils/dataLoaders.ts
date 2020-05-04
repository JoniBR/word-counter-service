import { Readable } from "stream";
import { createReadStream, exists } from 'fs'
const simpleGet = require('simple-get') 
import {promisify} from 'util'

const isFile = promisify(exists)
const get = promisify(simpleGet)
/**
 * @returns a read stream of the file in the given path
 * @param path path to a file
 * @throws if file doesn't exist at the given path
 */
export const fileLoader = async (path:string):Promise<Readable> => { 
    if (!(await isFile(path))){
        throw new Error(`File doesn't exist at the provided path`)
    }
    console.info(`Loading file from path:${path}.`)
    return createReadStream(path, {encoding: 'utf-8', autoClose:true})
}

export const urlLoader = async(url:string) : Promise<Readable> => {
    let addPrefix = url.startsWith('www')
    try{
        return await get(addPrefix ? 'http://' + url : url)
    }catch(error){
        if(addPrefix){
            return urlLoader('https://' + url)
        }
        console.error('error getting data from url',error)
        throw new Error('Invalid URL')
    }
} 

