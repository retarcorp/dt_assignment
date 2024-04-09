echo "Enter Read API Key for Movies API: "
read READ_API_KEY

cd ./server
npm install
npm run build
npm run deploy

cd ../infrastructure 
cd server 
terraform init
terraform apply -auto-approve

echo "Setting API key"
aws ssm put-parameter --name '/dt_assignment/read_api_key' --value $READ_API_KEY --overwrite

cd ../client
terraform init
terraform apply -auto-approve

cd ../../client
npm install
npm run sync-bucket-name
npm run build
npm run deploy

sleep 1
cd ../infrastructure/client
echo "========================================================="
echo "Remote website is available here: $(terraform output url)"