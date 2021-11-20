#!/bin/bash
echo running tacotron server
sudo nohup python tacotron/tts_backend.py &
echo running rasa action server along with rasa rest api
cd backend 
rasa run -m models --enable-api --cors '*' &
P1=$!
rasa run actions & 
P2=$!
echo building and serving our frontend
cd ../frontend && yarn build 
yarn serve &
P3=$!
wait $P1 $P2 $P3
