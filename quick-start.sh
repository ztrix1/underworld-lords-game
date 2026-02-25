#!/bin/bash
cd /workspaces/underworld-lords-game/server && npm run dev &
sleep 2
cd /workspaces/underworld-lords-game/client && python3 -m http.server 8080 &
echo "✅ System ready!"
