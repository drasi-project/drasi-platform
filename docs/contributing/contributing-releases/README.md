# How to create and publish a Drasi release

## Prerequisites

- Determine the release version number. This is in the form `<major>.<minor>.<patch>`

## Terminology

- **RC Release**: A release candidate that we can test internally before releasing to the public which we can run validation on. If we find issues in validation, we can create additional RC releases until we feel confident in the release. Example: `0.21.0-rc1` or `0.21.0-rc2`
- **Final Release**: A release that is ready to be published to the public. Example: `0.21.0`
- **Patch Release**: A release that contains bug fixes and patches for an already-created release. Example: `0.21.1`
- **Release Branch**: A branch in the `drasi-project/drasi-platform` repo that contains the release version. Example: `release/0.21`


> ⚠️ Compatibility ⚠️
At this time we do not guarantee compatibility across releases or provide a migration path. For example, the behavior of a `0.1` `drasi` CLI talking to a `0.2` control plane is unspecified. We expect the project to change too frequently to provide compatibility guarantees at this time.


## Release Process

For the entire release process, directly clone the `drasi-project/drasi-platform` repo and create branches off of it. Do not create branches in your personal forks when creating pull requests.

### Creating an RC release

When starting the release process, we first kick it off by creating an RC release. If we find issues in validation, we can create additional RC releases until we feel confident in the release.

Follow the steps below to create an RC release.

1. Clone the [drasi-project/drasi-platform](https://github.com/drasi-project/drasi-platform) repo locally.
   ```
   git clone git@github.com:drasi-project/drasi-platform.git
   ```

1. Create a new branch from `main` or whichever branch has the changes you wish to release.
   ```
   git checkout main
   git checkout -b release/<VERSION>
   ```

1. Push the changes to a remote branch.
   ```
   git push origin release/<VERSION>
   ```

1. Run the `Draft Release` workflow against this branch, and specify the same version number, eg `0.1.0-rc1`    

1. This will build the CLI with the version string as the default version of Drasi container images to use. It will also publish all the container images to the container register with a tag that matches the version string.

1. It will also create a release in draft status with the title of the version string.

1. Review the draft release and releases notes and publish when ready.



### Creating the final release

Once an RC release has been created and validated, we can proceed to creating the final release.

Follow the steps below to create a final release.

1. Clone the [drasi-project/drasi-platform](https://github.com/drasi-project/drasi-platform) repo locally.
   ```
   git clone git@github.com:drasi-project/drasi-platform.git
   ```

1. Create a new branch from release RC branch that has the changes you wish to release.
   ```
   git checkout release/0.1.0-rc1
   git checkout -b release/0.1.0
   ```

1. Push the changes to a remote branch.
   ```
   git push origin release/0.1.0
   ```

1. Run the `Draft Release` workflow against this branch, and specify the same version number, eg `0.1.0`    

1. This will build the CLI with the version string as the default version of Drasi container images to use. It will also publish all the container images to the container register with a tag that matches the version string.

1. It will also create a release in draft status with the title of the version string.

1. Review the draft release and releases notes and publish when ready.
 

