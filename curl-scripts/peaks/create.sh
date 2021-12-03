# NAME="Mt. Marcy" ELEVATION="5344 feet" LENGTH="14.8 miles" HIKE_TIME="10 hours" DIFFICULTY="5" OWNER="" sh curl-scripts/peaks/create.sh

curl 'http://localhost:4741/peaks' \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "peak": {
      "name": "'"${NAME}"'",
      "elevation": "'"${ELEVATION}"'",
      "length": "'"${LENGTH}"'",
      "hike_time": "'"${HIKE_TIME}"'",
      "difficulty": "'"${DIFFICULTY}"'",
      "owner": "'"${OWNER}"'"
    }
  }'