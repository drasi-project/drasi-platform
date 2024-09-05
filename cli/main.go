package main

import (
	"drasi.io/cli/cmd"
	"fmt"
	"os"
)

func main() {

	var rootCommand = cmd.MakeRootCommand()
	if err := rootCommand.Execute(); err != nil {
		fmt.Println()
		fmt.Println(err)
		os.Exit(1)
	}

}
