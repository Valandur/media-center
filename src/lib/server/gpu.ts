import { XMLParser } from 'fast-xml-parser';
import { error } from '@sveltejs/kit';
import { exec } from 'node:child_process';
import { env } from '$env/dynamic/private';

import type { GpuInfo, GpuRaw } from '$lib/models/gpu';

import { Service } from './service';

const CMD = 'nvidia-smi -q -x';
const MOCK = env.NVIDIA_MOCK === '1';

export class Gpu extends Service {
	private readonly parser = new XMLParser();

	public constructor() {
		super('GPU');
	}

	public async getStats(): Promise<GpuInfo> {
		try {
			const res = await new Promise<string>((resolve, reject) =>
				MOCK
					? resolve(MOCK_DATA)
					: exec(CMD, (err, stdout) => (err ? reject(err) : resolve(stdout)))
			);
			const json: GpuRaw = this.parser.parse(res);

			const name = json.nvidia_smi_log.gpu.product_name;
			const temp = parseFloat(json.nvidia_smi_log.gpu.temperature.gpu_temp);
			const processes = json.nvidia_smi_log.gpu.processes;
			const encoderSessions = json.nvidia_smi_log.gpu.encoder_stats.session_count;
			const fanSpeed = parseFloat(json.nvidia_smi_log.gpu.fan_speed);
			const memTotal = parseFloat(json.nvidia_smi_log.gpu.fb_memory_usage.total);
			const memUsed = parseFloat(json.nvidia_smi_log.gpu.fb_memory_usage.used);

			return {
				name,
				temp,
				processes,
				encoderSessions,
				fanSpeed,
				memTotal,
				memUsed
			};
		} catch (err) {
			error(500, (err as Error).message);
		}
	}
}

export const gpu = new Gpu();

const MOCK_DATA = `
<?xml version="1.0" ?>
<!DOCTYPE nvidia_smi_log SYSTEM "nvsmi_device_v12.dtd">
<nvidia_smi_log>
	<timestamp>Sun Aug  3 20:34:30 2025</timestamp>
	<driver_version>575.57.08</driver_version>
	<cuda_version>12.9</cuda_version>
	<attached_gpus>1</attached_gpus>
	<gpu id="00000000:01:00.0">
		<product_name>NVIDIA GeForce RTX 3050</product_name>
		<product_brand>GeForce</product_brand>
		<product_architecture>Ampere</product_architecture>
		<display_mode>Requested functionality has been deprecated</display_mode>
		<display_attached>No</display_attached>
		<display_active>Disabled</display_active>
		<persistence_mode>Enabled</persistence_mode>
		<addressing_mode>None</addressing_mode>
		<mig_mode>
			<current_mig>N/A</current_mig>
			<pending_mig>N/A</pending_mig>
		</mig_mode>
		<mig_devices>
			None
		</mig_devices>
		<accounting_mode>Disabled</accounting_mode>
		<accounting_mode_buffer_size>4000</accounting_mode_buffer_size>
		<driver_model>
			<current_dm>N/A</current_dm>
			<pending_dm>N/A</pending_dm>
		</driver_model>
		<serial>N/A</serial>
		<uuid>GPU-cced27e1-8a73-8d1d-9c3c-95b30410922c</uuid>
		<minor_number>0</minor_number>
		<vbios_version>94.07.91.00.B0</vbios_version>
		<multigpu_board>No</multigpu_board>
		<board_id>0x100</board_id>
		<board_part_number>N/A</board_part_number>
		<gpu_part_number>2584-325-A1</gpu_part_number>
		<gpu_fru_part_number>N/A</gpu_fru_part_number>
		<platformInfo>
			<chassis_serial_number>N/A</chassis_serial_number>
			<slot_number>N/A</slot_number>
			<tray_index>N/A</tray_index>
			<host_id>N/A</host_id>
			<peer_type>N/A</peer_type>
			<module_id>1</module_id>
			<gpu_fabric_guid>N/A</gpu_fabric_guid>
		</platformInfo>
		<inforom_version>
			<img_version>G001.0000.94.01</img_version>
			<oem_object>2.0</oem_object>
			<ecc_object>N/A</ecc_object>
			<pwr_object>N/A</pwr_object>
		</inforom_version>
		<inforom_bbx_flush>
			<latest_timestamp>N/A</latest_timestamp>
			<latest_duration>N/A</latest_duration>
		</inforom_bbx_flush>
		<gpu_operation_mode>
			<current_gom>N/A</current_gom>
			<pending_gom>N/A</pending_gom>
		</gpu_operation_mode>
		<c2c_mode>N/A</c2c_mode>
		<gpu_virtualization_mode>
			<virtualization_mode>None</virtualization_mode>
			<host_vgpu_mode>N/A</host_vgpu_mode>
			<vgpu_heterogeneous_mode>N/A</vgpu_heterogeneous_mode>
		</gpu_virtualization_mode>
		<gpu_reset_status>
			<reset_required>Requested functionality has been deprecated</reset_required>
			<drain_and_reset_recommended>Requested functionality has been deprecated</drain_and_reset_recommended>
		</gpu_reset_status>
		<gpu_recovery_action>None</gpu_recovery_action>
		<gsp_firmware_version>575.57.08</gsp_firmware_version>
		<ibmnpu>
			<relaxed_ordering_mode>N/A</relaxed_ordering_mode>
		</ibmnpu>
		<pci>
			<pci_bus>01</pci_bus>
			<pci_device>00</pci_device>
			<pci_domain>0000</pci_domain>
			<pci_base_class>3</pci_base_class>
			<pci_sub_class>0</pci_sub_class>
			<pci_device_id>258410DE</pci_device_id>
			<pci_bus_id>00000000:01:00.0</pci_bus_id>
			<pci_sub_system_id>89761043</pci_sub_system_id>
			<pci_gpu_link_info>
				<pcie_gen>
					<max_link_gen>4</max_link_gen>
					<current_link_gen>1</current_link_gen>
					<device_current_link_gen>1</device_current_link_gen>
					<max_device_link_gen>4</max_device_link_gen>
					<max_host_link_gen>4</max_host_link_gen>
				</pcie_gen>
				<link_widths>
					<max_link_width>16x</max_link_width>
					<current_link_width>8x</current_link_width>
				</link_widths>
			</pci_gpu_link_info>
			<pci_bridge_chip>
				<bridge_chip_type>N/A</bridge_chip_type>
				<bridge_chip_fw>N/A</bridge_chip_fw>
			</pci_bridge_chip>
			<replay_counter>0</replay_counter>
			<replay_rollover_counter>0</replay_rollover_counter>
			<tx_util>600 KB/s</tx_util>
			<rx_util>500 KB/s</rx_util>
			<atomic_caps_outbound>N/A</atomic_caps_outbound>
			<atomic_caps_inbound>N/A</atomic_caps_inbound>
		</pci>
		<fan_speed>34 %</fan_speed>
		<performance_state>P8</performance_state>
		<clocks_event_reasons>
			<clocks_event_reason_gpu_idle>Active</clocks_event_reason_gpu_idle>
			<clocks_event_reason_applications_clocks_setting>Not Active</clocks_event_reason_applications_clocks_setting>
			<clocks_event_reason_sw_power_cap>Not Active</clocks_event_reason_sw_power_cap>
			<clocks_event_reason_hw_slowdown>Not Active</clocks_event_reason_hw_slowdown>
			<clocks_event_reason_hw_thermal_slowdown>Not Active</clocks_event_reason_hw_thermal_slowdown>
			<clocks_event_reason_hw_power_brake_slowdown>Not Active</clocks_event_reason_hw_power_brake_slowdown>
			<clocks_event_reason_sync_boost>Not Active</clocks_event_reason_sync_boost>
			<clocks_event_reason_sw_thermal_slowdown>Not Active</clocks_event_reason_sw_thermal_slowdown>
			<clocks_event_reason_display_clocks_setting>Not Active</clocks_event_reason_display_clocks_setting>
		</clocks_event_reasons>
		<clocks_event_reasons_counters>
			<clocks_event_reasons_counters_sw_power_cap>1488456973 us</clocks_event_reasons_counters_sw_power_cap>
			<clocks_event_reasons_counters_sync_boost>0 us</clocks_event_reasons_counters_sync_boost>
			<clocks_event_reasons_counters_sw_therm_slowdown>0 us</clocks_event_reasons_counters_sw_therm_slowdown>
			<clocks_event_reasons_counters_hw_therm_slowdown>0 us</clocks_event_reasons_counters_hw_therm_slowdown>
			<clocks_event_reasons_counters_hw_power_brake>0 us</clocks_event_reasons_counters_hw_power_brake>
		</clocks_event_reasons_counters>
		<sparse_operation_mode>N/A</sparse_operation_mode>
		<fb_memory_usage>
			<total>6144 MiB</total>
			<reserved>340 MiB</reserved>
			<used>1109 MiB</used>
			<free>4696 MiB</free>
		</fb_memory_usage>
		<bar1_memory_usage>
			<total>8192 MiB</total>
			<used>5 MiB</used>
			<free>8187 MiB</free>
		</bar1_memory_usage>
		<cc_protected_memory_usage>
			<total>0 MiB</total>
			<used>0 MiB</used>
			<free>0 MiB</free>
		</cc_protected_memory_usage>
		<compute_mode>Default</compute_mode>
		<utilization>
			<gpu_util>0 %</gpu_util>
			<memory_util>0 %</memory_util>
			<encoder_util>0 %</encoder_util>
			<decoder_util>0 %</decoder_util>
			<jpeg_util>0 %</jpeg_util>
			<ofa_util>0 %</ofa_util>
		</utilization>
		<encoder_stats>
			<session_count>0</session_count>
			<average_fps>0</average_fps>
			<average_latency>0</average_latency>
		</encoder_stats>
		<fbc_stats>
			<session_count>0</session_count>
			<average_fps>0</average_fps>
			<average_latency>0</average_latency>
		</fbc_stats>
		<dram_encryption_mode>
			<current_dram_encryption>N/A</current_dram_encryption>
			<pending_dram_encryption>N/A</pending_dram_encryption>
		</dram_encryption_mode>
		<ecc_mode>
			<current_ecc>N/A</current_ecc>
			<pending_ecc>N/A</pending_ecc>
		</ecc_mode>
		<ecc_errors>
			<volatile>
				<sram_correctable>N/A</sram_correctable>
				<sram_uncorrectable_parity>N/A</sram_uncorrectable_parity>
				<sram_uncorrectable_secded>N/A</sram_uncorrectable_secded>
				<dram_correctable>N/A</dram_correctable>
				<dram_uncorrectable>N/A</dram_uncorrectable>
			</volatile>
			<aggregate>
				<sram_correctable>N/A</sram_correctable>
				<sram_uncorrectable_parity>N/A</sram_uncorrectable_parity>
				<sram_uncorrectable_secded>N/A</sram_uncorrectable_secded>
				<dram_correctable>N/A</dram_correctable>
				<dram_uncorrectable>N/A</dram_uncorrectable>
				<sram_threshold_exceeded>N/A</sram_threshold_exceeded>
			</aggregate>
			<aggregate_uncorrectable_sram_sources>
				<sram_l2>N/A</sram_l2>
				<sram_sm>N/A</sram_sm>
				<sram_microcontroller>N/A</sram_microcontroller>
				<sram_pcie>N/A</sram_pcie>
				<sram_other>N/A</sram_other>
			</aggregate_uncorrectable_sram_sources>
		</ecc_errors>
		<retired_pages>
			<multiple_single_bit_retirement>
				<retired_count>N/A</retired_count>
				<retired_pagelist>N/A</retired_pagelist>
			</multiple_single_bit_retirement>
			<double_bit_retirement>
				<retired_count>N/A</retired_count>
				<retired_pagelist>N/A</retired_pagelist>
			</double_bit_retirement>
			<pending_blacklist>N/A</pending_blacklist>
			<pending_retirement>N/A</pending_retirement>
		</retired_pages>
		<remapped_rows>N/A</remapped_rows>
		<temperature>
			<gpu_temp>35 C</gpu_temp>
			<gpu_temp_tlimit>N/A</gpu_temp_tlimit>
			<gpu_temp_max_threshold>97 C</gpu_temp_max_threshold>
			<gpu_temp_slow_threshold>94 C</gpu_temp_slow_threshold>
			<gpu_temp_max_gpu_threshold>92 C</gpu_temp_max_gpu_threshold>
			<gpu_target_temperature>83 C</gpu_target_temperature>
			<memory_temp>N/A</memory_temp>
			<gpu_temp_max_mem_threshold>N/A</gpu_temp_max_mem_threshold>
		</temperature>
		<supported_gpu_target_temp>
			<gpu_target_temp_min>65 C</gpu_target_temp_min>
			<gpu_target_temp_max>90 C</gpu_target_temp_max>
		</supported_gpu_target_temp>
		<gpu_power_readings>
			<power_state>P8</power_state>
			<average_power_draw>4.45 W</average_power_draw>
			<instant_power_draw>4.51 W</instant_power_draw>
			<current_power_limit>70.00 W</current_power_limit>
			<requested_power_limit>70.00 W</requested_power_limit>
			<default_power_limit>70.00 W</default_power_limit>
			<min_power_limit>20.00 W</min_power_limit>
			<max_power_limit>70.00 W</max_power_limit>
		</gpu_power_readings>
		<gpu_memory_power_readings>
			<average_power_draw>N/A</average_power_draw>
			<instant_power_draw>N/A</instant_power_draw>
		</gpu_memory_power_readings>
		<module_power_readings>
			<power_state>P8</power_state>
			<average_power_draw>N/A</average_power_draw>
			<instant_power_draw>N/A</instant_power_draw>
			<current_power_limit>N/A</current_power_limit>
			<requested_power_limit>N/A</requested_power_limit>
			<default_power_limit>N/A</default_power_limit>
			<min_power_limit>N/A</min_power_limit>
			<max_power_limit>N/A</max_power_limit>
		</module_power_readings>
		<power_smoothing>N/A</power_smoothing>
		<power_profiles>
			<power_profile_requested_profiles>N/A</power_profile_requested_profiles>
			<power_profile_enforced_profiles>N/A</power_profile_enforced_profiles>
		</power_profiles>
		<clocks>
			<graphics_clock>210 MHz</graphics_clock>
			<sm_clock>210 MHz</sm_clock>
			<mem_clock>405 MHz</mem_clock>
			<video_clock>555 MHz</video_clock>
		</clocks>
		<applications_clocks>
			<graphics_clock>N/A</graphics_clock>
			<mem_clock>N/A</mem_clock>
		</applications_clocks>
		<default_applications_clocks>
			<graphics_clock>N/A</graphics_clock>
			<mem_clock>N/A</mem_clock>
		</default_applications_clocks>
		<deferred_clocks>
			<mem_clock>N/A</mem_clock>
		</deferred_clocks>
		<max_clocks>
			<graphics_clock>2160 MHz</graphics_clock>
			<sm_clock>2160 MHz</sm_clock>
			<mem_clock>7001 MHz</mem_clock>
			<video_clock>2010 MHz</video_clock>
		</max_clocks>
		<max_customer_boost_clocks>
			<graphics_clock>N/A</graphics_clock>
		</max_customer_boost_clocks>
		<clock_policy>
			<auto_boost>N/A</auto_boost>
			<auto_boost_default>N/A</auto_boost_default>
		</clock_policy>
		<voltage>
			<graphics_volt>Requested functionality has been deprecated</graphics_volt>
		</voltage>
		<fabric>
			<state>N/A</state>
			<status>N/A</status>
			<cliqueId>N/A</cliqueId>
			<clusterUuid>N/A</clusterUuid>
			<health>
				<bandwidth>N/A</bandwidth>
				<route_recovery_in_progress>N/A</route_recovery_in_progress>
				<route_unhealthy>N/A</route_unhealthy>
				<access_timeout_recovery>N/A</access_timeout_recovery>
			</health>
		</fabric>
		<supported_clocks>
			<supported_mem_clock>
				<value>7001 MHz</value>
				<supported_graphics_clock>2160 MHz</supported_graphics_clock>
				<supported_graphics_clock>2152 MHz</supported_graphics_clock>
				<supported_graphics_clock>2145 MHz</supported_graphics_clock>
				<supported_graphics_clock>2137 MHz</supported_graphics_clock>
				<supported_graphics_clock>2130 MHz</supported_graphics_clock>
				<supported_graphics_clock>2122 MHz</supported_graphics_clock>
				<supported_graphics_clock>2115 MHz</supported_graphics_clock>
				<supported_graphics_clock>2107 MHz</supported_graphics_clock>
				<supported_graphics_clock>2100 MHz</supported_graphics_clock>
				<supported_graphics_clock>2092 MHz</supported_graphics_clock>
				<supported_graphics_clock>2085 MHz</supported_graphics_clock>
				<supported_graphics_clock>2077 MHz</supported_graphics_clock>
				<supported_graphics_clock>2070 MHz</supported_graphics_clock>
				<supported_graphics_clock>2062 MHz</supported_graphics_clock>
				<supported_graphics_clock>2055 MHz</supported_graphics_clock>
				<supported_graphics_clock>2047 MHz</supported_graphics_clock>
				<supported_graphics_clock>2040 MHz</supported_graphics_clock>
				<supported_graphics_clock>2032 MHz</supported_graphics_clock>
				<supported_graphics_clock>2025 MHz</supported_graphics_clock>
				<supported_graphics_clock>2017 MHz</supported_graphics_clock>
				<supported_graphics_clock>2010 MHz</supported_graphics_clock>
				<supported_graphics_clock>2002 MHz</supported_graphics_clock>
				<supported_graphics_clock>1995 MHz</supported_graphics_clock>
				<supported_graphics_clock>1987 MHz</supported_graphics_clock>
				<supported_graphics_clock>1980 MHz</supported_graphics_clock>
				<supported_graphics_clock>1972 MHz</supported_graphics_clock>
				<supported_graphics_clock>1965 MHz</supported_graphics_clock>
				<supported_graphics_clock>1957 MHz</supported_graphics_clock>
				<supported_graphics_clock>1950 MHz</supported_graphics_clock>
				<supported_graphics_clock>1942 MHz</supported_graphics_clock>
				<supported_graphics_clock>1935 MHz</supported_graphics_clock>
				<supported_graphics_clock>1927 MHz</supported_graphics_clock>
				<supported_graphics_clock>1920 MHz</supported_graphics_clock>
				<supported_graphics_clock>1912 MHz</supported_graphics_clock>
				<supported_graphics_clock>1905 MHz</supported_graphics_clock>
				<supported_graphics_clock>1897 MHz</supported_graphics_clock>
				<supported_graphics_clock>1890 MHz</supported_graphics_clock>
				<supported_graphics_clock>1882 MHz</supported_graphics_clock>
				<supported_graphics_clock>1875 MHz</supported_graphics_clock>
				<supported_graphics_clock>1867 MHz</supported_graphics_clock>
				<supported_graphics_clock>1860 MHz</supported_graphics_clock>
				<supported_graphics_clock>1852 MHz</supported_graphics_clock>
				<supported_graphics_clock>1845 MHz</supported_graphics_clock>
				<supported_graphics_clock>1837 MHz</supported_graphics_clock>
				<supported_graphics_clock>1830 MHz</supported_graphics_clock>
				<supported_graphics_clock>1822 MHz</supported_graphics_clock>
				<supported_graphics_clock>1815 MHz</supported_graphics_clock>
				<supported_graphics_clock>1807 MHz</supported_graphics_clock>
				<supported_graphics_clock>1800 MHz</supported_graphics_clock>
				<supported_graphics_clock>1792 MHz</supported_graphics_clock>
				<supported_graphics_clock>1785 MHz</supported_graphics_clock>
				<supported_graphics_clock>1777 MHz</supported_graphics_clock>
				<supported_graphics_clock>1770 MHz</supported_graphics_clock>
				<supported_graphics_clock>1762 MHz</supported_graphics_clock>
				<supported_graphics_clock>1755 MHz</supported_graphics_clock>
				<supported_graphics_clock>1747 MHz</supported_graphics_clock>
				<supported_graphics_clock>1740 MHz</supported_graphics_clock>
				<supported_graphics_clock>1732 MHz</supported_graphics_clock>
				<supported_graphics_clock>1725 MHz</supported_graphics_clock>
				<supported_graphics_clock>1717 MHz</supported_graphics_clock>
				<supported_graphics_clock>1710 MHz</supported_graphics_clock>
				<supported_graphics_clock>1702 MHz</supported_graphics_clock>
				<supported_graphics_clock>1695 MHz</supported_graphics_clock>
				<supported_graphics_clock>1687 MHz</supported_graphics_clock>
				<supported_graphics_clock>1680 MHz</supported_graphics_clock>
				<supported_graphics_clock>1672 MHz</supported_graphics_clock>
				<supported_graphics_clock>1665 MHz</supported_graphics_clock>
				<supported_graphics_clock>1657 MHz</supported_graphics_clock>
				<supported_graphics_clock>1650 MHz</supported_graphics_clock>
				<supported_graphics_clock>1642 MHz</supported_graphics_clock>
				<supported_graphics_clock>1635 MHz</supported_graphics_clock>
				<supported_graphics_clock>1627 MHz</supported_graphics_clock>
				<supported_graphics_clock>1620 MHz</supported_graphics_clock>
				<supported_graphics_clock>1612 MHz</supported_graphics_clock>
				<supported_graphics_clock>1605 MHz</supported_graphics_clock>
				<supported_graphics_clock>1597 MHz</supported_graphics_clock>
				<supported_graphics_clock>1590 MHz</supported_graphics_clock>
				<supported_graphics_clock>1582 MHz</supported_graphics_clock>
				<supported_graphics_clock>1575 MHz</supported_graphics_clock>
				<supported_graphics_clock>1567 MHz</supported_graphics_clock>
				<supported_graphics_clock>1560 MHz</supported_graphics_clock>
				<supported_graphics_clock>1552 MHz</supported_graphics_clock>
				<supported_graphics_clock>1545 MHz</supported_graphics_clock>
				<supported_graphics_clock>1537 MHz</supported_graphics_clock>
				<supported_graphics_clock>1530 MHz</supported_graphics_clock>
				<supported_graphics_clock>1522 MHz</supported_graphics_clock>
				<supported_graphics_clock>1515 MHz</supported_graphics_clock>
				<supported_graphics_clock>1507 MHz</supported_graphics_clock>
				<supported_graphics_clock>1500 MHz</supported_graphics_clock>
				<supported_graphics_clock>1492 MHz</supported_graphics_clock>
				<supported_graphics_clock>1485 MHz</supported_graphics_clock>
				<supported_graphics_clock>1477 MHz</supported_graphics_clock>
				<supported_graphics_clock>1470 MHz</supported_graphics_clock>
				<supported_graphics_clock>1462 MHz</supported_graphics_clock>
				<supported_graphics_clock>1455 MHz</supported_graphics_clock>
				<supported_graphics_clock>1447 MHz</supported_graphics_clock>
				<supported_graphics_clock>1440 MHz</supported_graphics_clock>
				<supported_graphics_clock>1432 MHz</supported_graphics_clock>
				<supported_graphics_clock>1425 MHz</supported_graphics_clock>
				<supported_graphics_clock>1417 MHz</supported_graphics_clock>
				<supported_graphics_clock>1410 MHz</supported_graphics_clock>
				<supported_graphics_clock>1402 MHz</supported_graphics_clock>
				<supported_graphics_clock>1395 MHz</supported_graphics_clock>
				<supported_graphics_clock>1387 MHz</supported_graphics_clock>
				<supported_graphics_clock>1380 MHz</supported_graphics_clock>
				<supported_graphics_clock>1372 MHz</supported_graphics_clock>
				<supported_graphics_clock>1365 MHz</supported_graphics_clock>
				<supported_graphics_clock>1357 MHz</supported_graphics_clock>
				<supported_graphics_clock>1350 MHz</supported_graphics_clock>
				<supported_graphics_clock>1342 MHz</supported_graphics_clock>
				<supported_graphics_clock>1335 MHz</supported_graphics_clock>
				<supported_graphics_clock>1327 MHz</supported_graphics_clock>
				<supported_graphics_clock>1320 MHz</supported_graphics_clock>
				<supported_graphics_clock>1312 MHz</supported_graphics_clock>
				<supported_graphics_clock>1305 MHz</supported_graphics_clock>
				<supported_graphics_clock>1297 MHz</supported_graphics_clock>
				<supported_graphics_clock>1290 MHz</supported_graphics_clock>
				<supported_graphics_clock>1282 MHz</supported_graphics_clock>
				<supported_graphics_clock>1275 MHz</supported_graphics_clock>
				<supported_graphics_clock>1267 MHz</supported_graphics_clock>
				<supported_graphics_clock>1260 MHz</supported_graphics_clock>
				<supported_graphics_clock>1252 MHz</supported_graphics_clock>
				<supported_graphics_clock>1245 MHz</supported_graphics_clock>
				<supported_graphics_clock>1237 MHz</supported_graphics_clock>
				<supported_graphics_clock>1230 MHz</supported_graphics_clock>
				<supported_graphics_clock>1222 MHz</supported_graphics_clock>
				<supported_graphics_clock>1215 MHz</supported_graphics_clock>
				<supported_graphics_clock>1207 MHz</supported_graphics_clock>
				<supported_graphics_clock>1200 MHz</supported_graphics_clock>
				<supported_graphics_clock>1192 MHz</supported_graphics_clock>
				<supported_graphics_clock>1185 MHz</supported_graphics_clock>
				<supported_graphics_clock>1177 MHz</supported_graphics_clock>
				<supported_graphics_clock>1170 MHz</supported_graphics_clock>
				<supported_graphics_clock>1162 MHz</supported_graphics_clock>
				<supported_graphics_clock>1155 MHz</supported_graphics_clock>
				<supported_graphics_clock>1147 MHz</supported_graphics_clock>
				<supported_graphics_clock>1140 MHz</supported_graphics_clock>
				<supported_graphics_clock>1132 MHz</supported_graphics_clock>
				<supported_graphics_clock>1125 MHz</supported_graphics_clock>
				<supported_graphics_clock>1117 MHz</supported_graphics_clock>
				<supported_graphics_clock>1110 MHz</supported_graphics_clock>
				<supported_graphics_clock>1102 MHz</supported_graphics_clock>
				<supported_graphics_clock>1095 MHz</supported_graphics_clock>
				<supported_graphics_clock>1087 MHz</supported_graphics_clock>
				<supported_graphics_clock>1080 MHz</supported_graphics_clock>
				<supported_graphics_clock>1072 MHz</supported_graphics_clock>
				<supported_graphics_clock>1065 MHz</supported_graphics_clock>
				<supported_graphics_clock>1057 MHz</supported_graphics_clock>
				<supported_graphics_clock>1050 MHz</supported_graphics_clock>
				<supported_graphics_clock>1042 MHz</supported_graphics_clock>
				<supported_graphics_clock>1035 MHz</supported_graphics_clock>
				<supported_graphics_clock>1027 MHz</supported_graphics_clock>
				<supported_graphics_clock>1020 MHz</supported_graphics_clock>
				<supported_graphics_clock>1012 MHz</supported_graphics_clock>
				<supported_graphics_clock>1005 MHz</supported_graphics_clock>
				<supported_graphics_clock>997 MHz</supported_graphics_clock>
				<supported_graphics_clock>990 MHz</supported_graphics_clock>
				<supported_graphics_clock>982 MHz</supported_graphics_clock>
				<supported_graphics_clock>975 MHz</supported_graphics_clock>
				<supported_graphics_clock>967 MHz</supported_graphics_clock>
				<supported_graphics_clock>960 MHz</supported_graphics_clock>
				<supported_graphics_clock>952 MHz</supported_graphics_clock>
				<supported_graphics_clock>945 MHz</supported_graphics_clock>
				<supported_graphics_clock>937 MHz</supported_graphics_clock>
				<supported_graphics_clock>930 MHz</supported_graphics_clock>
				<supported_graphics_clock>922 MHz</supported_graphics_clock>
				<supported_graphics_clock>915 MHz</supported_graphics_clock>
				<supported_graphics_clock>907 MHz</supported_graphics_clock>
				<supported_graphics_clock>900 MHz</supported_graphics_clock>
				<supported_graphics_clock>892 MHz</supported_graphics_clock>
				<supported_graphics_clock>885 MHz</supported_graphics_clock>
				<supported_graphics_clock>877 MHz</supported_graphics_clock>
				<supported_graphics_clock>870 MHz</supported_graphics_clock>
				<supported_graphics_clock>862 MHz</supported_graphics_clock>
				<supported_graphics_clock>855 MHz</supported_graphics_clock>
				<supported_graphics_clock>847 MHz</supported_graphics_clock>
				<supported_graphics_clock>840 MHz</supported_graphics_clock>
				<supported_graphics_clock>832 MHz</supported_graphics_clock>
				<supported_graphics_clock>825 MHz</supported_graphics_clock>
				<supported_graphics_clock>817 MHz</supported_graphics_clock>
				<supported_graphics_clock>810 MHz</supported_graphics_clock>
				<supported_graphics_clock>802 MHz</supported_graphics_clock>
				<supported_graphics_clock>795 MHz</supported_graphics_clock>
				<supported_graphics_clock>787 MHz</supported_graphics_clock>
				<supported_graphics_clock>780 MHz</supported_graphics_clock>
				<supported_graphics_clock>772 MHz</supported_graphics_clock>
				<supported_graphics_clock>765 MHz</supported_graphics_clock>
				<supported_graphics_clock>757 MHz</supported_graphics_clock>
				<supported_graphics_clock>750 MHz</supported_graphics_clock>
				<supported_graphics_clock>742 MHz</supported_graphics_clock>
				<supported_graphics_clock>735 MHz</supported_graphics_clock>
				<supported_graphics_clock>727 MHz</supported_graphics_clock>
				<supported_graphics_clock>720 MHz</supported_graphics_clock>
				<supported_graphics_clock>712 MHz</supported_graphics_clock>
				<supported_graphics_clock>705 MHz</supported_graphics_clock>
				<supported_graphics_clock>697 MHz</supported_graphics_clock>
				<supported_graphics_clock>690 MHz</supported_graphics_clock>
				<supported_graphics_clock>682 MHz</supported_graphics_clock>
				<supported_graphics_clock>675 MHz</supported_graphics_clock>
				<supported_graphics_clock>667 MHz</supported_graphics_clock>
				<supported_graphics_clock>660 MHz</supported_graphics_clock>
				<supported_graphics_clock>652 MHz</supported_graphics_clock>
				<supported_graphics_clock>645 MHz</supported_graphics_clock>
				<supported_graphics_clock>637 MHz</supported_graphics_clock>
				<supported_graphics_clock>630 MHz</supported_graphics_clock>
				<supported_graphics_clock>622 MHz</supported_graphics_clock>
				<supported_graphics_clock>615 MHz</supported_graphics_clock>
				<supported_graphics_clock>607 MHz</supported_graphics_clock>
				<supported_graphics_clock>600 MHz</supported_graphics_clock>
				<supported_graphics_clock>592 MHz</supported_graphics_clock>
				<supported_graphics_clock>585 MHz</supported_graphics_clock>
				<supported_graphics_clock>577 MHz</supported_graphics_clock>
				<supported_graphics_clock>570 MHz</supported_graphics_clock>
				<supported_graphics_clock>562 MHz</supported_graphics_clock>
				<supported_graphics_clock>555 MHz</supported_graphics_clock>
				<supported_graphics_clock>547 MHz</supported_graphics_clock>
				<supported_graphics_clock>540 MHz</supported_graphics_clock>
				<supported_graphics_clock>532 MHz</supported_graphics_clock>
				<supported_graphics_clock>525 MHz</supported_graphics_clock>
				<supported_graphics_clock>517 MHz</supported_graphics_clock>
				<supported_graphics_clock>510 MHz</supported_graphics_clock>
				<supported_graphics_clock>502 MHz</supported_graphics_clock>
				<supported_graphics_clock>495 MHz</supported_graphics_clock>
				<supported_graphics_clock>487 MHz</supported_graphics_clock>
				<supported_graphics_clock>480 MHz</supported_graphics_clock>
				<supported_graphics_clock>472 MHz</supported_graphics_clock>
				<supported_graphics_clock>465 MHz</supported_graphics_clock>
				<supported_graphics_clock>457 MHz</supported_graphics_clock>
				<supported_graphics_clock>450 MHz</supported_graphics_clock>
				<supported_graphics_clock>442 MHz</supported_graphics_clock>
				<supported_graphics_clock>435 MHz</supported_graphics_clock>
				<supported_graphics_clock>427 MHz</supported_graphics_clock>
				<supported_graphics_clock>420 MHz</supported_graphics_clock>
				<supported_graphics_clock>412 MHz</supported_graphics_clock>
				<supported_graphics_clock>405 MHz</supported_graphics_clock>
			</supported_mem_clock>
			<supported_mem_clock>
				<value>6801 MHz</value>
				<supported_graphics_clock>2160 MHz</supported_graphics_clock>
				<supported_graphics_clock>2152 MHz</supported_graphics_clock>
				<supported_graphics_clock>2145 MHz</supported_graphics_clock>
				<supported_graphics_clock>2137 MHz</supported_graphics_clock>
				<supported_graphics_clock>2130 MHz</supported_graphics_clock>
				<supported_graphics_clock>2122 MHz</supported_graphics_clock>
				<supported_graphics_clock>2115 MHz</supported_graphics_clock>
				<supported_graphics_clock>2107 MHz</supported_graphics_clock>
				<supported_graphics_clock>2100 MHz</supported_graphics_clock>
				<supported_graphics_clock>2092 MHz</supported_graphics_clock>
				<supported_graphics_clock>2085 MHz</supported_graphics_clock>
				<supported_graphics_clock>2077 MHz</supported_graphics_clock>
				<supported_graphics_clock>2070 MHz</supported_graphics_clock>
				<supported_graphics_clock>2062 MHz</supported_graphics_clock>
				<supported_graphics_clock>2055 MHz</supported_graphics_clock>
				<supported_graphics_clock>2047 MHz</supported_graphics_clock>
				<supported_graphics_clock>2040 MHz</supported_graphics_clock>
				<supported_graphics_clock>2032 MHz</supported_graphics_clock>
				<supported_graphics_clock>2025 MHz</supported_graphics_clock>
				<supported_graphics_clock>2017 MHz</supported_graphics_clock>
				<supported_graphics_clock>2010 MHz</supported_graphics_clock>
				<supported_graphics_clock>2002 MHz</supported_graphics_clock>
				<supported_graphics_clock>1995 MHz</supported_graphics_clock>
				<supported_graphics_clock>1987 MHz</supported_graphics_clock>
				<supported_graphics_clock>1980 MHz</supported_graphics_clock>
				<supported_graphics_clock>1972 MHz</supported_graphics_clock>
				<supported_graphics_clock>1965 MHz</supported_graphics_clock>
				<supported_graphics_clock>1957 MHz</supported_graphics_clock>
				<supported_graphics_clock>1950 MHz</supported_graphics_clock>
				<supported_graphics_clock>1942 MHz</supported_graphics_clock>
				<supported_graphics_clock>1935 MHz</supported_graphics_clock>
				<supported_graphics_clock>1927 MHz</supported_graphics_clock>
				<supported_graphics_clock>1920 MHz</supported_graphics_clock>
				<supported_graphics_clock>1912 MHz</supported_graphics_clock>
				<supported_graphics_clock>1905 MHz</supported_graphics_clock>
				<supported_graphics_clock>1897 MHz</supported_graphics_clock>
				<supported_graphics_clock>1890 MHz</supported_graphics_clock>
				<supported_graphics_clock>1882 MHz</supported_graphics_clock>
				<supported_graphics_clock>1875 MHz</supported_graphics_clock>
				<supported_graphics_clock>1867 MHz</supported_graphics_clock>
				<supported_graphics_clock>1860 MHz</supported_graphics_clock>
				<supported_graphics_clock>1852 MHz</supported_graphics_clock>
				<supported_graphics_clock>1845 MHz</supported_graphics_clock>
				<supported_graphics_clock>1837 MHz</supported_graphics_clock>
				<supported_graphics_clock>1830 MHz</supported_graphics_clock>
				<supported_graphics_clock>1822 MHz</supported_graphics_clock>
				<supported_graphics_clock>1815 MHz</supported_graphics_clock>
				<supported_graphics_clock>1807 MHz</supported_graphics_clock>
				<supported_graphics_clock>1800 MHz</supported_graphics_clock>
				<supported_graphics_clock>1792 MHz</supported_graphics_clock>
				<supported_graphics_clock>1785 MHz</supported_graphics_clock>
				<supported_graphics_clock>1777 MHz</supported_graphics_clock>
				<supported_graphics_clock>1770 MHz</supported_graphics_clock>
				<supported_graphics_clock>1762 MHz</supported_graphics_clock>
				<supported_graphics_clock>1755 MHz</supported_graphics_clock>
				<supported_graphics_clock>1747 MHz</supported_graphics_clock>
				<supported_graphics_clock>1740 MHz</supported_graphics_clock>
				<supported_graphics_clock>1732 MHz</supported_graphics_clock>
				<supported_graphics_clock>1725 MHz</supported_graphics_clock>
				<supported_graphics_clock>1717 MHz</supported_graphics_clock>
				<supported_graphics_clock>1710 MHz</supported_graphics_clock>
				<supported_graphics_clock>1702 MHz</supported_graphics_clock>
				<supported_graphics_clock>1695 MHz</supported_graphics_clock>
				<supported_graphics_clock>1687 MHz</supported_graphics_clock>
				<supported_graphics_clock>1680 MHz</supported_graphics_clock>
				<supported_graphics_clock>1672 MHz</supported_graphics_clock>
				<supported_graphics_clock>1665 MHz</supported_graphics_clock>
				<supported_graphics_clock>1657 MHz</supported_graphics_clock>
				<supported_graphics_clock>1650 MHz</supported_graphics_clock>
				<supported_graphics_clock>1642 MHz</supported_graphics_clock>
				<supported_graphics_clock>1635 MHz</supported_graphics_clock>
				<supported_graphics_clock>1627 MHz</supported_graphics_clock>
				<supported_graphics_clock>1620 MHz</supported_graphics_clock>
				<supported_graphics_clock>1612 MHz</supported_graphics_clock>
				<supported_graphics_clock>1605 MHz</supported_graphics_clock>
				<supported_graphics_clock>1597 MHz</supported_graphics_clock>
				<supported_graphics_clock>1590 MHz</supported_graphics_clock>
				<supported_graphics_clock>1582 MHz</supported_graphics_clock>
				<supported_graphics_clock>1575 MHz</supported_graphics_clock>
				<supported_graphics_clock>1567 MHz</supported_graphics_clock>
				<supported_graphics_clock>1560 MHz</supported_graphics_clock>
				<supported_graphics_clock>1552 MHz</supported_graphics_clock>
				<supported_graphics_clock>1545 MHz</supported_graphics_clock>
				<supported_graphics_clock>1537 MHz</supported_graphics_clock>
				<supported_graphics_clock>1530 MHz</supported_graphics_clock>
				<supported_graphics_clock>1522 MHz</supported_graphics_clock>
				<supported_graphics_clock>1515 MHz</supported_graphics_clock>
				<supported_graphics_clock>1507 MHz</supported_graphics_clock>
				<supported_graphics_clock>1500 MHz</supported_graphics_clock>
				<supported_graphics_clock>1492 MHz</supported_graphics_clock>
				<supported_graphics_clock>1485 MHz</supported_graphics_clock>
				<supported_graphics_clock>1477 MHz</supported_graphics_clock>
				<supported_graphics_clock>1470 MHz</supported_graphics_clock>
				<supported_graphics_clock>1462 MHz</supported_graphics_clock>
				<supported_graphics_clock>1455 MHz</supported_graphics_clock>
				<supported_graphics_clock>1447 MHz</supported_graphics_clock>
				<supported_graphics_clock>1440 MHz</supported_graphics_clock>
				<supported_graphics_clock>1432 MHz</supported_graphics_clock>
				<supported_graphics_clock>1425 MHz</supported_graphics_clock>
				<supported_graphics_clock>1417 MHz</supported_graphics_clock>
				<supported_graphics_clock>1410 MHz</supported_graphics_clock>
				<supported_graphics_clock>1402 MHz</supported_graphics_clock>
				<supported_graphics_clock>1395 MHz</supported_graphics_clock>
				<supported_graphics_clock>1387 MHz</supported_graphics_clock>
				<supported_graphics_clock>1380 MHz</supported_graphics_clock>
				<supported_graphics_clock>1372 MHz</supported_graphics_clock>
				<supported_graphics_clock>1365 MHz</supported_graphics_clock>
				<supported_graphics_clock>1357 MHz</supported_graphics_clock>
				<supported_graphics_clock>1350 MHz</supported_graphics_clock>
				<supported_graphics_clock>1342 MHz</supported_graphics_clock>
				<supported_graphics_clock>1335 MHz</supported_graphics_clock>
				<supported_graphics_clock>1327 MHz</supported_graphics_clock>
				<supported_graphics_clock>1320 MHz</supported_graphics_clock>
				<supported_graphics_clock>1312 MHz</supported_graphics_clock>
				<supported_graphics_clock>1305 MHz</supported_graphics_clock>
				<supported_graphics_clock>1297 MHz</supported_graphics_clock>
				<supported_graphics_clock>1290 MHz</supported_graphics_clock>
				<supported_graphics_clock>1282 MHz</supported_graphics_clock>
				<supported_graphics_clock>1275 MHz</supported_graphics_clock>
				<supported_graphics_clock>1267 MHz</supported_graphics_clock>
				<supported_graphics_clock>1260 MHz</supported_graphics_clock>
				<supported_graphics_clock>1252 MHz</supported_graphics_clock>
				<supported_graphics_clock>1245 MHz</supported_graphics_clock>
				<supported_graphics_clock>1237 MHz</supported_graphics_clock>
				<supported_graphics_clock>1230 MHz</supported_graphics_clock>
				<supported_graphics_clock>1222 MHz</supported_graphics_clock>
				<supported_graphics_clock>1215 MHz</supported_graphics_clock>
				<supported_graphics_clock>1207 MHz</supported_graphics_clock>
				<supported_graphics_clock>1200 MHz</supported_graphics_clock>
				<supported_graphics_clock>1192 MHz</supported_graphics_clock>
				<supported_graphics_clock>1185 MHz</supported_graphics_clock>
				<supported_graphics_clock>1177 MHz</supported_graphics_clock>
				<supported_graphics_clock>1170 MHz</supported_graphics_clock>
				<supported_graphics_clock>1162 MHz</supported_graphics_clock>
				<supported_graphics_clock>1155 MHz</supported_graphics_clock>
				<supported_graphics_clock>1147 MHz</supported_graphics_clock>
				<supported_graphics_clock>1140 MHz</supported_graphics_clock>
				<supported_graphics_clock>1132 MHz</supported_graphics_clock>
				<supported_graphics_clock>1125 MHz</supported_graphics_clock>
				<supported_graphics_clock>1117 MHz</supported_graphics_clock>
				<supported_graphics_clock>1110 MHz</supported_graphics_clock>
				<supported_graphics_clock>1102 MHz</supported_graphics_clock>
				<supported_graphics_clock>1095 MHz</supported_graphics_clock>
				<supported_graphics_clock>1087 MHz</supported_graphics_clock>
				<supported_graphics_clock>1080 MHz</supported_graphics_clock>
				<supported_graphics_clock>1072 MHz</supported_graphics_clock>
				<supported_graphics_clock>1065 MHz</supported_graphics_clock>
				<supported_graphics_clock>1057 MHz</supported_graphics_clock>
				<supported_graphics_clock>1050 MHz</supported_graphics_clock>
				<supported_graphics_clock>1042 MHz</supported_graphics_clock>
				<supported_graphics_clock>1035 MHz</supported_graphics_clock>
				<supported_graphics_clock>1027 MHz</supported_graphics_clock>
				<supported_graphics_clock>1020 MHz</supported_graphics_clock>
				<supported_graphics_clock>1012 MHz</supported_graphics_clock>
				<supported_graphics_clock>1005 MHz</supported_graphics_clock>
				<supported_graphics_clock>997 MHz</supported_graphics_clock>
				<supported_graphics_clock>990 MHz</supported_graphics_clock>
				<supported_graphics_clock>982 MHz</supported_graphics_clock>
				<supported_graphics_clock>975 MHz</supported_graphics_clock>
				<supported_graphics_clock>967 MHz</supported_graphics_clock>
				<supported_graphics_clock>960 MHz</supported_graphics_clock>
				<supported_graphics_clock>952 MHz</supported_graphics_clock>
				<supported_graphics_clock>945 MHz</supported_graphics_clock>
				<supported_graphics_clock>937 MHz</supported_graphics_clock>
				<supported_graphics_clock>930 MHz</supported_graphics_clock>
				<supported_graphics_clock>922 MHz</supported_graphics_clock>
				<supported_graphics_clock>915 MHz</supported_graphics_clock>
				<supported_graphics_clock>907 MHz</supported_graphics_clock>
				<supported_graphics_clock>900 MHz</supported_graphics_clock>
				<supported_graphics_clock>892 MHz</supported_graphics_clock>
				<supported_graphics_clock>885 MHz</supported_graphics_clock>
				<supported_graphics_clock>877 MHz</supported_graphics_clock>
				<supported_graphics_clock>870 MHz</supported_graphics_clock>
				<supported_graphics_clock>862 MHz</supported_graphics_clock>
				<supported_graphics_clock>855 MHz</supported_graphics_clock>
				<supported_graphics_clock>847 MHz</supported_graphics_clock>
				<supported_graphics_clock>840 MHz</supported_graphics_clock>
				<supported_graphics_clock>832 MHz</supported_graphics_clock>
				<supported_graphics_clock>825 MHz</supported_graphics_clock>
				<supported_graphics_clock>817 MHz</supported_graphics_clock>
				<supported_graphics_clock>810 MHz</supported_graphics_clock>
				<supported_graphics_clock>802 MHz</supported_graphics_clock>
				<supported_graphics_clock>795 MHz</supported_graphics_clock>
				<supported_graphics_clock>787 MHz</supported_graphics_clock>
				<supported_graphics_clock>780 MHz</supported_graphics_clock>
				<supported_graphics_clock>772 MHz</supported_graphics_clock>
				<supported_graphics_clock>765 MHz</supported_graphics_clock>
				<supported_graphics_clock>757 MHz</supported_graphics_clock>
				<supported_graphics_clock>750 MHz</supported_graphics_clock>
				<supported_graphics_clock>742 MHz</supported_graphics_clock>
				<supported_graphics_clock>735 MHz</supported_graphics_clock>
				<supported_graphics_clock>727 MHz</supported_graphics_clock>
				<supported_graphics_clock>720 MHz</supported_graphics_clock>
				<supported_graphics_clock>712 MHz</supported_graphics_clock>
				<supported_graphics_clock>705 MHz</supported_graphics_clock>
				<supported_graphics_clock>697 MHz</supported_graphics_clock>
				<supported_graphics_clock>690 MHz</supported_graphics_clock>
				<supported_graphics_clock>682 MHz</supported_graphics_clock>
				<supported_graphics_clock>675 MHz</supported_graphics_clock>
				<supported_graphics_clock>667 MHz</supported_graphics_clock>
				<supported_graphics_clock>660 MHz</supported_graphics_clock>
				<supported_graphics_clock>652 MHz</supported_graphics_clock>
				<supported_graphics_clock>645 MHz</supported_graphics_clock>
				<supported_graphics_clock>637 MHz</supported_graphics_clock>
				<supported_graphics_clock>630 MHz</supported_graphics_clock>
				<supported_graphics_clock>622 MHz</supported_graphics_clock>
				<supported_graphics_clock>615 MHz</supported_graphics_clock>
				<supported_graphics_clock>607 MHz</supported_graphics_clock>
				<supported_graphics_clock>600 MHz</supported_graphics_clock>
				<supported_graphics_clock>592 MHz</supported_graphics_clock>
				<supported_graphics_clock>585 MHz</supported_graphics_clock>
				<supported_graphics_clock>577 MHz</supported_graphics_clock>
				<supported_graphics_clock>570 MHz</supported_graphics_clock>
				<supported_graphics_clock>562 MHz</supported_graphics_clock>
				<supported_graphics_clock>555 MHz</supported_graphics_clock>
				<supported_graphics_clock>547 MHz</supported_graphics_clock>
				<supported_graphics_clock>540 MHz</supported_graphics_clock>
				<supported_graphics_clock>532 MHz</supported_graphics_clock>
				<supported_graphics_clock>525 MHz</supported_graphics_clock>
				<supported_graphics_clock>517 MHz</supported_graphics_clock>
				<supported_graphics_clock>510 MHz</supported_graphics_clock>
				<supported_graphics_clock>502 MHz</supported_graphics_clock>
				<supported_graphics_clock>495 MHz</supported_graphics_clock>
				<supported_graphics_clock>487 MHz</supported_graphics_clock>
				<supported_graphics_clock>480 MHz</supported_graphics_clock>
				<supported_graphics_clock>472 MHz</supported_graphics_clock>
				<supported_graphics_clock>465 MHz</supported_graphics_clock>
				<supported_graphics_clock>457 MHz</supported_graphics_clock>
				<supported_graphics_clock>450 MHz</supported_graphics_clock>
				<supported_graphics_clock>442 MHz</supported_graphics_clock>
				<supported_graphics_clock>435 MHz</supported_graphics_clock>
				<supported_graphics_clock>427 MHz</supported_graphics_clock>
				<supported_graphics_clock>420 MHz</supported_graphics_clock>
				<supported_graphics_clock>412 MHz</supported_graphics_clock>
				<supported_graphics_clock>405 MHz</supported_graphics_clock>
			</supported_mem_clock>
			<supported_mem_clock>
				<value>5001 MHz</value>
				<supported_graphics_clock>2160 MHz</supported_graphics_clock>
				<supported_graphics_clock>2152 MHz</supported_graphics_clock>
				<supported_graphics_clock>2145 MHz</supported_graphics_clock>
				<supported_graphics_clock>2137 MHz</supported_graphics_clock>
				<supported_graphics_clock>2130 MHz</supported_graphics_clock>
				<supported_graphics_clock>2122 MHz</supported_graphics_clock>
				<supported_graphics_clock>2115 MHz</supported_graphics_clock>
				<supported_graphics_clock>2107 MHz</supported_graphics_clock>
				<supported_graphics_clock>2100 MHz</supported_graphics_clock>
				<supported_graphics_clock>2092 MHz</supported_graphics_clock>
				<supported_graphics_clock>2085 MHz</supported_graphics_clock>
				<supported_graphics_clock>2077 MHz</supported_graphics_clock>
				<supported_graphics_clock>2070 MHz</supported_graphics_clock>
				<supported_graphics_clock>2062 MHz</supported_graphics_clock>
				<supported_graphics_clock>2055 MHz</supported_graphics_clock>
				<supported_graphics_clock>2047 MHz</supported_graphics_clock>
				<supported_graphics_clock>2040 MHz</supported_graphics_clock>
				<supported_graphics_clock>2032 MHz</supported_graphics_clock>
				<supported_graphics_clock>2025 MHz</supported_graphics_clock>
				<supported_graphics_clock>2017 MHz</supported_graphics_clock>
				<supported_graphics_clock>2010 MHz</supported_graphics_clock>
				<supported_graphics_clock>2002 MHz</supported_graphics_clock>
				<supported_graphics_clock>1995 MHz</supported_graphics_clock>
				<supported_graphics_clock>1987 MHz</supported_graphics_clock>
				<supported_graphics_clock>1980 MHz</supported_graphics_clock>
				<supported_graphics_clock>1972 MHz</supported_graphics_clock>
				<supported_graphics_clock>1965 MHz</supported_graphics_clock>
				<supported_graphics_clock>1957 MHz</supported_graphics_clock>
				<supported_graphics_clock>1950 MHz</supported_graphics_clock>
				<supported_graphics_clock>1942 MHz</supported_graphics_clock>
				<supported_graphics_clock>1935 MHz</supported_graphics_clock>
				<supported_graphics_clock>1927 MHz</supported_graphics_clock>
				<supported_graphics_clock>1920 MHz</supported_graphics_clock>
				<supported_graphics_clock>1912 MHz</supported_graphics_clock>
				<supported_graphics_clock>1905 MHz</supported_graphics_clock>
				<supported_graphics_clock>1897 MHz</supported_graphics_clock>
				<supported_graphics_clock>1890 MHz</supported_graphics_clock>
				<supported_graphics_clock>1882 MHz</supported_graphics_clock>
				<supported_graphics_clock>1875 MHz</supported_graphics_clock>
				<supported_graphics_clock>1867 MHz</supported_graphics_clock>
				<supported_graphics_clock>1860 MHz</supported_graphics_clock>
				<supported_graphics_clock>1852 MHz</supported_graphics_clock>
				<supported_graphics_clock>1845 MHz</supported_graphics_clock>
				<supported_graphics_clock>1837 MHz</supported_graphics_clock>
				<supported_graphics_clock>1830 MHz</supported_graphics_clock>
				<supported_graphics_clock>1822 MHz</supported_graphics_clock>
				<supported_graphics_clock>1815 MHz</supported_graphics_clock>
				<supported_graphics_clock>1807 MHz</supported_graphics_clock>
				<supported_graphics_clock>1800 MHz</supported_graphics_clock>
				<supported_graphics_clock>1792 MHz</supported_graphics_clock>
				<supported_graphics_clock>1785 MHz</supported_graphics_clock>
				<supported_graphics_clock>1777 MHz</supported_graphics_clock>
				<supported_graphics_clock>1770 MHz</supported_graphics_clock>
				<supported_graphics_clock>1762 MHz</supported_graphics_clock>
				<supported_graphics_clock>1755 MHz</supported_graphics_clock>
				<supported_graphics_clock>1747 MHz</supported_graphics_clock>
				<supported_graphics_clock>1740 MHz</supported_graphics_clock>
				<supported_graphics_clock>1732 MHz</supported_graphics_clock>
				<supported_graphics_clock>1725 MHz</supported_graphics_clock>
				<supported_graphics_clock>1717 MHz</supported_graphics_clock>
				<supported_graphics_clock>1710 MHz</supported_graphics_clock>
				<supported_graphics_clock>1702 MHz</supported_graphics_clock>
				<supported_graphics_clock>1695 MHz</supported_graphics_clock>
				<supported_graphics_clock>1687 MHz</supported_graphics_clock>
				<supported_graphics_clock>1680 MHz</supported_graphics_clock>
				<supported_graphics_clock>1672 MHz</supported_graphics_clock>
				<supported_graphics_clock>1665 MHz</supported_graphics_clock>
				<supported_graphics_clock>1657 MHz</supported_graphics_clock>
				<supported_graphics_clock>1650 MHz</supported_graphics_clock>
				<supported_graphics_clock>1642 MHz</supported_graphics_clock>
				<supported_graphics_clock>1635 MHz</supported_graphics_clock>
				<supported_graphics_clock>1627 MHz</supported_graphics_clock>
				<supported_graphics_clock>1620 MHz</supported_graphics_clock>
				<supported_graphics_clock>1612 MHz</supported_graphics_clock>
				<supported_graphics_clock>1605 MHz</supported_graphics_clock>
				<supported_graphics_clock>1597 MHz</supported_graphics_clock>
				<supported_graphics_clock>1590 MHz</supported_graphics_clock>
				<supported_graphics_clock>1582 MHz</supported_graphics_clock>
				<supported_graphics_clock>1575 MHz</supported_graphics_clock>
				<supported_graphics_clock>1567 MHz</supported_graphics_clock>
				<supported_graphics_clock>1560 MHz</supported_graphics_clock>
				<supported_graphics_clock>1552 MHz</supported_graphics_clock>
				<supported_graphics_clock>1545 MHz</supported_graphics_clock>
				<supported_graphics_clock>1537 MHz</supported_graphics_clock>
				<supported_graphics_clock>1530 MHz</supported_graphics_clock>
				<supported_graphics_clock>1522 MHz</supported_graphics_clock>
				<supported_graphics_clock>1515 MHz</supported_graphics_clock>
				<supported_graphics_clock>1507 MHz</supported_graphics_clock>
				<supported_graphics_clock>1500 MHz</supported_graphics_clock>
				<supported_graphics_clock>1492 MHz</supported_graphics_clock>
				<supported_graphics_clock>1485 MHz</supported_graphics_clock>
				<supported_graphics_clock>1477 MHz</supported_graphics_clock>
				<supported_graphics_clock>1470 MHz</supported_graphics_clock>
				<supported_graphics_clock>1462 MHz</supported_graphics_clock>
				<supported_graphics_clock>1455 MHz</supported_graphics_clock>
				<supported_graphics_clock>1447 MHz</supported_graphics_clock>
				<supported_graphics_clock>1440 MHz</supported_graphics_clock>
				<supported_graphics_clock>1432 MHz</supported_graphics_clock>
				<supported_graphics_clock>1425 MHz</supported_graphics_clock>
				<supported_graphics_clock>1417 MHz</supported_graphics_clock>
				<supported_graphics_clock>1410 MHz</supported_graphics_clock>
				<supported_graphics_clock>1402 MHz</supported_graphics_clock>
				<supported_graphics_clock>1395 MHz</supported_graphics_clock>
				<supported_graphics_clock>1387 MHz</supported_graphics_clock>
				<supported_graphics_clock>1380 MHz</supported_graphics_clock>
				<supported_graphics_clock>1372 MHz</supported_graphics_clock>
				<supported_graphics_clock>1365 MHz</supported_graphics_clock>
				<supported_graphics_clock>1357 MHz</supported_graphics_clock>
				<supported_graphics_clock>1350 MHz</supported_graphics_clock>
				<supported_graphics_clock>1342 MHz</supported_graphics_clock>
				<supported_graphics_clock>1335 MHz</supported_graphics_clock>
				<supported_graphics_clock>1327 MHz</supported_graphics_clock>
				<supported_graphics_clock>1320 MHz</supported_graphics_clock>
				<supported_graphics_clock>1312 MHz</supported_graphics_clock>
				<supported_graphics_clock>1305 MHz</supported_graphics_clock>
				<supported_graphics_clock>1297 MHz</supported_graphics_clock>
				<supported_graphics_clock>1290 MHz</supported_graphics_clock>
				<supported_graphics_clock>1282 MHz</supported_graphics_clock>
				<supported_graphics_clock>1275 MHz</supported_graphics_clock>
				<supported_graphics_clock>1267 MHz</supported_graphics_clock>
				<supported_graphics_clock>1260 MHz</supported_graphics_clock>
				<supported_graphics_clock>1252 MHz</supported_graphics_clock>
				<supported_graphics_clock>1245 MHz</supported_graphics_clock>
				<supported_graphics_clock>1237 MHz</supported_graphics_clock>
				<supported_graphics_clock>1230 MHz</supported_graphics_clock>
				<supported_graphics_clock>1222 MHz</supported_graphics_clock>
				<supported_graphics_clock>1215 MHz</supported_graphics_clock>
				<supported_graphics_clock>1207 MHz</supported_graphics_clock>
				<supported_graphics_clock>1200 MHz</supported_graphics_clock>
				<supported_graphics_clock>1192 MHz</supported_graphics_clock>
				<supported_graphics_clock>1185 MHz</supported_graphics_clock>
				<supported_graphics_clock>1177 MHz</supported_graphics_clock>
				<supported_graphics_clock>1170 MHz</supported_graphics_clock>
				<supported_graphics_clock>1162 MHz</supported_graphics_clock>
				<supported_graphics_clock>1155 MHz</supported_graphics_clock>
				<supported_graphics_clock>1147 MHz</supported_graphics_clock>
				<supported_graphics_clock>1140 MHz</supported_graphics_clock>
				<supported_graphics_clock>1132 MHz</supported_graphics_clock>
				<supported_graphics_clock>1125 MHz</supported_graphics_clock>
				<supported_graphics_clock>1117 MHz</supported_graphics_clock>
				<supported_graphics_clock>1110 MHz</supported_graphics_clock>
				<supported_graphics_clock>1102 MHz</supported_graphics_clock>
				<supported_graphics_clock>1095 MHz</supported_graphics_clock>
				<supported_graphics_clock>1087 MHz</supported_graphics_clock>
				<supported_graphics_clock>1080 MHz</supported_graphics_clock>
				<supported_graphics_clock>1072 MHz</supported_graphics_clock>
				<supported_graphics_clock>1065 MHz</supported_graphics_clock>
				<supported_graphics_clock>1057 MHz</supported_graphics_clock>
				<supported_graphics_clock>1050 MHz</supported_graphics_clock>
				<supported_graphics_clock>1042 MHz</supported_graphics_clock>
				<supported_graphics_clock>1035 MHz</supported_graphics_clock>
				<supported_graphics_clock>1027 MHz</supported_graphics_clock>
				<supported_graphics_clock>1020 MHz</supported_graphics_clock>
				<supported_graphics_clock>1012 MHz</supported_graphics_clock>
				<supported_graphics_clock>1005 MHz</supported_graphics_clock>
				<supported_graphics_clock>997 MHz</supported_graphics_clock>
				<supported_graphics_clock>990 MHz</supported_graphics_clock>
				<supported_graphics_clock>982 MHz</supported_graphics_clock>
				<supported_graphics_clock>975 MHz</supported_graphics_clock>
				<supported_graphics_clock>967 MHz</supported_graphics_clock>
				<supported_graphics_clock>960 MHz</supported_graphics_clock>
				<supported_graphics_clock>952 MHz</supported_graphics_clock>
				<supported_graphics_clock>945 MHz</supported_graphics_clock>
				<supported_graphics_clock>937 MHz</supported_graphics_clock>
				<supported_graphics_clock>930 MHz</supported_graphics_clock>
				<supported_graphics_clock>922 MHz</supported_graphics_clock>
				<supported_graphics_clock>915 MHz</supported_graphics_clock>
				<supported_graphics_clock>907 MHz</supported_graphics_clock>
				<supported_graphics_clock>900 MHz</supported_graphics_clock>
				<supported_graphics_clock>892 MHz</supported_graphics_clock>
				<supported_graphics_clock>885 MHz</supported_graphics_clock>
				<supported_graphics_clock>877 MHz</supported_graphics_clock>
				<supported_graphics_clock>870 MHz</supported_graphics_clock>
				<supported_graphics_clock>862 MHz</supported_graphics_clock>
				<supported_graphics_clock>855 MHz</supported_graphics_clock>
				<supported_graphics_clock>847 MHz</supported_graphics_clock>
				<supported_graphics_clock>840 MHz</supported_graphics_clock>
				<supported_graphics_clock>832 MHz</supported_graphics_clock>
				<supported_graphics_clock>825 MHz</supported_graphics_clock>
				<supported_graphics_clock>817 MHz</supported_graphics_clock>
				<supported_graphics_clock>810 MHz</supported_graphics_clock>
				<supported_graphics_clock>802 MHz</supported_graphics_clock>
				<supported_graphics_clock>795 MHz</supported_graphics_clock>
				<supported_graphics_clock>787 MHz</supported_graphics_clock>
				<supported_graphics_clock>780 MHz</supported_graphics_clock>
				<supported_graphics_clock>772 MHz</supported_graphics_clock>
				<supported_graphics_clock>765 MHz</supported_graphics_clock>
				<supported_graphics_clock>757 MHz</supported_graphics_clock>
				<supported_graphics_clock>750 MHz</supported_graphics_clock>
				<supported_graphics_clock>742 MHz</supported_graphics_clock>
				<supported_graphics_clock>735 MHz</supported_graphics_clock>
				<supported_graphics_clock>727 MHz</supported_graphics_clock>
				<supported_graphics_clock>720 MHz</supported_graphics_clock>
				<supported_graphics_clock>712 MHz</supported_graphics_clock>
				<supported_graphics_clock>705 MHz</supported_graphics_clock>
				<supported_graphics_clock>697 MHz</supported_graphics_clock>
				<supported_graphics_clock>690 MHz</supported_graphics_clock>
				<supported_graphics_clock>682 MHz</supported_graphics_clock>
				<supported_graphics_clock>675 MHz</supported_graphics_clock>
				<supported_graphics_clock>667 MHz</supported_graphics_clock>
				<supported_graphics_clock>660 MHz</supported_graphics_clock>
				<supported_graphics_clock>652 MHz</supported_graphics_clock>
				<supported_graphics_clock>645 MHz</supported_graphics_clock>
				<supported_graphics_clock>637 MHz</supported_graphics_clock>
				<supported_graphics_clock>630 MHz</supported_graphics_clock>
				<supported_graphics_clock>622 MHz</supported_graphics_clock>
				<supported_graphics_clock>615 MHz</supported_graphics_clock>
				<supported_graphics_clock>607 MHz</supported_graphics_clock>
				<supported_graphics_clock>600 MHz</supported_graphics_clock>
				<supported_graphics_clock>592 MHz</supported_graphics_clock>
				<supported_graphics_clock>585 MHz</supported_graphics_clock>
				<supported_graphics_clock>577 MHz</supported_graphics_clock>
				<supported_graphics_clock>570 MHz</supported_graphics_clock>
				<supported_graphics_clock>562 MHz</supported_graphics_clock>
				<supported_graphics_clock>555 MHz</supported_graphics_clock>
				<supported_graphics_clock>547 MHz</supported_graphics_clock>
				<supported_graphics_clock>540 MHz</supported_graphics_clock>
				<supported_graphics_clock>532 MHz</supported_graphics_clock>
				<supported_graphics_clock>525 MHz</supported_graphics_clock>
				<supported_graphics_clock>517 MHz</supported_graphics_clock>
				<supported_graphics_clock>510 MHz</supported_graphics_clock>
				<supported_graphics_clock>502 MHz</supported_graphics_clock>
				<supported_graphics_clock>495 MHz</supported_graphics_clock>
				<supported_graphics_clock>487 MHz</supported_graphics_clock>
				<supported_graphics_clock>480 MHz</supported_graphics_clock>
				<supported_graphics_clock>472 MHz</supported_graphics_clock>
				<supported_graphics_clock>465 MHz</supported_graphics_clock>
				<supported_graphics_clock>457 MHz</supported_graphics_clock>
				<supported_graphics_clock>450 MHz</supported_graphics_clock>
				<supported_graphics_clock>442 MHz</supported_graphics_clock>
				<supported_graphics_clock>435 MHz</supported_graphics_clock>
				<supported_graphics_clock>427 MHz</supported_graphics_clock>
				<supported_graphics_clock>420 MHz</supported_graphics_clock>
				<supported_graphics_clock>412 MHz</supported_graphics_clock>
				<supported_graphics_clock>405 MHz</supported_graphics_clock>
			</supported_mem_clock>
			<supported_mem_clock>
				<value>810 MHz</value>
				<supported_graphics_clock>2100 MHz</supported_graphics_clock>
				<supported_graphics_clock>2092 MHz</supported_graphics_clock>
				<supported_graphics_clock>2085 MHz</supported_graphics_clock>
				<supported_graphics_clock>2077 MHz</supported_graphics_clock>
				<supported_graphics_clock>2070 MHz</supported_graphics_clock>
				<supported_graphics_clock>2062 MHz</supported_graphics_clock>
				<supported_graphics_clock>2055 MHz</supported_graphics_clock>
				<supported_graphics_clock>2047 MHz</supported_graphics_clock>
				<supported_graphics_clock>2040 MHz</supported_graphics_clock>
				<supported_graphics_clock>2032 MHz</supported_graphics_clock>
				<supported_graphics_clock>2025 MHz</supported_graphics_clock>
				<supported_graphics_clock>2017 MHz</supported_graphics_clock>
				<supported_graphics_clock>2010 MHz</supported_graphics_clock>
				<supported_graphics_clock>2002 MHz</supported_graphics_clock>
				<supported_graphics_clock>1995 MHz</supported_graphics_clock>
				<supported_graphics_clock>1987 MHz</supported_graphics_clock>
				<supported_graphics_clock>1980 MHz</supported_graphics_clock>
				<supported_graphics_clock>1972 MHz</supported_graphics_clock>
				<supported_graphics_clock>1965 MHz</supported_graphics_clock>
				<supported_graphics_clock>1957 MHz</supported_graphics_clock>
				<supported_graphics_clock>1950 MHz</supported_graphics_clock>
				<supported_graphics_clock>1942 MHz</supported_graphics_clock>
				<supported_graphics_clock>1935 MHz</supported_graphics_clock>
				<supported_graphics_clock>1927 MHz</supported_graphics_clock>
				<supported_graphics_clock>1920 MHz</supported_graphics_clock>
				<supported_graphics_clock>1912 MHz</supported_graphics_clock>
				<supported_graphics_clock>1905 MHz</supported_graphics_clock>
				<supported_graphics_clock>1897 MHz</supported_graphics_clock>
				<supported_graphics_clock>1890 MHz</supported_graphics_clock>
				<supported_graphics_clock>1882 MHz</supported_graphics_clock>
				<supported_graphics_clock>1875 MHz</supported_graphics_clock>
				<supported_graphics_clock>1867 MHz</supported_graphics_clock>
				<supported_graphics_clock>1860 MHz</supported_graphics_clock>
				<supported_graphics_clock>1852 MHz</supported_graphics_clock>
				<supported_graphics_clock>1845 MHz</supported_graphics_clock>
				<supported_graphics_clock>1837 MHz</supported_graphics_clock>
				<supported_graphics_clock>1830 MHz</supported_graphics_clock>
				<supported_graphics_clock>1822 MHz</supported_graphics_clock>
				<supported_graphics_clock>1815 MHz</supported_graphics_clock>
				<supported_graphics_clock>1807 MHz</supported_graphics_clock>
				<supported_graphics_clock>1800 MHz</supported_graphics_clock>
				<supported_graphics_clock>1792 MHz</supported_graphics_clock>
				<supported_graphics_clock>1785 MHz</supported_graphics_clock>
				<supported_graphics_clock>1777 MHz</supported_graphics_clock>
				<supported_graphics_clock>1770 MHz</supported_graphics_clock>
				<supported_graphics_clock>1762 MHz</supported_graphics_clock>
				<supported_graphics_clock>1755 MHz</supported_graphics_clock>
				<supported_graphics_clock>1747 MHz</supported_graphics_clock>
				<supported_graphics_clock>1740 MHz</supported_graphics_clock>
				<supported_graphics_clock>1732 MHz</supported_graphics_clock>
				<supported_graphics_clock>1725 MHz</supported_graphics_clock>
				<supported_graphics_clock>1717 MHz</supported_graphics_clock>
				<supported_graphics_clock>1710 MHz</supported_graphics_clock>
				<supported_graphics_clock>1702 MHz</supported_graphics_clock>
				<supported_graphics_clock>1695 MHz</supported_graphics_clock>
				<supported_graphics_clock>1687 MHz</supported_graphics_clock>
				<supported_graphics_clock>1680 MHz</supported_graphics_clock>
				<supported_graphics_clock>1672 MHz</supported_graphics_clock>
				<supported_graphics_clock>1665 MHz</supported_graphics_clock>
				<supported_graphics_clock>1657 MHz</supported_graphics_clock>
				<supported_graphics_clock>1650 MHz</supported_graphics_clock>
				<supported_graphics_clock>1642 MHz</supported_graphics_clock>
				<supported_graphics_clock>1635 MHz</supported_graphics_clock>
				<supported_graphics_clock>1627 MHz</supported_graphics_clock>
				<supported_graphics_clock>1620 MHz</supported_graphics_clock>
				<supported_graphics_clock>1612 MHz</supported_graphics_clock>
				<supported_graphics_clock>1605 MHz</supported_graphics_clock>
				<supported_graphics_clock>1597 MHz</supported_graphics_clock>
				<supported_graphics_clock>1590 MHz</supported_graphics_clock>
				<supported_graphics_clock>1582 MHz</supported_graphics_clock>
				<supported_graphics_clock>1575 MHz</supported_graphics_clock>
				<supported_graphics_clock>1567 MHz</supported_graphics_clock>
				<supported_graphics_clock>1560 MHz</supported_graphics_clock>
				<supported_graphics_clock>1552 MHz</supported_graphics_clock>
				<supported_graphics_clock>1545 MHz</supported_graphics_clock>
				<supported_graphics_clock>1537 MHz</supported_graphics_clock>
				<supported_graphics_clock>1530 MHz</supported_graphics_clock>
				<supported_graphics_clock>1522 MHz</supported_graphics_clock>
				<supported_graphics_clock>1515 MHz</supported_graphics_clock>
				<supported_graphics_clock>1507 MHz</supported_graphics_clock>
				<supported_graphics_clock>1500 MHz</supported_graphics_clock>
				<supported_graphics_clock>1492 MHz</supported_graphics_clock>
				<supported_graphics_clock>1485 MHz</supported_graphics_clock>
				<supported_graphics_clock>1477 MHz</supported_graphics_clock>
				<supported_graphics_clock>1470 MHz</supported_graphics_clock>
				<supported_graphics_clock>1462 MHz</supported_graphics_clock>
				<supported_graphics_clock>1455 MHz</supported_graphics_clock>
				<supported_graphics_clock>1447 MHz</supported_graphics_clock>
				<supported_graphics_clock>1440 MHz</supported_graphics_clock>
				<supported_graphics_clock>1432 MHz</supported_graphics_clock>
				<supported_graphics_clock>1425 MHz</supported_graphics_clock>
				<supported_graphics_clock>1417 MHz</supported_graphics_clock>
				<supported_graphics_clock>1410 MHz</supported_graphics_clock>
				<supported_graphics_clock>1402 MHz</supported_graphics_clock>
				<supported_graphics_clock>1395 MHz</supported_graphics_clock>
				<supported_graphics_clock>1387 MHz</supported_graphics_clock>
				<supported_graphics_clock>1380 MHz</supported_graphics_clock>
				<supported_graphics_clock>1372 MHz</supported_graphics_clock>
				<supported_graphics_clock>1365 MHz</supported_graphics_clock>
				<supported_graphics_clock>1357 MHz</supported_graphics_clock>
				<supported_graphics_clock>1350 MHz</supported_graphics_clock>
				<supported_graphics_clock>1342 MHz</supported_graphics_clock>
				<supported_graphics_clock>1335 MHz</supported_graphics_clock>
				<supported_graphics_clock>1327 MHz</supported_graphics_clock>
				<supported_graphics_clock>1320 MHz</supported_graphics_clock>
				<supported_graphics_clock>1312 MHz</supported_graphics_clock>
				<supported_graphics_clock>1305 MHz</supported_graphics_clock>
				<supported_graphics_clock>1297 MHz</supported_graphics_clock>
				<supported_graphics_clock>1290 MHz</supported_graphics_clock>
				<supported_graphics_clock>1282 MHz</supported_graphics_clock>
				<supported_graphics_clock>1275 MHz</supported_graphics_clock>
				<supported_graphics_clock>1267 MHz</supported_graphics_clock>
				<supported_graphics_clock>1260 MHz</supported_graphics_clock>
				<supported_graphics_clock>1252 MHz</supported_graphics_clock>
				<supported_graphics_clock>1245 MHz</supported_graphics_clock>
				<supported_graphics_clock>1237 MHz</supported_graphics_clock>
				<supported_graphics_clock>1230 MHz</supported_graphics_clock>
				<supported_graphics_clock>1222 MHz</supported_graphics_clock>
				<supported_graphics_clock>1215 MHz</supported_graphics_clock>
				<supported_graphics_clock>1207 MHz</supported_graphics_clock>
				<supported_graphics_clock>1200 MHz</supported_graphics_clock>
				<supported_graphics_clock>1192 MHz</supported_graphics_clock>
				<supported_graphics_clock>1185 MHz</supported_graphics_clock>
				<supported_graphics_clock>1177 MHz</supported_graphics_clock>
				<supported_graphics_clock>1170 MHz</supported_graphics_clock>
				<supported_graphics_clock>1162 MHz</supported_graphics_clock>
				<supported_graphics_clock>1155 MHz</supported_graphics_clock>
				<supported_graphics_clock>1147 MHz</supported_graphics_clock>
				<supported_graphics_clock>1140 MHz</supported_graphics_clock>
				<supported_graphics_clock>1132 MHz</supported_graphics_clock>
				<supported_graphics_clock>1125 MHz</supported_graphics_clock>
				<supported_graphics_clock>1117 MHz</supported_graphics_clock>
				<supported_graphics_clock>1110 MHz</supported_graphics_clock>
				<supported_graphics_clock>1102 MHz</supported_graphics_clock>
				<supported_graphics_clock>1095 MHz</supported_graphics_clock>
				<supported_graphics_clock>1087 MHz</supported_graphics_clock>
				<supported_graphics_clock>1080 MHz</supported_graphics_clock>
				<supported_graphics_clock>1072 MHz</supported_graphics_clock>
				<supported_graphics_clock>1065 MHz</supported_graphics_clock>
				<supported_graphics_clock>1057 MHz</supported_graphics_clock>
				<supported_graphics_clock>1050 MHz</supported_graphics_clock>
				<supported_graphics_clock>1042 MHz</supported_graphics_clock>
				<supported_graphics_clock>1035 MHz</supported_graphics_clock>
				<supported_graphics_clock>1027 MHz</supported_graphics_clock>
				<supported_graphics_clock>1020 MHz</supported_graphics_clock>
				<supported_graphics_clock>1012 MHz</supported_graphics_clock>
				<supported_graphics_clock>1005 MHz</supported_graphics_clock>
				<supported_graphics_clock>997 MHz</supported_graphics_clock>
				<supported_graphics_clock>990 MHz</supported_graphics_clock>
				<supported_graphics_clock>982 MHz</supported_graphics_clock>
				<supported_graphics_clock>975 MHz</supported_graphics_clock>
				<supported_graphics_clock>967 MHz</supported_graphics_clock>
				<supported_graphics_clock>960 MHz</supported_graphics_clock>
				<supported_graphics_clock>952 MHz</supported_graphics_clock>
				<supported_graphics_clock>945 MHz</supported_graphics_clock>
				<supported_graphics_clock>937 MHz</supported_graphics_clock>
				<supported_graphics_clock>930 MHz</supported_graphics_clock>
				<supported_graphics_clock>922 MHz</supported_graphics_clock>
				<supported_graphics_clock>915 MHz</supported_graphics_clock>
				<supported_graphics_clock>907 MHz</supported_graphics_clock>
				<supported_graphics_clock>900 MHz</supported_graphics_clock>
				<supported_graphics_clock>892 MHz</supported_graphics_clock>
				<supported_graphics_clock>885 MHz</supported_graphics_clock>
				<supported_graphics_clock>877 MHz</supported_graphics_clock>
				<supported_graphics_clock>870 MHz</supported_graphics_clock>
				<supported_graphics_clock>862 MHz</supported_graphics_clock>
				<supported_graphics_clock>855 MHz</supported_graphics_clock>
				<supported_graphics_clock>847 MHz</supported_graphics_clock>
				<supported_graphics_clock>840 MHz</supported_graphics_clock>
				<supported_graphics_clock>832 MHz</supported_graphics_clock>
				<supported_graphics_clock>825 MHz</supported_graphics_clock>
				<supported_graphics_clock>817 MHz</supported_graphics_clock>
				<supported_graphics_clock>810 MHz</supported_graphics_clock>
				<supported_graphics_clock>802 MHz</supported_graphics_clock>
				<supported_graphics_clock>795 MHz</supported_graphics_clock>
				<supported_graphics_clock>787 MHz</supported_graphics_clock>
				<supported_graphics_clock>780 MHz</supported_graphics_clock>
				<supported_graphics_clock>772 MHz</supported_graphics_clock>
				<supported_graphics_clock>765 MHz</supported_graphics_clock>
				<supported_graphics_clock>757 MHz</supported_graphics_clock>
				<supported_graphics_clock>750 MHz</supported_graphics_clock>
				<supported_graphics_clock>742 MHz</supported_graphics_clock>
				<supported_graphics_clock>735 MHz</supported_graphics_clock>
				<supported_graphics_clock>727 MHz</supported_graphics_clock>
				<supported_graphics_clock>720 MHz</supported_graphics_clock>
				<supported_graphics_clock>712 MHz</supported_graphics_clock>
				<supported_graphics_clock>705 MHz</supported_graphics_clock>
				<supported_graphics_clock>697 MHz</supported_graphics_clock>
				<supported_graphics_clock>690 MHz</supported_graphics_clock>
				<supported_graphics_clock>682 MHz</supported_graphics_clock>
				<supported_graphics_clock>675 MHz</supported_graphics_clock>
				<supported_graphics_clock>667 MHz</supported_graphics_clock>
				<supported_graphics_clock>660 MHz</supported_graphics_clock>
				<supported_graphics_clock>652 MHz</supported_graphics_clock>
				<supported_graphics_clock>645 MHz</supported_graphics_clock>
				<supported_graphics_clock>637 MHz</supported_graphics_clock>
				<supported_graphics_clock>630 MHz</supported_graphics_clock>
				<supported_graphics_clock>622 MHz</supported_graphics_clock>
				<supported_graphics_clock>615 MHz</supported_graphics_clock>
				<supported_graphics_clock>607 MHz</supported_graphics_clock>
				<supported_graphics_clock>600 MHz</supported_graphics_clock>
				<supported_graphics_clock>592 MHz</supported_graphics_clock>
				<supported_graphics_clock>585 MHz</supported_graphics_clock>
				<supported_graphics_clock>577 MHz</supported_graphics_clock>
				<supported_graphics_clock>570 MHz</supported_graphics_clock>
				<supported_graphics_clock>562 MHz</supported_graphics_clock>
				<supported_graphics_clock>555 MHz</supported_graphics_clock>
				<supported_graphics_clock>547 MHz</supported_graphics_clock>
				<supported_graphics_clock>540 MHz</supported_graphics_clock>
				<supported_graphics_clock>532 MHz</supported_graphics_clock>
				<supported_graphics_clock>525 MHz</supported_graphics_clock>
				<supported_graphics_clock>517 MHz</supported_graphics_clock>
				<supported_graphics_clock>510 MHz</supported_graphics_clock>
				<supported_graphics_clock>502 MHz</supported_graphics_clock>
				<supported_graphics_clock>495 MHz</supported_graphics_clock>
				<supported_graphics_clock>487 MHz</supported_graphics_clock>
				<supported_graphics_clock>480 MHz</supported_graphics_clock>
				<supported_graphics_clock>472 MHz</supported_graphics_clock>
				<supported_graphics_clock>465 MHz</supported_graphics_clock>
				<supported_graphics_clock>457 MHz</supported_graphics_clock>
				<supported_graphics_clock>450 MHz</supported_graphics_clock>
				<supported_graphics_clock>442 MHz</supported_graphics_clock>
				<supported_graphics_clock>435 MHz</supported_graphics_clock>
				<supported_graphics_clock>427 MHz</supported_graphics_clock>
				<supported_graphics_clock>420 MHz</supported_graphics_clock>
				<supported_graphics_clock>412 MHz</supported_graphics_clock>
				<supported_graphics_clock>405 MHz</supported_graphics_clock>
			</supported_mem_clock>
			<supported_mem_clock>
				<value>405 MHz</value>
				<supported_graphics_clock>420 MHz</supported_graphics_clock>
				<supported_graphics_clock>412 MHz</supported_graphics_clock>
				<supported_graphics_clock>405 MHz</supported_graphics_clock>
			</supported_mem_clock>
		</supported_clocks>
		<processes>
			<process_info>
				<gpu_instance_id>N/A</gpu_instance_id>
				<compute_instance_id>N/A</compute_instance_id>
				<pid>171819</pid>
				<type>C</type>
				<process_name>/app/.venv/bin/python</process_name>
				<used_memory>1100 MiB</used_memory>
			</process_info>
		</processes>
		<accounted_processes>
		</accounted_processes>
		<capabilities>
			<egm>disabled</egm>
		</capabilities>
	</gpu>

</nvidia_smi_log>
`;
