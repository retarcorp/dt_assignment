// Create S3 bucket with public access and static website hosting from /client/build folder

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  lower   = true
  upper   = false
}

resource "aws_s3_bucket" "www_bucket" {
  bucket        = "www-dt-assignment-${random_string.bucket_suffix.result}"
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "www_bucket" {
  bucket = aws_s3_bucket.www_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "website_oc" {
  bucket = aws_s3_bucket.www_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "bucket_access_block" {
  bucket = aws_s3_bucket.www_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  bucket = aws_s3_bucket.www_bucket.id
  depends_on = [
    aws_s3_bucket_public_access_block.bucket_access_block,
    aws_s3_bucket_ownership_controls.website_oc
  ]

  acl = "public-read"
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.www_bucket.id

  depends_on = [
    aws_s3_bucket_acl.bucket_acl,
    aws_s3_bucket_public_access_block.bucket_access_block,
    aws_s3_bucket_ownership_controls.website_oc,
    aws_s3_bucket_website_configuration.www_bucket
  ]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject",
          "s3:PutBucketPolicy"
        ]
        Resource = [
          aws_s3_bucket.www_bucket.arn,
          "${aws_s3_bucket.www_bucket.arn}/*"
        ]
      }
    ]
  })
}

output "url" {
  value = "http://${aws_s3_bucket.www_bucket.bucket}.s3-website.eu-west-3.amazonaws.com"
}

output "bucket_name" {
  value = aws_s3_bucket.www_bucket.bucket
}
