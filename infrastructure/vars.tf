variable "lambda_name" {
  description = "Lambda name"
  type        = string
  default     = "DTAssignmentLambda"
}

variable "db_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "DTAssignmentTable"

}