echo "["
sed "s/^{ created_at/@\'created_at\'/" $1 | sed 's/\[Object\]/null/g'   | grep -v "retweeted_status" |  sed 's/"//g' | sed 's/\s\s*\([A-Za-z_][A-Za-z_]*\):/"\1":/' | sed 's/^@/,\{/' | sed "s/'/\"/g" 
echo "]"
