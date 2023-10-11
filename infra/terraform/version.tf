terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket = "lucas-tf-remote-backend"
    key    = "inkit/terraform.tfstate"
    region = "eu-west-3"
  }
}

