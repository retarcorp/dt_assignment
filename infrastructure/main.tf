provider "aws" {
  region = "eu-west-3"
}

resource "aws_ssm_parameter" "read_api_key" {
  name      = "/dt_assignment/read_api_key"
  type      = "String"
  value     = var.read_api_key

  lifecycle {
    ignore_changes = [ value ]
  }
}

output "read_api_key_url" {
  value = aws_ssm_parameter.read_api_key.arn
}