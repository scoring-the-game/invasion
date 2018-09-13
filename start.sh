#!/bin/bash
cd -- "$(dirname "$BASH_SOURCE")"
`sleep 5 && open http://localhost:1234/` &
yarn && yarn serve
