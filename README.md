# Word counter service
This service exposes 2 APIs: 
1. Receives a text input and counts the number of appearances for each word in the input.
2. Receives a word and returns the number of times the word appeared so far (in all previous calls).

Requirements: [Docker Community Edition](https://www.docker.com/community-edition)

To start the app run: `docker-compose up`.

It will then be started on port 3000.

# INPUTS
 ## URL
    any text sent that starts with the following prefix's will be treated as URL:
    1. `https://`
    2. `http://`
    3. 'www.`
## File
    any text that starts with `/` will be treated as a file path.
    only absolute paths (not relative) will work.
## Plain Text
    any plain text that isn't a url or a file.

# Endpoints

## Post text

```
POST
http://localhost:3000
```

## Get counts
```
 GET
 http://localhost:3000/statistics/:word
```
where :word is the word you want the count of.

# Test
`npm run test`

