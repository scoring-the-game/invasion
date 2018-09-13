#!/bin/bash
cd -- "$(dirname "$BASH_SOURCE")"
yarn
`sleep 5 && open http://localhost:1234/` &
yarn serve
