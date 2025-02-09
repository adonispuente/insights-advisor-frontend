const fixtures = {
  meta: {
    count: 50,
  },
  links: {
    first:
      '/api/insights/v1/rule/?impacting=true&limit=20&offset=0&rule_status=enabled&sort=-total_risk',
    next: '/api/insights/v1/rule/?impacting=true&limit=20&offset=20&rule_status=enabled&sort=-total_risk',
    previous:
      '/api/insights/v1/rule/?impacting=true&limit=20&offset=0&rule_status=enabled&sort=-total_risk',
    last: '/api/insights/v1/rule/?impacting=true&limit=20&offset=30&rule_status=enabled&sort=-total_risk',
  },
  data: [
    {
      rule_id: 'empty_grubenv|EMPTY_GRUBENV_KERNELOPTS',
      created_at: '2021-11-18T06:15:39.463490Z',
      updated_at: '2022-01-07T06:15:39.108363Z',
      description:
        'Reboot fails when there is no "kernelopts" option in the grubenv',
      active: true,
      category: {
        id: 3,
        name: 'Stability',
      },
      impact: {
        name: 'Boot Failure',
        impact: 4,
      },
      likelihood: 4,
      node_id: '6488061',
      tags: 'grub reboot sbr_shells',
      playbook_count: 1,
      reboot_required: false,
      publish_date: '2021-11-28T03:16:00Z',
      summary:
        'Reboot fails when there is no "kernelopts" option in the grubenv.\n',
      generic:
        'Reboot fails when there is no **"kernelopts"** option in the grubenv.\n',
      reason:
        'This host is running RHEL 8 with no **"kernelopts"** option in the `/boot/grub2/grubenv`. GRUB reads **"kernelopts"** option from grubenv file for boot entry **"root="**. If **"kernelopts"** option does not exist, **"root="** cannot get correct value. As a result, the initial boot sequence with initramfs does not mount the root filesystem and fails to start switch root.\n',
      more_info: '',
      impacted_systems_count: 18,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you update the `grubenv` file.\n\n1. Create an initialized `grubenv` file.\n   ~~~\n   # grub2-editenv /boot/grub2/grubenv create\n   ~~~\n\n2. Copy the current `grub.cfg` file as a backup.\n  {{? pydata.boot_type == "BIOS"}}\n   ~~~\n   # cp /etc/grub2.cfg /root/grub2.cfg.copy\n   ~~~{{?}}\n  {{? pydata.boot_type == "UEFI"}}\n   ~~~\n   # cp /boot/efi/EFI/redhat/grub.cfg /root/grub.cfg.copy\n   ~~~\n  {{?}}\n\n3. Re-generate the `grub.cfg` file and the boot parameters are written into the `grubenv` file.\n  {{? pydata.boot_type == "BIOS"}}\n   ~~~\n   # grub2-mkconfig -o /etc/grub2.cfg\n   ~~~{{?}}\n  {{? pydata.boot_type == "UEFI"}}\n   ~~~\n   # grub2-mkconfig -o /boot/efi/EFI/redhat/grub.cfg\n   ~~~\n  {{?}}\n',
          resolution_risk: {
            name: 'Update Kernel Boot Options',
            risk: 3,
          },
          has_playbook: true,
        },
      ],
      total_risk: 4,
      hosts_acked_count: 0,
      rating: 1,
      pathway: {
        name: 'Update Kernel Boot Options',
        component: 'grub',
        resolution_risk: {
          name: 'Update Kernel Boot Options',
          risk: 3,
        },
      },
    },
    {
      rule_id: 'no_ept_panic_with_l1tf|NO_EPT_PANIC_WITH_L1TF',
      created_at: '2020-04-27T14:37:39.827643Z',
      updated_at: '2022-01-07T06:15:53.114089Z',
      description:
        'Kernel panic occurs due to a bug in the mitigation part of KVM for L1TF bug fix',
      active: true,
      category: {
        id: 3,
        name: 'Stability',
      },
      impact: {
        name: 'Kernel Panic',
        impact: 4,
      },
      likelihood: 4,
      node_id: '3570921',
      tags: 'cpu kernel panic sbr_kernel',
      playbook_count: 1,
      reboot_required: true,
      publish_date: '2018-12-11T01:35:00Z',
      summary:
        'Kernel panic occurs when the mitigation control for KVM is read or KVM guest is started on a system with L1TF mitigation without EPT support.\n',
      generic:
        'Kernel panic occurs when the mitigation control for KVM is read or KVM guest is started on a system with L1TF mitigation without EPT support.\n',
      reason:
        'This host is running **kernel-{{=pydata.kvra}}** with `kvm_intel` module loaded. The CPU model of this host is **{{=pydata.name}}** and the `EPT` feature {{?!pydata.has_ept}}is not supported on this CPU{{??}}{{?pydata.boot_disabled}}has been disabled{{?}}{{?}}.\nKernel panic can occur due to a bug in the mitigation control of KVM introduced by L1TF bug fix.\n',
      more_info:
        'For guidance on upgrading the kernel to a specific version, refer to [How do I upgrade the kernel to a particular version manually?](https://access.redhat.com/solutions/161803).\n',
      impacted_systems_count: 4,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you perform the following steps:\n\n{{?pydata.cur_lock && pydata.rcm_locks}}\n* Unset the release lock.\n  ~~~\n  # subscription-manager release --unset\n  ~~~\n{{?}}\n\n{{?pydata.no_base &&\n  (pydata.cur_lock==null || (pydata.cur_lock && pydata.rcm_locks))}}\n* Enable the RHEL base repo:\n  ~~~\n  # subscription-manager repos --enable={{=pydata.no_base}}\n  ~~~\n  Note: To fix the issue in the base channel, you have to enable the base channel at first.\n{{?}}\n\n{{?pydata.cur_lock && pydata.req_repos && pydata.rcm_locks==null}}\n* {{?Object.keys(pydata.req_repos).length > 1}}Enable one of the following channels{{??}}Enable the following channel{{?}}:\n  ~~~\n  {{~pydata.req_repos:e}}# subscription-manager repos --enable={{=e}}\n  {{~}}\n  ~~~\n  Note: Red Hat only provides the resolution in the required channel{{?Object.keys(pydata.req_repos).length > 1}}s{{?}}. \n{{?}}\n* Upgrade the kernel to {{?pydata.kvra.indexOf("el7") != -1}}**3.10.0-951.el7**{{?}}{{?pydata.kvra.indexOf("el6") != -1}}**2.6.32-754.6.3.el6**{{?}} or later:\n  ~~~\n  # yum update kernel\n  ~~~\n* Reboot the system with the new kernel:\n  ~~~\n  # reboot\n  ~~~\n',
          resolution_risk: {
            name: 'Upgrade Kernel',
            risk: 3,
          },
          has_playbook: true,
        },
      ],
      total_risk: 4,
      hosts_acked_count: 0,
      rating: 0,
      pathway: {
        name: 'Upgrade Kernel',
        component: 'kernel',
        resolution_risk: {
          name: 'Upgrade Kernel',
          risk: 3,
        },
      },
    },
    {
      rule_id: 'cifs_null_pointer_dereference|CIFS_NULL_POINTER_DEREFERENCE',
      created_at: '2020-04-27T14:37:25.906802Z',
      updated_at: '2021-07-30T11:45:35.433846Z',
      description:
        'System panic occurs when NULL pointer dereference occurs in CIFS module due to a bug',
      active: true,
      category: {
        id: 3,
        name: 'Stability',
      },
      impact: {
        name: 'Kernel Panic',
        impact: 4,
      },
      likelihood: 3,
      node_id: '3485421',
      tags: 'cifs filesystem kernel panic sbr_storage storage',
      playbook_count: 1,
      reboot_required: true,
      publish_date: '2019-07-21T20:56:00Z',
      summary:
        'System panic occurs when NULL pointer dereference occurs in CIFS (Common Internet File System) module, due to a bug in kernel.\n',
      generic:
        'System panic occurs when NULL pointer dereference occurs in CIFS (Common Internet File System) module, due to a bug in kernel.\n',
      reason:
        'This host is running **{{=pydata.kernel_version}}** with **cifs** module loaded.\n\nWith the following {{?Object.keys(pydata.cifs_mount_points).length>=2}}entries{{??}}entry{{?}} with **cifs** type in `mount` table, system panic occurs when NULL pointer dereference occurs in cifs module, due to a bug in kernel.\n\n{{ for (var index in pydata.cifs_mount_points) { }}\n - {{=pydata.cifs_mount_points[index]}} {{?}}\n\n',
      more_info:
        'For guidance on upgrading the kernel to a specific version, refer to [How do I upgrade the kernel to a particular version manually?](https://access.redhat.com/solutions/161803).\n',
      impacted_systems_count: 60,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you upgrade the `kernel` to version **3.10.0-862.14.4.el7** or later and reboot to use the new kernel.\n  ~~~\n  # yum update kernel\n  # reboot\n  ~~~\n',
          resolution_risk: {
            name: 'Upgrade Kernel',
            risk: 3,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 1,
      pathway: {
        name: 'Upgrade Kernel',
        component: 'kernel',
        resolution_risk: {
          name: 'Upgrade Kernel',
          risk: 3,
        },
      },
    },
    {
      rule_id: 'hardening_unsupported_zstream|HARDENING_UNSUPPORTED_ZSTREAM',
      created_at: '2021-07-30T15:55:39.703561Z',
      updated_at: '2022-09-08T11:46:08.265996Z',
      description: 'Decreased security: Unsupported RHEL release',
      active: true,
      category: {
        id: 2,
        name: 'Security',
      },
      impact: {
        name: 'Man In The Middle',
        impact: 4,
      },
      likelihood: 3,
      node_id: '3433671',
      tags: 'hardening satellite6 security yum',
      playbook_count: 1,
      reboot_required: false,
      publish_date: '2021-07-30T18:00:00Z',
      summary:
        'This system is not able to get latest package via subscription tool.\n',
      generic:
        'This system is not able to get latest package via subscription tool.\n',
      reason:
        '{{?pydata.suggested}}This host is running **RHEL {{=pydata.rhel_version}}** locked to the unsupported release **{{=pydata.is_locked_zstream}}**.{{??}}This host is running **RHEL {{=pydata.rhel_version}}** that has no supported release anymore.{{?}}\n\n* As a result, important security updates are not available to this system.\n* `yum update` might not resolve issues indicated by other Insights recommendations.\n',
      more_info:
        '* [How to tie a system to a specific update of Red Hat Enterprise Linux? ](https://access.redhat.com/solutions/238533)\n* [How to limit updates a specific version of Red Hat Enterprise Linux? ](https://access.redhat.com/solutions/2761031)\n* [Red Hat Enterprise Linux Life Cycle, Extended Update Support (EUS), and Extended Life-cycle Support (ELS)](https://access.redhat.com/support/policy/updates/errata/)\n* [Red Hat Enterprise Linux (RHEL) Extended Update Support (EUS) Overview](https://access.redhat.com/node/721513)\n* [yum returns "No Packages marked for Update" message](https://access.redhat.com/solutions/3433671)\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat Products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
      impacted_systems_count: 551,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            '{{?pydata.suggested}}\nRed Hat recommends that you use a supported RHEL release by unsetting the release lock.\n\n~~~\n# subscription-manager release --unset\n~~~\n\n**Alternatively**, if unsetting the release lock is not an option, fix this issue by re-setting the release lock to the latest RHEL release:\n\n1. List available releases.\n    ~~~\n    # subscription-manager release --list\n    ~~~\n1. Set lock to the latest release, e.g. {{=pydata.suggested}}.\n    ~~~\n    # subscription-manager release --set={{=pydata.suggested}}\n    ~~~\n\nRed Hat recommends that you test the change and review the new settings before applying them to production systems.\n{{?? pydata.rhel_version == 6}}Red Hat recommends that you upgrade to a newer version of RHEL or to Extended Life-cycle Support. RHEL {{=pydata.rhel_version}} has no release in Full Support Phase or Maintenance Support Phase.\n{{??}}Red Hat recommends that you upgrade to a newer version of RHEL or to Extended Update Support. RHEL {{=pydata.rhel_version}} has no release in Full Support Phase or Maintenance Support Phase.\n{{?}}\n',
          resolution_risk: {
            name: 'Update Service Configuration',
            risk: 1,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id:
        'insights_client_core_collection|INSIGHTS_CORE_COLLECTION_OLD_PKG',
      created_at: '2021-03-18T11:45:58.432706Z',
      updated_at: '2022-09-08T11:46:10.737962Z',
      description:
        'When the Insights Client is earlier than "3.1.0", it is not able to get recommendations dependent on core collection',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Management Availability',
        impact: 2,
      },
      likelihood: 4,
      node_id: '5699071',
      tags: 'insights_client',
      playbook_count: 3,
      reboot_required: false,
      publish_date: '2021-03-13T18:48:00Z',
      summary:
        'The host is not able to get recommendations dependent on core collection.\n',
      generic:
        'Since the Insights Client version "3.1.0", a new feature named "core collection" is provided. Some new recommendations are dependent on the core collection. So, if Insights Client earlier than "3.1.0" is being used, it is not able to get the recommendations dependent on that new feature.\n',
      reason:
        'The Insights Client package **{{=pydata.pkg}}** installed on this host is old and the core collection feature is not available in that version. As a result, it is not able to get the recommendations dependent on the core collection.\n',
      more_info: '',
      impacted_systems_count: 195,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            '{{?pydata.cur_lock}}\nRed Hat recommends that you set **"core_collect=True"** in the `/etc/insights-client/insights-client.conf` file.\n\nAlternatively, since the current release **RHEL {{=pydata.cur_lock}}** set on\nthis host does not provide the package, there is no direct solution. Red Hat\nrecommends that you perform the following steps an alternative:\n1. Unset the minor release:\n  ~~~\n  # subscription-manager release --unset\n  ~~~\n{{?pydata.no_base}}\n1. Enable the RHEL base repo:\n  ~~~\n  # subscription-manager repos --enable={{=pydata.no_base}}\n  ~~~\n  Note: Red Hat only provides the package in the ``{{=pydata.no_base}}`` channel.\n{{?}}{{?pydata.old}}\n1. Uninstall the old package\n  ~~~\n  # yum remove redhat-access-insights\n  ~~~\n{{?}}\n1. {{?pydata.old}}Install{{??}}Update to{{?}} the latest package:\n  ~~~\n  # yum {{?pydata.old}}install{{??}}update{{?}} insights-client\n  ~~~\n{{??}}\nRed Hat recommends that you perform the following steps:\n{{?pydata.no_base}}\n* Enable the RHEL base repo:\n  ~~~\n  # subscription-manager repos --enable={{=pydata.no_base}}\n  ~~~\n  Note: Red Hat only provides the package in the ``{{=pydata.no_base}}`` channel.\n{{?}}{{?pydata.old}}\n* Uninstall the old package\n  ~~~\n  # yum remove redhat-access-insights\n  ~~~\n{{?}}\n* {{?pydata.old}}Install{{??}}Update to{{?}} the latest package:\n  ~~~\n  # yum {{?pydata.old}}install{{??}}update{{?}} insights-client\n  ~~~\n\n{{?pydata.cc_true}}\nAlternatively, if updating the package is not allowed, you can set **core_collect=True** in the `/etc/insights-client/insights-client.conf` file.\n{{?}}{{?}}\n',
          resolution_risk: {
            name: 'Update Package',
            risk: 1,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id:
        'insights_client_core_collection|INSIGHTS_CORE_COLLECTION_SET_NO',
      created_at: '2021-03-18T11:45:58.455336Z',
      updated_at: '2022-09-08T11:46:10.763987Z',
      description:
        'When the Insights Client set "core_collect=False", it is not able to get recommendations dependent on core collection',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Management Availability',
        impact: 2,
      },
      likelihood: 4,
      node_id: '5699071',
      tags: 'insights_client',
      playbook_count: 1,
      reboot_required: false,
      publish_date: '2021-03-13T18:48:00Z',
      summary:
        'The host is not able to get recommendations dependent on core collection.\n',
      generic:
        'Since the Insights Client version "3.1.0", a new feature named "core collection" is provided. Some new recommendations are dependent on the core collection. If "core_collect=False" is set, it is not able to get the recommendations dependent on that new feature.\n',
      reason:
        'The Insights Client is set not using the core collection. As a result, it is not able to get the recommendations dependent on the core collection.\n',
      more_info: '',
      impacted_systems_count: 335,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you remove the **"core_collect=False"** from the `/etc/insights-client/insights-client.conf`.\n',
          resolution_risk: {
            name: 'Update Insights Configuration',
            risk: 2,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'kernel_panic_kworker_qxl_driver|KERNEL_PANIC_KWORKER_QXL_WARN',
      created_at: '2022-06-21T05:45:57.204152Z',
      updated_at: '2022-06-26T11:45:56.065793Z',
      description:
        'Kernel panic occurs when the qxl driver is being used on the RHEL 8 system due to a bug in the kernel',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Kernel Panic',
        impact: 4,
      },
      likelihood: 3,
      node_id: '5673241',
      tags: 'kernel panic qxl rhel8 sbr_kernel',
      playbook_count: 1,
      reboot_required: true,
      publish_date: '2022-06-26T04:35:00Z',
      summary:
        'Due to a known bug in the kernel, when the system is using qxl video driver, kernel panic occurs in a kworker executing drm_fb_helper_dirty_work() function because of invalid memory reference access.\n',
      generic:
        'Due to a known bug in the `kernel`, when the system is using `qxl` video driver, kernel panic occurs in a kworker executing **drm_fb_helper_dirty_work()** function because of invalid memory reference access by **drm_fb_helper_dirty_work()** function. The issue has been observed with the kernel version earlier than **kernel-4.18.0-305.19.1.el8_4** on RHEL 8.\n',
      reason:
        'This host is running Red Hat Enterprise Linux **{{=pydata.rhel}}** with the **kernel-{{=pydata.affected_kernel}}**. Due to a known bug in the **kernel-{{=pydata.affected_kernel}}**, when the `qxl` driver is loaded and the `bochs_drm` driver is not loaded on the host, kernel panic occurs in a kworker executing  **drm_fb_helper_dirty_work()** function because an invalid memory reference in **memcpy_erms()** function is accessed by **drm_fb_helper_dirty_work()** function. This issue is caused due to insufficient locking during access to the "qxl_bo" structure used internally by `qxl` driver.\n',
      more_info:
        'For guidance on upgrading the kernel to a specific version, refer to [How do I upgrade the kernel to a particular version manually?](https://access.redhat.com/solutions/161803)\n',
      impacted_systems_count: 551,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you perform the following steps:\n\n{{?pydata.cur_lock && pydata.rcm_locks}}\n* Unset the release lock.\n  ~~~\n  # subscription-manager release --unset\n  ~~~\n{{?}}\n\n{{?pydata.no_base && (pydata.cur_lock==null || (pydata.cur_lock && pydata.rcm_locks))}}\n* Enable the RHEL base repo:\n  ~~~\n  # subscription-manager repos --enable={{=pydata.no_base}}\n  ~~~\n  Note: To fix the issue in the base channel, you have to enable the base channel at first.\n{{?}}\n\n{{?pydata.cur_lock && pydata.req_repos && pydata.rcm_locks==null}}\n* {{?Object.keys(pydata.req_repos).length > 1}}Enable one of the following channels{{??}}Enable the following channel{{?}}:\n  ~~~\n  {{~pydata.req_repos:e}}\n  # subscription-manager repos --enable={{=e}}{{~}}\n  ~~~\n  Note: Red Hat only provides the resolution in the required channel{{?Object.keys(pydata.req_repos).length > 1}}s{{?}}.\n{{?}}\n* Update the `{{=pydata.pkg_name}}` to version **{{=pydata.fixed_kernel}}** or later:\n  ~~~\n  # yum update {{=pydata.pkg_name}}\n  ~~~\n* Reboot the system to use the new kernel:\n  ~~~\n  # reboot\n  ~~~\n\n\n',
          resolution_risk: {
            name: 'Upgrade Kernel',
            risk: 3,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
      pathway: {
        name: 'Upgrade Kernel',
        component: 'kernel',
        resolution_risk: {
          name: 'Upgrade Kernel',
          risk: 3,
        },
      },
    },
    {
      rule_id: 'mssql_check_ownership|INCORRECT_OWNERSHIP_OF_VAR_OPT_MSSQL',
      created_at: '2020-04-27T14:37:34.112787Z',
      updated_at: '2022-09-08T11:46:16.099417Z',
      description:
        'The mssql-server service will fail to start when the ownership or group of Microsoft SQL Server directory /var/opt/mssql is not correct',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Database Availability',
        impact: 3,
      },
      likelihood: 4,
      node_id: '3464671',
      tags: 'microsoft mssql sqlserver',
      playbook_count: 1,
      reboot_required: false,
      publish_date: '2019-04-19T09:10:00Z',
      summary:
        'When the ownership and group of Microsoft SQL Server directory /var/opt/mssql is not "mssql:mssql", the mssql-server service will fail to start.\n',
      generic:
        'When the ownership and group of Microsoft SQL Server directory `/var/opt/mssql` is not **"mssql:mssql"**, the `mssql-server` service will fail to start.\n',
      reason:
        "This host is running as a Microsoft SQL Server with the following incorrect ownership or group of `/var/opt/mssql`:\n\n- Owner: `{{=pydata.ownership_of_var_opt_mssql['owner']}}`\n- Group: `{{=pydata.ownership_of_var_opt_mssql['group']}}`\n",
      more_info: '',
      impacted_systems_count: 4,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you change the ownership and group of `/var/opt/mssql` to **mssql:mssql**:\n  ~~~\n  # chown -R mssql:mssql /var/opt/mssql\n  ~~~\n',
          resolution_risk: {
            name: 'Update File Permission',
            risk: 4,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'mssql_unsupported_system|MSSQL_UNSUPPORTED_RHEL_VERSION_V4',
      created_at: '2021-04-22T05:45:58.528125Z',
      updated_at: '2022-09-08T11:46:16.583017Z',
      description:
        'Microsoft SQL Server is installed on an unsupported Red Hat Enterprise Linux (RHEL)',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Unsupported Software',
        impact: 2,
      },
      likelihood: 4,
      node_id: '',
      tags: 'incident microsoft mssql sqlserver',
      playbook_count: 0,
      reboot_required: false,
      publish_date: '2020-10-01T19:01:00Z',
      summary:
        'Microsoft SQL Server is installed on an unsupported Red Hat Enterprise Linux (RHEL).\n',
      generic:
        'Microsoft SQL Server is installed on an unsupported Red Hat Enterprise Linux (RHEL).\n',
      reason:
        'This host is running as a Microsoft SQL Server with version **{{=pydata.sql_version}}**. The supported versions for Microsoft SQL Server are RHEL 7.3, RHEL 8.0 and later. However, The current host is running on **RHEL{{=pydata.rhel_version}}** which is not a supported version.\n',
      more_info:
        'For more information about the requirements of Microsoft SQL Server installation on Red Hat Enterprise Linux (RHEL), refer to [Installation guidance for SQL Server on Linux](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup?view=sqlallproducts-allversions).\n',
      impacted_systems_count: 4,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you complete the following steps:\n\n* Install Microsoft SQL server on a supported RHEL version:\n  ~~~\n  RHEL 7: 7.3 or later\n  RHEL 8: 8.0 or later\n  ~~~ \n',
          resolution_risk: {
            name: 'Upgrade RHEL',
            risk: 3,
          },
          has_playbook: false,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'network_ipv6_dev_route_crash|NETWORK_IPV6_DEV_ROUTE_CRASH',
      created_at: '2020-04-27T14:37:36.684127Z',
      updated_at: '2022-01-07T06:15:50.325645Z',
      description:
        'Kernel panic occurs when ip6_route_dev_notify function receives an empty pointer from snmp6_alloc_dev while unregistering IPv6 enabled network device due to a known bug in the kernel',
      active: true,
      category: {
        id: 3,
        name: 'Stability',
      },
      impact: {
        name: 'Kernel Panic',
        impact: 4,
      },
      likelihood: 2,
      node_id: '4209461',
      tags: 'ipv6 kernel networking sbr_networking',
      playbook_count: 1,
      reboot_required: true,
      publish_date: '2019-10-19T20:54:00Z',
      summary:
        'Due to a known bug in kernel, kernel panic occurs when ip6_route_dev_notify function receives an empty pointer from snmp6_alloc_dev while unregistering IPv6 enabled network device.\n',
      generic:
        'Kernel panic occurs when `ip6_route_dev_notify` function receives an empty pointer from `snmp6_alloc_dev` while unregistering IPv6 enabled network device, due to a known bug in the `kernel`. This is a **regression** introduced in the `kernel` version **kernel-3.10.0-693.el7** and fixed in **kernel-3.10.0-957.el7**.\n',
      reason:
        'This host is running **kernel-{{=pydata.kernel}}** and {{?Object.keys(pydata.ipv6_dev_routes).length>1}}`IPv6` routes are added for IPv6 addresses, associated with the interfaces.{{??}}`IPv6` route is added for IPv6 address, associated with the interface.{{?}} Due to a known bug in the `kernel`, when `ip6_route_dev_notify` function receives a **NULL** pointer from `snmp6_alloc_dev` while unregistering the network device, kernel panic occurs. The `snmp6_alloc_dev` returns **NULL** when CPU allocation fails.\n\nThe following IPv6 enabled {{?Object.keys(pydata.ipv6_dev_routes).length>1}}interfaces are{{??}}interface is{{?}} present on this host:\n<table>\n  <tr>\n    <th>Interface</th>\n    <th>IPv6 Address</th>\n  </tr>\n{{ for (var key in pydata.ipv6_dev_routes) { }}\n<tr>\n    <td>{{=key}} </td>\n    <td>{{=pydata.ipv6_dev_routes[key]}} </td>\n</tr>\n{{ } }}\n</table>\n',
      more_info:
        'For guidance on upgrading the kernel to a specific version, please refer to [How do I upgrade the kernel to a particular version manually?](https://access.redhat.com/solutions/161803)\n',
      impacted_systems_count: 70,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you perform the following steps:\n\n{{?pydata.cur_lock && pydata.rcm_locks}}\n* Unset the release lock.\n  ~~~\n  # subscription-manager release --unset\n  ~~~{{?}}{{?pydata.no_base && (pydata.cur_lock==null || (pydata.cur_lock && pydata.rcm_locks))}}\n* Enable the RHEL base repo:\n  ~~~\n  # subscription-manager repos --enable={{=pydata.no_base}}\n  ~~~\n  Note: To fix the issue in the base channel, you have to enable the base channel at first.{{?}}{{?pydata.cur_lock && pydata.req_repos && pydata.rcm_locks==null}}\n* {{?Object.keys(pydata.req_repos).length > 1}}Enable one of the following channels{{??}}Enable the following channel{{?}}:\n  ~~~\n  {{~pydata.req_repos:e}}\n  # subscription-manager repos --enable={{=e}}{{~}}\n  ~~~\n  Note: Red Hat only provides the resolution in the required channel{{?Object.keys(pydata.req_repos).length > 1}}s{{?}}. {{?}}\n* Update the package to the latest version:\n  ~~~\n  # yum update {{=pydata.pkg_name}}\n  ~~~\n* Reboot the system to use the new kernel:\n  ~~~\n  # reboot\n  ~~~\n{{?pydata.cur_lock && pydata.rcm_locks}}\n**Alternatively**, if unsetting the release lock is not an option, fix this issue by re-setting the release lock to {{?Object.keys(pydata.rcm_locks).length > 1}}one of the RHEL releases ``{{~pydata.rcm_locks:e}}{{=e}}, {{~}}``{{??}}the RHEL release ``{{=pydata.rcm_locks[0]}}``{{?}} and updating the package.{{?}}\n',
          resolution_risk: {
            name: 'Upgrade Kernel',
            risk: 3,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: -1,
      pathway: {
        name: 'Upgrade Kernel',
        component: 'kernel',
        resolution_risk: {
          name: 'Upgrade Kernel',
          risk: 3,
        },
      },
    },
    {
      rule_id: 'network_tcp_connection_hang|NETWORK_TCP_CONNECTION_HANG_WARN',
      created_at: '2020-04-27T14:37:37.615080Z',
      updated_at: '2021-07-30T11:45:47.693581Z',
      description:
        'Network connections will hang when insufficient memory is allocated for the TCP packet fragmentation',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Network Connection Hang',
        impact: 3,
      },
      likelihood: 3,
      node_id: '4302501',
      tags: 'kernel networking sbr_networking tcp',
      playbook_count: 1,
      reboot_required: true,
      publish_date: '2019-09-14T08:17:00Z',
      summary:
        'Due to a known bug in kernel, network connections hang when insufficient memory is allocated for the TCP packet fragmentation. \n',
      generic:
        'Due to a known bug in the `kernel`, TCP **Send-Q** or **TcpExtTCPWqueueTooBig** increases when skb split exceeds the allowed SNMP counter and kernel limits the memory allocation for the packet fragmentations, leading to network connections hangs. \n',
      reason:
        'This host is running **kernel-{{=pydata.kernel}}** and insufficient memory is allocated for the TCP packet fragmentation `net.ipv4.tcp_wmem == {{=pydata.tcp_wmem[0]}} {{=pydata.tcp_wmem[1]}} {{=pydata.tcp_wmem[2]}}`. Due to a known bug in the `kernel`, TCP **Send-Q** or **TcpExtTCPWqueueTooBig** increases when skb split exceeds the allowed SNMP counter and kernel limits the memory allocation for the packet fragmentations. As a result, network connections will hang.\n',
      more_info:
        'For guidance on upgrading the kernel to a specific version, please refer to [How do I upgrade the kernel to a particular version manually?](https://access.redhat.com/solutions/161803)\n',
      impacted_systems_count: 1,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you perform the following steps:\n{{?pydata.rhel_mrg_2 == "rhel_mrg_2"}}{{?pydata.req_repos}}\n* Enable the below channel:\n  ~~~\n  # subscription-manager repos --enable=rhel-6-server-realtime-rpms\n  ~~~{{?}}{{?}}\n\n{{?pydata.cur_lock && pydata.rcm_locks}}\n* Unset the release lock.\n  ~~~\n  # subscription-manager release --unset\n  ~~~{{?}}{{?pydata.no_base && (pydata.cur_lock==null || (pydata.cur_lock && pydata.rcm_locks))}}\n* Enable the RHEL base repo:\n  ~~~\n  # subscription-manager repos --enable={{=pydata.no_base}}\n  ~~~\n  Note: To fix the issue in the base channel, you have to enable the base channel at first.{{?}}{{?pydata.cur_lock && pydata.req_repos && pydata.rcm_locks==null}}\n* {{?Object.keys(pydata.req_repos).length > 1}}Enable one of the following channels{{??}}Enable the following channel{{?}}:\n  ~~~\n  {{~pydata.req_repos:e}}\n  # subscription-manager repos --enable={{=e}}{{~}}\n  ~~~\n  Note: Red Hat only provides the resolution in the required channel{{?Object.keys(pydata.req_repos).length > 1}}s{{?}}. {{?}}\n* Update the package to the latest version:\n  ~~~\n  # yum update {{=pydata.pkg_name}}\n  ~~~\n* Reboot the system to use the new kernel:\n  ~~~\n  # reboot\n  ~~~\n{{?pydata.cur_lock && pydata.rcm_locks}}\n**Alternatively**, if unsetting the release lock is not an option, fix this issue by re-setting the release lock to {{?Object.keys(pydata.rcm_locks).length > 1}}one of the RHEL releases ``{{~pydata.rcm_locks:e}}{{=e}}, {{~}}``{{??}}the RHEL release ``{{=pydata.rcm_locks[0]}}``{{?}} and updating the package.{{?}}\n',
          resolution_risk: {
            name: 'Upgrade Kernel',
            risk: 3,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
      pathway: {
        name: 'Upgrade Kernel',
        component: 'kernel',
        resolution_risk: {
          name: 'Upgrade Kernel',
          risk: 3,
        },
      },
    },
    {
      rule_id: 'ntp_leapsmear|NTP_LEAPSMEAR_MIX_SERVER_SMEAR_AND_NOT_ONES',
      created_at: '2020-08-10T18:18:42.103668Z',
      updated_at: '2022-09-08T11:46:24.057396Z',
      description:
        'Unexpected synchronization of time occurs when NTP time sources contain leap-smearing servers with standard NTP servers',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'System Stability Loss',
        impact: 3,
      },
      likelihood: 3,
      node_id: '5132071',
      tags: 'chrony configuration leapsecond ntp',
      playbook_count: 0,
      reboot_required: false,
      publish_date: '2020-06-13T18:13:00Z',
      summary:
        'When NTP configuration is not compatible with a server leap smear, unexpected correction of time or failed synchronization of time will occur during a leap smear.\n',
      generic:
        'When NTP time sources contain leap-smearing servers with standard NTP servers, unexpected correction of time or failed synchronization of time will occur during a leap smear. \n',
      reason:
        'This system is running `{{=pydata.service}}` with the following leap smear configurations:\n\n- Configured with the following leap-smearing server{{?Object.keys(pydata.smearing_servers).length>1}}s{{?}}:\n{{~ pydata.smearing_servers: server }}\n  * {{=server}}\n{{~}}\n\n{{?Object.keys(pydata.nonsmearing_servers).length>0}}\n- Configured with the following standard (non leap-smearing) server{{?Object.keys(pydata.nonsmearing_servers).length>1}}s{{?}}:\n{{~ pydata.nonsmearing_servers: server }}\n  * {{=server}}\n{{~}}\n{{?}}\n\n{{?Object.keys(pydata.leap_directives).length>0}}\n- Configured with the following leap smear directive{{?Object.keys(pydata.leap_directives).length>1}}s{{?}}:\n{{~ pydata.leap_directives: leap}}\n  * {{=leap}}\n{{~}}\n{{?}}\n\nThe detected issue:\n{{? pydata.error_key == "NTP_LEAPSMEAR_MIX_SERVER_SMEAR_AND_NOT_ONES" }}\n  - Mixing usage of leap-smearing NTP servers with standard NTP servers.\n{{?}}\n\n{{? pydata.smearing_patterns_len > 1}}\n  - Different leap-smearing implementations are combined.\n{{?}}\n\n{{?Object.keys(pydata.leap_directives).length>0}}\n - Clients are configured to get leap second data from other sources when using a leap-smearing server.\n{{?}}\n',
      more_info: '',
      impacted_systems_count: 13,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you modify the configuration file to resolve the issue mentioned in the above section and restart the `{{=pydata.service}}d` service.\n\n{{? pydata.error_key == "NTP_LEAPSMEAR_MIX_SERVER_SMEAR_AND_NOT_ONES" && pydata.is_special_aws_ip_case }}\n1. Modify the configuration file `/etc/{{=pydata.service}}.conf` to keep only server **169.254.169.123** and remove the other standard NTP servers.\n{{??}}\n1. Modify the configuration file `/etc/{{=pydata.service}}.conf` to use NTP servers that perform the same leap smear only and do not mix leap-smearing servers with standard NTP servers.\n{{?}}\n2. Restart the `{{=pydata.service}}d` service.\n{{? pydata.service == "ntp" }}\n  ~~~\n  # systemctl restart ntpd\n  ~~~\n{{??}}\n  ~~~\n  # systemctl restart chronyd\n  ~~~\n{{?}}\n',
          resolution_risk: {
            name: 'Update Service Configuration',
            risk: 1,
          },
          has_playbook: false,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'other_linux_system|OTHER_LINUX_SYSTEM_V2',
      created_at: '2021-06-03T05:45:54.750860Z',
      updated_at: '2022-09-08T11:46:26.067279Z',
      description: 'Other Linux release detected',
      active: true,
      category: {
        id: 3,
        name: 'Stability',
      },
      impact: {
        name: 'Unsupported Software',
        impact: 2,
      },
      likelihood: 4,
      node_id: '238453',
      tags: 'incident kernel sbr_kernel',
      playbook_count: 0,
      reboot_required: false,
      publish_date: '2016-10-31T04:08:35Z',
      summary:
        'Third party components, or installation of a distribution that is not Red Hat Enterprise Linux can lead to difficulties in supporting your system.',
      generic:
        'The host appears to be running a version of Linux other than Red Hat Enterprise Linux, or has components from a third party distribution, in some circumstances, this can mean a support case will be rejected.\n\nYou should confirm that this machine is installed with RHEL and review the [Production Support Scope of Coverage](https://access.redhat.com/support/offerings/production/soc).\n',
      reason:
        'This host appears to be running a version of Linux other than Red Hat Enterprise Linux, or has components from a third party distribution:\n\n* Other Linux: **{{=pydata.other_linux}}**\n{{?pydata.release}}\n* Release: **{{=pydata.release}}**\n{{?}}\n{{?pydata.kernel}}\n* Kernel: **{{=pydata.kernel}}**\n{{?}}\n{{?pydata.build_info}}\n* Build Host: **{{=pydata.build_info}}**\n{{?}}',
      more_info:
        'For more information about the Convert2RHEL utility, refer to the [An Introduction to Convert2RHEL](https://www.redhat.com/en/blog/introduction-convert2rhel-now-officially-supported-convert-rhel-systems-rhel) blog.\n',
      impacted_systems_count: 821,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Another version of Linux installed or running on the container can present difficulties when investigating issues with Red Hat Global Support Services.\n\nDepending on the situation, GSS may require you to demonstrate the problem on a RHEL only system or be unable to assist and reject your case in accordance with the [Production Support Scope of Coverage](https://access.redhat.com/support/offerings/production/soc).\n',
          resolution_risk: {
            name: 'Contact Red Hat Support',
            risk: 1,
          },
          has_playbook: false,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'overcommit|OVERCOMMIT_V2',
      created_at: '2020-04-27T14:37:43.778908Z',
      updated_at: '2021-07-30T15:55:52.420296Z',
      description: 'Memory overcommit occurred due to memory overcommit policy',
      active: true,
      category: {
        id: 4,
        name: 'Performance',
      },
      impact: {
        name: 'System Performance Loss',
        impact: 2,
      },
      likelihood: 4,
      node_id: '55207',
      tags: 'incident kernel sbr_kernel',
      playbook_count: 0,
      reboot_required: false,
      publish_date: '2016-10-31T04:08:31Z',
      summary: 'Memory overcommit occurred due to memory overcommit policy.\n',
      generic:
        'System stability will be compromised under memory intensive operations when **vm.overcommit_memory = 2** and **vm.overcommit_ratio = 100**\n',
      reason:
        "Red Hat detected that there was kernal panic occurring in your system. And this host has been identified as having **vm.overcommit_memory = 2** AND **vm.overcommit_ratio = 100**,  which will impact the system's stability during memory-intensive periods.\n",
      more_info:
        'For recommendations and available settings see [Red Hat Enterprise Linux Performance Tuning Guide - Capacity tuning](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Performance_Tuning_Guide/s-memory-captun.html).',
      impacted_systems_count: 4,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you set the `vm.overcommit_ratio` smaller than **100** to reduce the chances of the system being in this scenario.\n1. Set `vm.overcommit_ratio` in `/etc/sysctl.conf`.\n  ~~~\n  vm.overcommit_ratio = [a value smaller than 100]\n  ~~~\n1. Execute the following command to make it effective.\n  ~~~\n  # sysctl -p\n  ~~~\n',
          resolution_risk: {
            name: 'Sysctl Parameter Tuning',
            risk: 2,
          },
          has_playbook: false,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
      pathway: {
        name: 'Sysctl Parameter Tuning',
        component: 'sysctl.vm',
        resolution_risk: {
          name: 'Sysctl Parameter Tuning',
          risk: 2,
        },
      },
    },
    {
      rule_id: 'packages_across_major_release|PACKAGES_ACROSS_MAJOR_RELEASE',
      created_at: '2020-04-27T14:37:44.059097Z',
      updated_at: '2022-09-08T11:46:26.475392Z',
      description:
        'Installation of packages across major releases is not supported',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Unsupported Software',
        impact: 2,
      },
      likelihood: 4,
      node_id: '54483',
      tags: 'incident rpm',
      playbook_count: 1,
      reboot_required: false,
      publish_date: '2019-07-11T23:08:00Z',
      summary:
        'Installation of packages across major releases is not supported by Red Hat.\n',
      generic:
        'Installation of RHEL X packages on RHEL Y systems (where X ≠ Y) is not supported by Red Hat.\n',
      reason:
        "**RHEL {{=pydata.rhel}}** is running on this host; however, the following\n{{?Object.keys(pydata.packages).length>1}}packages which don't match the\ncurrent major release are installed{{??}}package which doesn't match the\ncurrent major release is installed{{?}}:\n ~~~\n {{~pydata.packages: e}}{{=e}}\n {{~}}\n ~~~\n\n{{?pydata.too_many}}**Note:** There are more than 10 package are impacted and only 10 of them are listed. Check the full list manually by using the ``rpm -qa`` command.{{?}}\n\n**Hint:** This may have happened due to an upgrade process.\n",
      more_info: '',
      impacted_systems_count: 60,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you complete the following steps:\n1. Remove the following {{?Object.keys(pydata.packages).length>1}}packages{{??}}package{{?}}:\n  ~~~\n  # yum remove{{~pydata.packages: e}} {{=e}}{{~}}\n  ~~~\n1. If necessary, install the related variants for the {{?Object.keys(pydata.packages).length>1}}packages{{??}}package{{?}} in above **RHEL{{=pydata.rhel}}**.\n',
          resolution_risk: {
            name: 'Reinstall Package',
            risk: 1,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'product_eol_check|AE_EOL_ERROR',
      created_at: '2021-05-19T05:45:58.552203Z',
      updated_at: '2022-09-08T11:46:27.474812Z',
      description:
        'Red Hat has discontinued technical support services as well as software maintenance services for the End-Of-Life Ansible Engine',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Unsupported Software',
        impact: 2,
      },
      likelihood: 4,
      node_id: '',
      tags: 'ansible incident',
      playbook_count: 0,
      reboot_required: false,
      publish_date: '2021-05-19T03:03:00Z',
      summary:
        'When a product reaches End-Of-Life (EOL), Red Hat will discontinue technical support services as well as software maintenance services.\n',
      generic:
        'This Ansible Engine has exceeded its End-of-Life. Red Hat has discontinued technical support services as well as software maintenance services for it.\n',
      reason:
        "The following Red Hat product{{?Object.keys(pydata.product).length>1}}s{{?}}\ninstalled on this host {{?Object.keys(pydata.product).length>1}}have{{??}}has{{?}} exceeded the End-Of-Life(EOL). As per the related life cycle policy, Red Hat has discontinued technical support services as well as software maintenance services for {{?Object.keys(pydata.product).length>1}}them{{??}}it{{?}}.\n\n{{ for (var idx in pydata.product) { }}\n* The **{{=pydata.product[idx]['name']}} {{=pydata.product[idx]['version']}}** exceeded the **{{=pydata.product[idx]['phase']}}** phase (``{{=pydata.product[idx]['eol']}}``) for ``{{=pydata.product[idx]['days']}}`` day{{?pydata.product[idx]['days']>1}}s{{?}}\n\n  See [{{=pydata.product[idx]['name']}} Life Cycle Policy]({{=pydata.brief[pydata.product[idx]['name']]}})\n{{ } }}\n",
      more_info:
        'For more information regarding Red Hat product life cycles, refer to:\n- [Life Cycle and Update Policies](https://access.redhat.com/support/policy/update_policies).\n- [Product Life Cycles](https://access.redhat.com/product-life-cycles).\n',
      impacted_systems_count: 14,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you upgrade the following product{{?Object.keys(pydata.product).length>1}}s{{?}} to the current supported version.\n\n{{ for (var idx in pydata.brief) { }}\n* {{=idx}}\n\n  Check the [{{=idx}} Life Cycle Policy]({{=pydata.brief[idx]}}) for details.\n{{ } }}\n',
          resolution_risk: {
            name: 'Upgrade Product',
            risk: 3,
          },
          has_playbook: false,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 1,
    },
    {
      rule_id: 'product_eol_check|RHEL_EOL_ERROR',
      created_at: '2021-05-19T05:45:59.042876Z',
      updated_at: '2022-09-08T11:46:28.347649Z',
      description:
        'Red Hat has discontinued technical support services as well as software maintenance services for the End-Of-Life RHEL',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Unsupported Software',
        impact: 2,
      },
      likelihood: 4,
      node_id: '222603',
      tags: 'incident sbr_sysmgmt',
      playbook_count: 0,
      reboot_required: false,
      publish_date: '2021-05-19T03:03:00Z',
      summary:
        'When a product reaches End-Of-Life (EOL), Red Hat will discontinue technical support services as well as software maintenance services.\n',
      generic:
        'This Red Hat Enterprise Linux has exceeded its End-of-Life. Red Hat has discontinued technical support services as well as software maintenance services for it.\n',
      reason:
        "The following Red Hat product{{?Object.keys(pydata.product).length>1}}s{{?}}\ninstalled on this host {{?Object.keys(pydata.product).length>1}}have{{??}}has{{?}} exceeded the End-Of-Life(EOL). As per the related life cycle policy, Red Hat has discontinued technical support services as well as software maintenance services for {{?Object.keys(pydata.product).length>1}}them{{??}}it{{?}}.\n\n{{ for (var idx in pydata.product) { }}\n* The **{{=pydata.product[idx]['name']}} {{=pydata.product[idx]['version']}}** exceeded the **{{=pydata.product[idx]['phase']}}** phase (``{{=pydata.product[idx]['eol']}}``) for ``{{=pydata.product[idx]['days']}}`` day{{?pydata.product[idx]['days']>1}}s{{?}}\n\n  See [{{=pydata.product[idx]['name']}} Life Cycle Policy]({{=pydata.brief[pydata.product[idx]['name']]}})\n{{ } }}\n",
      more_info:
        'For more information regarding Red Hat product life cycles, refer to:\n- [Life Cycle and Update Policies](https://access.redhat.com/support/policy/update_policies).\n- [Product Life Cycles](https://access.redhat.com/product-life-cycles).\n',
      impacted_systems_count: 25,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you upgrade the following product{{?Object.keys(pydata.product).length>1}}s{{?}} to the current supported version.\n\n{{ for (var idx in pydata.brief) { }}\n* {{=idx}}\n\n  Check the [{{=idx}} Life Cycle Policy]({{=pydata.brief[idx]}}) for details.\n{{ } }}\n',
          resolution_risk: {
            name: 'Upgrade Product',
            risk: 3,
          },
          has_playbook: false,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'rpm_packages_checksum|RPM_PACKAGES_CHANGED',
      created_at: '2020-04-27T14:37:46.453766Z',
      updated_at: '2022-09-08T11:46:29.793053Z',
      description: 'Decreased security: altered RPM packages',
      active: true,
      category: {
        id: 2,
        name: 'Security',
      },
      impact: {
        name: 'Suspicious Activity',
        impact: 2,
      },
      likelihood: 4,
      node_id: '1544003',
      tags: 'hardening rpm security',
      playbook_count: 0,
      reboot_required: false,
      publish_date: '2016-10-31T04:08:33Z',
      summary:
        'The output of the `rpm -V` command on specific packages indicates that some installed files have been modified. These modifications can indicate that the file size, MD5sum, and the timestamp differ from what is expected, which can be a possible indication of malicious tampering of the system.\n',
      generic:
        'The output of the `rpm -V` command on specific packages indicates that some installed files have been modified. These modifications can indicate that the file size, MD5sum, and the timestamp differ from what is expected, which can be a possible indication of malicious tampering of the system.\n',
      reason:
        "The output of the `rpm -V` command on specific packages indicates that some installed files have been modified. These modifications can indicate that the file size, MD5sum, and the timestamp differ from what is expected, which can be a possible indication of malicious tampering of the system, or of executable changes done without the `rpm` package manager.\n\nThe modified files identified on this host are:\n{{~pydata.changed_binary_file:f}}* {{=f}}\n{{~}}\n\nPlease note that this recommendation doesn't provide conclusive security advice. Users with write access to the listed files also have write access to the RPM database that is used by the `rpm -V` command to verify these files. A hypothetical attacker might be able to modify both the file and the RPM database used to verify the file in such a way that `rpm -V` reports no warnings.\n",
      more_info:
        '* [How do I verify if some binary files installed via rpm in RHEL have been replaced?](https://access.redhat.com/solutions/1544003)\n* [How to reinstall files reported by rpm -V to be missing or corrupted](https://access.redhat.com/solutions/183083)\n* [Verifying packages](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/deployment_guide/s2-rpm-verifying)\n',
      impacted_systems_count: 6,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you take one or more of the following actions:\n\n\n* Determine whether your administrative procedures for the system involve modifying the listed files without using the `rpm` package manager.\n\n\n* Reinstall the related package. To reinstall all packages checked by this Insights Recommendation:\n\n   ~~~\n   # yum reinstall coreutils procps procps-ng shadow-utils passwd sudo chrony\n   ~~~\n\n   **Please note** that this will destroy evidence if the system state is caused by unauthorized actions.\n\n\n* Determine whether storage is operating correctly.\n\n    * [What is smartd and how do I use it?](https://access.redhat.com/solutions/1456)\n    * [How can I test if my hard disk is going bad?](https://access.redhat.com/articles/7703)\n    * [Checking and repairing a file system](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_file_systems/checking-and-repairing-a-file-system_managing-file-systems)\n\n\n* Determine whether system memory (RAM) and the system hardware are operating correctly.\n\n    * [How to install and enable rasdaemon](https://access.redhat.com/solutions/3742591)\n    * [Checking for Hardware Errors](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-system_monitoring_tools#sec-Checking_for_Hardware_Errors)\n    * [What information can be obtained from rasdaemon?](https://access.redhat.com/solutions/3742611)\n    * [How to check if system RAM is faulty in Red Hat Enterprise Linux?](https://access.redhat.com/solutions/15693)\n\n\n* Contact Red Hat Support Services for further assistance with this matter.\n',
          resolution_risk: {
            name: 'Contact Red Hat Support',
            risk: 1,
          },
          has_playbook: false,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
    {
      rule_id: 'sap_limits|SAP_LIMITS_ISSUE_V1',
      created_at: '2020-08-10T18:18:47.252498Z',
      updated_at: '2022-09-08T11:46:30.913913Z',
      description:
        'SAP instances failure occur when the values for some resource limits are below the SAP recommended values',
      active: true,
      category: {
        id: 4,
        name: 'Performance',
      },
      impact: {
        name: 'Application Failure',
        impact: 3,
      },
      likelihood: 3,
      node_id: '',
      tags: 'kernel sap sbr_kernel tuning',
      playbook_count: 2,
      reboot_required: false,
      publish_date: '2017-05-16T12:00:00Z',
      summary:
        'SAP applications require certain file handler or process resource in order to keep the application running properly. When resource limits do not meet SAP requirements, the SAP application will fail to run or its performance will degrade.\n',
      generic:
        'SAP applications require certain file handler or process resource in order to keep the application running properly. When resource limits are below the SAP recommendations, the SAP instances will fail to run.\n',
      reason:
        "The following limits are out of line with SAP recommendations:\n\n{{ for (key in pydata.untuned) {}}\n* {{? pydata.untuned[key] == 'missing' }}Necessary line for `{{=key}}` is missing.{{??}}{{=key}} {{=pydata.untuned[key]}}{{?}}\n{{ }}}\n",
      more_info:
        'For more information about configuring process resource limits for SAP instances, refer to the following SAP Note:\n* [1771258 - Linux: User and system resource limits](https://launchpad.support.sap.com/#/notes/1771258)\n',
      impacted_systems_count: 532,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you complete the following steps to improve application performance:\n\n{{for (var file in pydata.recommended) { }}\n1. Add/update the following lines in the `{{=file}}`:\n   {{for (var item in pydata.recommended[file]) { }}\n   ~~~\n   {{=pydata.recommended[file][item][0]}} {{=pydata.recommended[file][item][1]}} {{=pydata.recommended[file][item][2]}} {{=pydata.recommended[file][item][3]}}\n   ~~~ {{ } }} {{ } }}\n1. The modification above requires a logout to take effect for newly started processes.  \n   **Note:** Rebooting the system can also take the settings into effect\n1. After re-logging in/rebooting,run the following command to check the current resource limits:\n   ~~~\n   # ulimit -a\n   ~~~\n',
          resolution_risk: {
            name: 'Limits Tuning',
            risk: 2,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 1,
    },
    {
      rule_id: 'sap_required_packages|SAP_REQED_PACKAGES',
      created_at: '2020-08-10T18:18:47.295360Z',
      updated_at: '2022-09-08T11:46:30.971372Z',
      description:
        'SAP will not work well when missing required packages or the version of specific packages does not meet the minimal requirements',
      active: true,
      category: {
        id: 1,
        name: 'Availability',
      },
      impact: {
        name: 'Application Failure',
        impact: 3,
      },
      likelihood: 3,
      node_id: '',
      tags: 'sap',
      playbook_count: 1,
      reboot_required: false,
      publish_date: '2020-05-23T20:55:00Z',
      summary:
        'The related functions of SAP applications do not work well because there is a lack of required packages or the version of specific packages does not meet the minimal requirements.\n',
      generic:
        'The related functions of SAP applications do not work well because there is a lack of required packages or the version of specific packages does not meet the minimal requirements.\n',
      reason:
        'This system is running Red Hat Enterprise Linux with the following SAP\napplication{{?Object.keys(pydata.sap).length>1}}s{{?}}. However, the related\nfunctions of SAP do not work well due to the following issues:\n\n{{var nps = 0, rps = 0;}} {{?pydata.non_min_pkgs}} {{var nps = Object.keys(pydata.non_min_pkgs).length;}} {{?}} {{?pydata.req_pkgs}} {{var rps = Object.keys(pydata.req_pkgs).length;}} {{?}}\n1. SAP application{{?Object.keys(pydata.sap).length>1}}s{{?}} running on this host.\n  {{~pydata.sap: e}}\n    * {{=e}}{{~}}{{?pydata.non_min_pkgs || pydata.req_pkgs}}\n1. The following package{{?nps+rps>1}}s are {{??}} is {{?}}not installed:\n  {{?pydata.req_pkgs}}{{~pydata.req_pkgs: e}}\n    * {{=e}}{{~}}{{?}}{{?pydata.non_min_pkgs}}{{~pydata.non_min_pkgs: e}}\n    * {{=e[0]}}{{~}}{{?}}\n{{?}}{{?pydata.req_min_pkgs}}\n1. The version of package{{?Object.keys(pydata.req_min_pkgs).length>1}}s{{?}} does not meet the minimal requirements:\n<table>\n  <tr>\n    <th>Package</th>\n    <th>Installed version</th>\n    <th>Required minimal version</th>\n  </tr>\n{{~pydata.req_min_pkgs: e}}\n<tr>\n    <td>{{=e[0]}}</td>\n    <td>{{=e[1]}}</td>\n    <td>{{=e[2]}}</td>\n</tr>\n{{~}}\n</table>\n{{?}}\n',
      more_info:
        'For more information about the required packages of SAP on RHEL, refer to the following SAP Notes:\n{{? pydata.rhel.startsWith("8.")}}\n* [2772999 - Red Hat Enterprise Linux 8.x: Installation and Configuration](https://launchpad.support.sap.com/#/notes/2772999)\n{{?}}\n{{? pydata.rhel.startsWith("7.")}}\n* [2002167 - Red Hat Enterprise Linux 7.x: Installation and Upgrade](https://launchpad.support.sap.com/#/notes/2002167)\n{{?}}\n{{? pydata.rhel.startsWith("6.")}}\n* [1496410 - Red Hat Enterprise Linux 6.x: Installation and Upgrade](https://launchpad.support.sap.com/#/notes/1496410)\n{{?}}\n',
      impacted_systems_count: 1,
      reports_shown: true,
      rule_status: 'enabled',
      resolution_set: [
        {
          system_type: 105,
          resolution:
            'Red Hat recommends that you apply the following steps:\n{{var nps = 0, rps = 0;}} {{?pydata.non_min_pkgs}} {{var nps = Object.keys(pydata.non_min_pkgs).length;}} {{?}} {{?pydata.req_pkgs}} {{var rps = Object.keys(pydata.req_pkgs).length;}} {{?}}\n{{?pydata.req_min_pkgs}}\n* Update the following package{{?Object.keys(pydata.req_min_pkgs).length>1}}s{{?}} to the latest:\n   ~~~\n   # yum update {{~pydata.req_min_pkgs: e}}{{=e[0]}} {{~}}\n   ~~~\n{{?}}\n{{?pydata.non_min_pkgs || pydata.req_pkgs}}\n* Install the following package{{?nps+rps>1}}s{{?}}:\n   ~~~\n   # yum install {{?pydata.req_pkgs}}{{~pydata.req_pkgs: e}}{{=e}} {{~}}{{?}}{{?pydata.non_min_pkgs}}{{~pydata.non_min_pkgs: e}}{{=e[0]}} {{~}}{{?}}\n   ~~~\n{{?}}\n',
          resolution_risk: {
            name: 'Update Package',
            risk: 1,
          },
          has_playbook: true,
        },
      ],
      total_risk: 3,
      hosts_acked_count: 0,
      rating: 0,
    },
  ],
};

export default fixtures;
