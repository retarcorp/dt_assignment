cd infrastructure 
cd server 
terraform init
terraform apply -auto-approve

cd ../client
terraform init
terraform apply -auto-approve

cd ../../server
npm install
npm run build
npm run deploy

cd ../client
npm install
npm run sync-bucket-name
npm run build
npm run deploy

sleep 1
cd ../infrastructure/client
echo "#########################################################"
echo "Remote website is available here: $(terraform output url)"