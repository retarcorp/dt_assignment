
data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    sid     = "AllowLambdaServiceToAssumeRole"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_execution_policy" {

  statement {
    sid    = "DynamoDBAccess"
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "CloudWatchLogsAccess"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "SSMParameterAccess"
    effect = "Allow"
    actions = [
      "ssm:GetParameter"
    ]
    resources = [
      aws_ssm_parameter.read_api_key.arn
    ]
  }
}

resource "aws_iam_policy" "lambda_execution_policy" {
  name   = "${var.lambda_name}ExecutionPolicy"
  policy = data.aws_iam_policy_document.lambda_execution_policy.json

}

resource "aws_iam_role" "lambda_execution_role" {
  name               = "${var.lambda_name}ExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_policy_attachment" "lambda_execution_policy_attachment" {
  name       = "${var.lambda_name}ExecutionPolicyAttachment"
  policy_arn = aws_iam_policy.lambda_execution_policy.arn
  roles      = [aws_iam_role.lambda_execution_role.name]
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "../server/dist/index.js"
  output_path = "../server/dist/lambda.zip"
}

resource "aws_lambda_function" "dt_assignment_lambda" {
  function_name    = var.lambda_name
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = data.archive_file.lambda.output_path
  source_code_hash = filebase64sha256(data.archive_file.lambda.output_path)
  environment {
    variables = {
      DB_TABLE_NAME = var.db_table_name
    }
  }
}

output "lambda_arn" {
  value = aws_lambda_function.dt_assignment_lambda.arn
}