resource "aws_api_gateway_rest_api" "dt_movies_api" {
  name = var.api_gateway_name
}

resource "aws_api_gateway_resource" "movies" {
  rest_api_id = aws_api_gateway_rest_api.dt_movies_api.id
  parent_id   = aws_api_gateway_rest_api.dt_movies_api.root_resource_id
  path_part   = "movies"
}

resource "aws_api_gateway_method" "movies" {
  rest_api_id   = aws_api_gateway_rest_api.dt_movies_api.id
  resource_id   = aws_api_gateway_resource.movies.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.dt_movies_api.id
  resource_id             = aws_api_gateway_resource.movies.id
  http_method             = aws_api_gateway_method.movies.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.dt_assignment_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on  = [aws_api_gateway_integration.lambda_integration]
  rest_api_id = aws_api_gateway_rest_api.dt_movies_api.id
  stage_name  = "staging"
}

resource "aws_lambda_permission" "api_invoke_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dt_assignment_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dt_movies_api.execution_arn}/*/*"
}

output "base_url" {
  value = aws_api_gateway_deployment.api_deployment.invoke_url
}