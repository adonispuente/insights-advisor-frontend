# Populate a Broker instance with test data

After provisioning and starting a Broker instance, it has no content, hosts, or Insights data. Follow these steps to register a host and generate Advisor recommendations and Vulnerability CVEs.

## Prerequisites

- A running Broker instance with IoP enabled and Foreman started
- VPN access
- SSH access to the Broker (default: `vagrant` / `changeme`)
- A Red Hat account with access to [console.redhat.com](https://console.redhat.com)

## 1. Create and import a Satellite manifest

A manifest authorizes your Foreman instance to pull Red Hat content.

1. Go to [console.redhat.com/subscriptions/manifests](https://console.redhat.com/subscriptions/manifests).
2. Create a new manifest or use an existing one. Give it a recognizable name (e.g., `iop-dev-advisor`).
3. Download the manifest `.zip` file.
4. Log into the Foreman UI at `https://<your-hostname>` (`admin` / `changeme`).
5. Navigate to **Content > Subscriptions**.
6. Click **Manage Manifest** (top right) and upload the `.zip` file.
7. After import, check **Content > Subscriptions > Add Subscriptions**. If "Employee SKU" is not listed, add it.

## 2. Enable Red Hat repositories

Foreman needs content repositories to provide packages and errata to registered hosts.

1. Navigate to **Content > Red Hat Repositories**.
2. Click the star icon to filter to **Recommended Repositories** only.
3. Enable repos matching the RHEL version of the host you will register. For a RHEL 9.8 host (including the Broker VM itself):
   - **Red Hat Enterprise Linux 9 for x86_64 - BaseOS (RPMs)**
   - **Red Hat Enterprise Linux 9 for x86_64 - AppStream (RPMs)**
4. If registering hosts running other RHEL versions, enable those repos too.

## 3. Sync content repositories

1. Navigate to **Content > Sync Status**.
2. Click **Expand All**.
3. Select all enabled repositories.
4. Click **Synchronize Now**.
5. Wait for sync to complete. This can take 10-30+ minutes depending on the repos. The page shows progress for each repo.

You can continue to step 4 while repos are syncing, but the host won't see all available errata until the sync finishes.

## 4. Create an activation key

An activation key associates a host with a content view and lifecycle environment.

1. Navigate to **Content > Lifecycle > Activation Keys**.
2. Click **Create Activation Key**.
3. Give it a name (e.g., `dev-key`).
4. Under **Assign content view environments**, select:
   - Environment: **Library**
   - Content View: **Default Organization View**
5. Save the key.

## 5. Generate a registration command

1. Navigate to **Hosts > Register Host**.
2. On the **General** tab:
   - Select the activation key you just created.
   - Check the **Insecure** checkbox (the dev instance uses a self-signed certificate).
3. On the **Advanced** tab:
   - Set **Setup Insights** to **Yes**.
4. Click **Generate**.
5. Copy the generated `curl` command.

## 6. Register a host

You can register the Broker VM itself or a separate RHEL host. The host must be able to reach the Broker over the network (both are typically on VPN).

### Register the Broker VM as its own host

SSH into the Broker:

```bash
ssh -o PubkeyAuthentication=no vagrant@<your-hostname>
# password: changeme
```

Run the registration command as root. The generated command pipes curl output to bash, so the entire pipeline must run as root. Use `--http1.1` to avoid protocol errors with the dev Foreman server:

```bash
sudo bash -c 'curl --http1.1 --silent --show-error --insecure \
  "https://<your-hostname>/register?activation_keys=<your-key>&..." \
  --header "Authorization: Bearer <token>" | bash'
```

**Important**: Paste the command on a single line or use proper line continuations. Line breaks inside the URL or token will cause `curl` parse errors.

If your terminal wraps the command and breaks it, you can run it via the iop-dev SSH helper from your local machine instead:

```bash
cd /path/to/iop-dev
.venv/bin/python -c '
from iop.ssh_client import ssh_connect
with ssh_connect("<your-hostname>") as client:
    out, err, status = client.run("sudo bash -c '\''curl --http1.1 --silent --show-error --insecure \"https://<your-hostname>/register?activation_keys=<your-key>&...\" --header \"Authorization: Bearer <token>\" | bash'\''", check=False)
    print(out)
    print(err)
    print("exit:", status)
'
```

### Register a separate RHEL host

If you have another RHEL VM (e.g., from `broker checkout --workflow deploy-rhel --deploy_rhel_version 9.8`):

1. SSH into that host.
2. Run the registration command as root.
3. The host must be able to reach the Broker hostname over the network.

### What registration does

The registration script:

1. Installs Foreman's CA certificate.
2. Registers the host with `subscription-manager`.
3. Installs and configures `insights-client`.
4. Runs an initial `insights-client` upload, which sends the system profile to the Insights services.

This takes a few minutes. After completion you should see `Successfully registered` and `Successfully uploaded report`.

## 7. Verify data is available

After registration and the initial insights-client upload:

### In the Foreman UI

- **Hosts > All Hosts**: the registered host should appear.
- **Content > Errata**: applicable errata for the registered host's packages.
- The host detail page should show an Insights tab with applicable recommendations.

### For Advisor

Navigate to the Advisor iframe route:

```
https://<your-hostname>/foreman_rh_cloud/insights_advisor/recommendations
```

You should see recommendations applicable to the registered host. The number of recommendations depends on the host's installed packages and configuration.

If the list is empty, check:

- `insights-client` ran successfully on the host (`sudo insights-client --status`).
- The IoP Smart Proxy is registered and reachable (check **Infrastructure > Smart Proxies**).
- The Advisor backend containers are running (`sudo systemctl list-units | grep advisor`).
- Run a manual upload: `sudo insights-client` on the registered host.

### For Vulnerability

Navigate to the Vulnerability iframe route:

```
https://<your-hostname>/foreman_rh_cloud/insights_vulnerability
```

CVEs should appear for the registered host based on its installed package versions.

## 8. Additional test data

### Multiple hosts

Register additional hosts with different RHEL versions or package sets to get varied recommendations and CVEs. Each host needs access to the Broker and a valid registration command.

### Trigger specific recommendations

Install or configure packages known to trigger specific Advisor rules. For example, packages with known configuration issues will generate stability or security recommendations.

### Force a re-upload

If the host is registered but no data appears, force a fresh insights-client run:

```bash
sudo insights-client --verbose
```

Check the output for errors connecting to the Foreman proxy or uploading the archive.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Registration says "run as root" | Wrap the entire command in `sudo bash -c '...'` |
| `curl: (92) HTTP/2 stream 0 was not closed cleanly` | Add `--http1.1` to the curl command |
| `curl: (3) URL using bad/illegal format` | Line breaks in the pasted command; paste on a single line |
| Registration succeeds but no host in Foreman | Check the organization/location context in the UI matches the activation key |
| Host appears but no Insights data | Run `sudo insights-client` on the host and check for errors |
| `insights-client` fails to upload | Check Smart Proxy availability and network connectivity between host and Broker |
| No recommendations despite successful upload | Backend may need time to process; check Advisor backend container logs |
| Repo sync fails or is very slow | Verify VPN is connected and the Broker can reach CDN; try syncing one repo at a time |
