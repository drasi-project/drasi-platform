package main

import (
	"drasi.io/cli/cmd"
	"fmt"
)

func main() {

	var rootCommand = cmd.MakeRootCommand()
	if err := rootCommand.Execute(); err != nil {
		fmt.Println(err)
	}

}
