
The AWS EventBridge Reaction generates [CloudEvents](https://cloudevents.io/) from Continous Query results and publishes them to an AWS EventBus. The output format can either be the packed format of the raw query output or an unpacked format, where a single CloudEvent represents one change to the result set.

The EventBridge Reaction supports using either IAM roles for service accounts ([IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)) or IAM User keys.

## Prerequisites
On the computer from where you will create the Reaction, you need the following software:
- [Drasi CLI](/reference/command-line-interface/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Kubectl](https://kubernetes.io/docs/reference/kubectl/) 

Additionally, you should
- Have an [EKS cluster](https://aws.amazon.com/eks/) with Drasi installed. For instructions on how to set this up, please refer to this [tutorial](/how-to-guides/installation/install-on-eks).


## Creating the Reaction
To create a Reaction, execute the `drasi apply` command as follows:

```text
drasi apply -f my-reaction.yaml
```

The `drasi apply` command is how you create all new Drasi resources (in this case a Reaction). The `-f` flag specifies that the definition of the new Reaction is contained in the referenced YAML file `my-reaction.yaml`.

## Reaction Definitions
The YAML file passed to `drasi apply` can contain one or more Reaction definitions. The EventBridge Reaction can use either IRSA or AWS IAM User access key for authentication. The examples below demonstrate both methods:


### Authenticate using IRSA

1. Create an [OIDC provider](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) for your EKS cluster.
2. Create and assign IAM roles to a Kubernetes service account.
   1. Navigate to the IAM service in the AWS Management COnsole
   2. In the left sidebar, click on Roles and then Create role.
   3. Select **Web identity** as the trusted entity type. Choose the OIDC provider associated with your EKS cluster.
   4. Under **Audience**, select the sts.amazonaws.com option.
   5. In the **Condition** section, add a condition where 
        - `Key` has the format (use the OIDC provider associated with your EKS cluster): `<OIDC_provider_URL>:sub`
        - `Condition`: `StringLike`
        - `Value`: `"system:serviceaccount:drasi-system:*"`
    6. Navigate to the next page where you can add permissions to the IAM role. For EventBridge Reaction, add the AWS managed `AmazonEventBridgeFullAccess` policy. You can also create and add a customer managed policy.
    7. Navigate to the next page and create the role.
3. You have now created an IAM role, provided sufficient permissions to it and associated with your EKS cluster. The following YAML file contains the definition that uses this IAM role.

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: EventBridge
  identity:
    kind: AwsIamRole
    roleArn: arn:aws:iam::<iam-user-id>:role/<role-name>
  queries:
    <query-id>:
  properties: 
    eventBusName: drasi-eventbus
```

In this definition: 
- the **apiVersion** must be **v1**.
- the **kind** property tells Drasi to create a **Reaction** resource.
- the **spec.kind** property tells Drasi the kind of Reaction to create, in this case a **EventBridge** Reaction. 
- the **name** property tells Drasi the identity of the Reaction and must be unique within the scope of Reactions within the target Drasi environment. In the above example, the **name** of the Reaction is **my-reaction**.


This table describes the other settings in the **spec** section of the Reaction definition:
|Property|Description|
|-|-|
| identity | Specifies the type of identity to use for authentication. For IRSA, the kind should be `AwsIamRole` and it has a required property called `roleArn`. Replace this with the ARN of your IAM Role.
| queries | Specifies the set of **names** of the Continuous Queries the Reaction will subscribe to. |
| properties.eventBusName| Name of the custom event bus that you wish to put events to. The default value is `default` |
| properties.format | The output format for the messages that are enqueued. The can either be **packed** for the raw query output or **unpacked** for a message per result set change. The default value is **packed** |


### Authenticate using AWS User Access Key
1. Sign in to the [IAM console](https://console.aws.amazon.com/iam)
2. In the navigation bar on the upper right, choose your user name, and then choose Security credentials.
3. In the Access keys section, choose Create access key. Store the Access Key ID and Secret Access key.

The following YAML file uses these information to authenticate the EventBridge Reaction:

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: EventBridge
  identity:
    kind: AwsIamAccessKey
    accessKeyId: <id>
    secretAccessKey: <secret-key>
    region: us-east-2
  queries:
    <query-id>:
  properties: 
    eventBusName: drasi-eventbus
```
In this definition: 
- the **apiVersion** must be **v1**.
- the **kind** property tells Drasi to create a **Reaction** resource.
- the **spec.kind** property tells Drasi the kind of Reaction to create, in this case a **EventBridge** Reaction. 
- the **name** property tells Drasi the identity of the Reaction and must be unique within the scope of Reactions within the target Drasi environment. In the above example, the **name** of the Reaction is **my-reaction**.


This table describes the other settings in the **spec** section of the Reaction definition:
|Property|Description|
|-|-|
| identity | Specifies the type of identity to use for authentication. When using Access Key ID, the kind should be `AwsIamAccessKey`. It has three required fields: `accessKeyId`, `secretAccessKey` and `region`.
| queries | Specifies the set of **names** of the Continuous Queries the Reaction will subscribe to. |
| properties.eventBusName| Name of the custom event bus that you wish to put events to. The default value is `default` |
| properties.format | The output format for the messages that are enqueued. The can either be **packed** for the raw query output or **unpacked** for a message per result set change. The default value is **packed** |


#### Secret Configuration
It is best practice to store private credentials in a secret, which can be created using `kubectl`. The example below creates a Secret with the name `eventbridge-creds`, containing two keys (`accessKeyId`,`secretAccessKey`) in the `drasi-system` namespace. Secrets must be in the same Kubernetes namespace as your Drasi installation in order to be referenced. 
```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: EventBridge
  identity:
    kind: AwsIamAccessKey
    accessKeyId: 
      kind: Secret
      name: eventbridge-creds
      key: accessKeyId
    secretAccessKey: 
      kind: Secret
      name: eventbridge-creds
      key: secretAccessKey
    region: us-east-2
  queries:
    message-count:
  properties: 
    eventBusName: drasi-eventbus
    AWS_REGION: <query-id>:
```