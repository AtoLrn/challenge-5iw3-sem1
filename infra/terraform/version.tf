terraform {
  required_providers {
    ovh = {
      source = "ovh/ovh"
    }
  }

  backend "s3" {
    bucket = "lucas-tf-remote-backend"
    key    = "inkit/terraform.tfstate"
    region = "eu-west-3"
  }
}
