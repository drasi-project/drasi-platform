package main

import (
	"context"
	"encoding/json"
	"github.com/dapr/go-sdk/service/common"
	daprd "github.com/dapr/go-sdk/service/http"
	"log"
	"net/http"
)

func startAcquireService() {
	s := daprd.NewService(":8080")

	if err := s.AddServiceInvocationHandler("/acquire", acquireHandler); err != nil {
		log.Fatalf("error adding acquire handler: %v", err)
	}

	if err := s.Start(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("error listenning: %v", err)
	}
}

func acquireHandler(ctx context.Context, in *common.InvocationEvent) (out *common.Content, err error) {
	data := make(map[string]any)
	data["nodes"] = make([]any, 0)
	data["rels"] = make([]any, 0)

	dataBytes, _ := json.Marshal(data)

	out = &common.Content{
		Data:        dataBytes,
		ContentType: "application/json",
	}
	return out, nil
}
