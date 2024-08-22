package config

var Version string
var Registry string

func init() {
	if Version == "" {
		Version = "latest"
	}

	if Registry == "" {
		Registry = "ghcr.io"
	}
}
