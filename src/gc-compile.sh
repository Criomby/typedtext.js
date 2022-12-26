# get most revent dev version of typedtext.js and output compiled to dist folder
java -jar ../../closure-compiler/closure-compiler-v20221102.jar --js ../dist/typedtext.js --js_output_file ../dist/typedtext.min.js

#colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# check if return value of java operation == 0 (successfully compiled)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Minified typedtext.js!${NC}\n"
else
    echo -e "${RED}GC-Compiler FAILED${NC}"
fi