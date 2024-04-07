provider "aws" {
  region = "eu-west-3"
}

resource "aws_ssm_parameter" "api_key" {
  name  = "/dt_assignment/api_key"
  type  = "String"
  value = "<specify your api key>"
}

resource "aws_ssm_parameter" "read_api_key" {
  name = "/dt_assignment/read_api_key"
  type = "String"
  value = "<specify your read api key>"
}