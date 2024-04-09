## To Do
- Architecture & docs
- Future improvements
- List other possible architectures been under consideration


## Future improvements

- Husky

### Backend
- Express runtime
- ESLint

### Frontend
- Cypress tests for testing the app


## Installation
### Fast install
#### Step 1. Login to AWS
```
aws configure
```

#### Step 2. Run full install
```
sh install-all.sh
```

#### Step 3. Setup read API key in AWS SSM
Go https://eu-west-3.console.aws.amazon.com/systems-manager/parameters/ and set `/dt_assignment/read_api_key` parameter to your read api key value. Or setup value through aws cli: 
```
aws ssm put-parameter --name '/dt_assignment/read_api_key1' --value '<Your READ key here>' --overwrite
```