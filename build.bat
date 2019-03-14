rmdir /s /q dist
mkdir dist
xcopy src\package.json dist /S /E /H
cd dist
npm install
