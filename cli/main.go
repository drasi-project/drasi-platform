package main

import (
	"drasi.io/cli/cmd"
	"os"
)

func main() {

	var rootCommand = cmd.MakeRootCommand()
	if err := rootCommand.Execute(); err != nil {
		os.Exit(1)
	}

}
