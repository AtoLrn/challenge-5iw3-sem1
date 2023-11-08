resource "ovh_cloud_project_kube" "k8s_cluster" {
  service_name = var.service_name
  name         = "inkit-esgi-cluster"
  region       = "GRA7"
  version      = "1.26"
}

resource "ovh_cloud_project_kube_nodepool" "node_pool" {
  service_name  = var.service_name
  kube_id       = ovh_cloud_project_kube.k8s_cluster.id
  name          = "node-pool"
  flavor_name   = "d2-4"
  desired_nodes = 1
  max_nodes     = 3
  min_nodes     = 1

  monthly_billed = false
}
