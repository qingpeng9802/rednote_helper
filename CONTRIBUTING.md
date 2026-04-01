## Development  
Install:
```shell
npm install
```
Lint: 
```shell
npm run lint
```  
Typescript typecheck: 
```shell
npm run tscc
```  
Package the extension: 
```shell
zip -rv9 rednote_helper_app.zip ./rednote_helper_app/
```  

## Update Types  
Copy types for no npm development: 
```shell
mkdir -p @types/chrome && cp -r node_modules/@types/chrome/{index.d.ts,chrome-cast,har-format} @types/chrome
```