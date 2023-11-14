# Terraform infrastructure

First setup the AWS keys to acces terraform remote backend on AWS S3 (refer to Lucas to get the keys)
```bash
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
```

Then create a variable.tfvars with the OVH API access (refer to Antoine to get the access)
```
ovh_application_key    = ""
ovh_application_secret = ""
ovh_consumer_key       = ""
```

You can now launch the plan and apply
```bash
terraform plan -var-file="variables.tfvars"
terraform apply -var-file="variables.tfvars"
```

Get the k8s config:
```bash
terraform output kubeconfig
```
