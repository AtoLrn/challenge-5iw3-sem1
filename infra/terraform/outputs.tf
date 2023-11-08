output "kubeconfig" {
  value     = ovh_cloud_project_kube.k8s_cluster.kubeconfig
  sensitive = true
}
