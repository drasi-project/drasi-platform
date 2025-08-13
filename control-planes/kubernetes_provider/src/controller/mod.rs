// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use self::reconciler::{ReconcileStatus, ResourceReconciler};
use super::models::{KubernetesSpec, RuntimeConfig};
use tokio::{
    sync::{mpsc, oneshot, watch},
    task::JoinHandle,
};

pub mod reconciler;

enum Command {
    Reconcile(oneshot::Sender<()>),
    Deprovision(oneshot::Sender<()>),
    Terminate,
}

pub struct ResourceController {
    worker: JoinHandle<()>,
    status: watch::Receiver<ReconcileStatus>,
    commander: mpsc::UnboundedSender<Command>,
}

unsafe impl Send for ResourceController {}

impl ResourceController {
    pub fn start(kube_config: kube::Config, spec: KubernetesSpec, runtime_config: RuntimeConfig) -> Self {
        let name = format!("{}-{}", spec.resource_id.clone(), spec.service_name.clone());
        let mut reconciler = ResourceReconciler::new(kube_config, spec, runtime_config);

        let (status_tx, status_rx) = watch::channel(ReconcileStatus::Unknown);
        let (command_tx, mut command_rx) = mpsc::unbounded_channel();

        let worker = tokio::spawn(async move {
            log::info!("Controller started {}", name);
            while let Some(cmd) = command_rx.recv().await {
                match cmd {
                    Command::Reconcile(ret) => {
                        reconciler.reconcile().await;
                        status_tx.send_replace(reconciler.status.clone());
                        ret.send(());
                    }
                    Command::Deprovision(ret) => {
                        reconciler.remove().await;
                        status_tx.send_replace(reconciler.status.clone());
                        ret.send(());
                    }
                    Command::Terminate => {
                        break;
                    }
                }
            }
            log::info!("Controller ended {}", name);
        });

        Self {
            worker,
            status: status_rx,
            commander: command_tx,
        }
    }

    pub fn reconcile(&self) -> oneshot::Receiver<()> {
        let (ret_tx, ret_rx) = oneshot::channel();
        let _ = self.commander.send(Command::Reconcile(ret_tx));
        ret_rx
    }

    pub fn deprovision(&self) {
        let (ret_tx, _ret_rx) = oneshot::channel();
        let _ = self.commander.send(Command::Deprovision(ret_tx));
    }

    pub fn status(&self) -> ReconcileStatus {
        self.status.borrow().clone()
    }
}
