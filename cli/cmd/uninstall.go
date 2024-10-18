package cmd

import (
	"fmt"
	"log"
	"strings"

	"drasi.io/cli/service"
	"github.com/spf13/cobra"
)

func NewUninstallCommand() *cobra.Command {
	var uninstallCommand = &cobra.Command{
		Use:   "uninstall",
		Short: "Uninstall Drasi",
		Long: `Uninstall the Drasi environment from the the default or a specific namespace on the current Kubernetes cluster.
		
Usage examples:
  drasi uninstall
  drasi uninstall -n my-namespace
`,
		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg := readConfig()
			var err error
			var currentNamespace string
			if currentNamespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}
			if !cmd.Flags().Changed("namespace") {
				currentNamespace = cfg.DrasiNamespace
			}

			fmt.Println("Uninstalling Drasi")
			fmt.Println("Deleting namespace: ", currentNamespace)

			// Ask for confirmation if the user didn't pass the -y flag
			if !cmd.Flags().Changed("yes") {
				fmt.Printf("Are you sure you want to uninstall Drasi from the namespace %s? (yes/no): ", currentNamespace)
				if !askForConfirmation(currentNamespace) {
					fmt.Println("Uninstall cancelled")
					return nil
				}
			}

			err = service.UninstallDrasi(currentNamespace)
			if err != nil {
				return err
			}

			fmt.Println("Drasi uninstalled successfully")

			if uninstallDapr, _ := cmd.Flags().GetBool("uninstall-dapr"); uninstallDapr {
				fmt.Println("Uninstalling Dapr")
				err = service.UninstallDapr(currentNamespace)
				if err != nil {
					return err
				}
				fmt.Println("Dapr uninstalled successfully")
			}

			return nil
		},
	}

	uninstallCommand.Flags().BoolP("yes", "y", false, "Automatic yes to prompts")
	uninstallCommand.Flags().BoolP("uninstall-dapr", "d", false, "Uninstall Dapr by deleting the Dapr system namespace")

	return uninstallCommand
}

func askForConfirmation(namespace string) bool {
	var response string

	_, err := fmt.Scanln(&response)
	if err != nil {
		log.Fatal(err)
	}

	switch strings.ToLower(response) {
	case "y", "yes":
		return true
	case "n", "no":
		return false
	default:
		fmt.Println("I'm sorry but I didn't get what you meant, please type (y)es or (n)o and then press enter:")
		return askForConfirmation(namespace)
	}
}
