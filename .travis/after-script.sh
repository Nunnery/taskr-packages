# after-script.sh
#!/bin/bash
if [[ "$TRAVIS_PULL_REQUEST" == "false" && "$TRAVIS_NODE_VERSION" == "9" ]]
then
    npm run test:coverage
fi