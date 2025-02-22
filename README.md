# Orthanc Configuration Repository

This repository is for configuration management to orchestrate containers to host an Orthanc service. There are two modes:
1. `DEV` mode: for hosting Orthanc services in a local development environment such as laptop (Linux/MacOS).
2. `AWS` mode: for hosting Orthanc services on EC2 instances provisioned in the [Orthweb](https://github.com/digihunch/orthweb) project. 

The two modes are different in terms of how data store are implemented, as outlined below.

| Component              | DEV mode | AWS mode |
| :---------------- | :------: | ----: |
| Orthanc Database |  local PostgreSQL container   | RDS PostgreSQL |
| Storage    |  data directory   | S3 bucket |
| Default Site URL |  localhost   | EC2 Public DNS name |

The configuration is driven by a `makefile` that orchestrate the steps required in each scenario.

## Configure DEV mode on a Laptop (MacOS or Linux)
Use this mode for development work for customization scripts (e.g. server-side scripting) on a development environment such as Laptop (MacOS/Linux):

1. Clone this repository. It should be cloned to the current user directory:
      ```sh
      git clone git@github.com:digihunchinc/orthanc-config.git
      ```

2. Ensure the required packages are installed. Check `dep` and `dep_ec2` steps for the specific required packages being examined;
3. Modify `.env` file to update any username, passwords and image references. Do not use the original password! 
4. Go to the project directory, execute the steps for `dev`: 

      ```sh
      make dev
      ```
      The command should generate `docker-compose.yaml` file based on the variables in `.env` file.

5. Run the following command to bootstrap for the first time, and ensure to monitor the standard output.

      ```sh
      docker compose up
      ```

Once launched, the services are exposed on localhost on port 443. The configuration requires using full domain name, such as:
- For Orthanc login: https://orthweb.digihunch.com/orthanc 

Note that using `localhost` as domain name will NOT work. As a workaround, consider editing hosts file `/etc/hosts`, by adding an entry `127.0.0.1 orthweb.digihunch.com`, and bypass browser warnings.

## Configure AWS mode on an EC2 instance

Use this mode for test or production environment an EC2 instance. The configuration should be highly automated, drven by the cloud init script. 

For example, the step to clone the repo, and the step to update variables in `.env` are both to be implemented in the cloud init [script](https://github.com/digihunch/orthweb/blob/main/terraform/modules/ec2/userdata2.tpl). 

The script will then execute a command as defined in the input variable of the Terraform template, which is by default:
```sh
cd orthanc-config && make aws
```

If the result isn't expected, review the cloud init log at `/var/log/cloud-init-output.log` on the EC2 instance.

## Troubleshooting

When running `docker compose up` with `-d` switch, the standard process is detached from standard output. To follow the log, use logs command:
```sh
docker compose logs -n 100 -f
```
If the docker daemon is configured to push logs to Cloud Watch, you can find out logs on Cloud Watch log groups.

To analyze network traffic, if the test host has wiresharek, you may display web traffic using wireshark:
```sh
docker exec orthanc-backend tcpdump -pi eth0 -w - -s0 dst port 8042 or src port 8042 | wireshark -k -i -
```
