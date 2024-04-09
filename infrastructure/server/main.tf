provider "aws" {
  region = "eu-west-3"
}

resource "aws_ssm_parameter" "read_api_key" {
  name  = "/dt_assignment/read_api_key"
  type  = "String"
  value = var.read_api_key

  lifecycle {
    ignore_changes = [value]
  }
}

output "read_api_key_url" {
  value = aws_ssm_parameter.read_api_key.arn
}

resource "local_file" "dotenv_server" {
  content = <<EOF
  DB_TABLE_NAME=${var.db_table_name}
  EOF

  filename = "../../server/.env"
}

resource "local_file" "dotenv_client" {
  content  = <<EOF
  REACT_APP_API_BASE_URL=${aws_api_gateway_deployment.api_deployment.invoke_url}/${aws_api_gateway_resource.movies.path_part}
  EOF
  filename = "../../client/.env"
}
