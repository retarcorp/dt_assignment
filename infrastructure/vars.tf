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

variable "api_gateway_name" {
  description = "API Gateway name"
  type        = string
  default     = "DTAssignmentAPI"
}

variable "read_api_key" {
  description = "Read API key"
  type        = string
  default     = "<specify your read api key>"
}