resource "aws_dynamodb_table" "dynamodb_table" {
  name         = var.db_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
  tags = {
    Name = "DTAssignmentTable"
  }
}

output "db_table_name" {
  value = aws_dynamodb_table.dynamodb_table.name
}