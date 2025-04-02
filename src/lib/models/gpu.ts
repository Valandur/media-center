export interface GpuInfo {
	name: string;
	temp: number;
	processes: unknown;
	encoderSessions: number;
	fanSpeed: number;
	memTotal: number;
	memUsed: number;
}

export interface GpuRaw {
	'?xml': string;
	nvidia_smi_log: NvidiaSmiLog;
}

export interface NvidiaSmiLog {
	timestamp: string;
	driver_version: string;
	cuda_version: number;
	attached_gpus: number;
	gpu: Gpu;
}

export interface Gpu {
	product_name: string;
	product_brand: string;
	product_architecture: string;
	display_mode: string;
	display_active: string;
	persistence_mode: string;
	addressing_mode: string;
	mig_mode: MigMode;
	mig_devices: string;
	accounting_mode: string;
	accounting_mode_buffer_size: number;
	driver_model: DriverModel;
	serial: string;
	uuid: string;
	minor_number: number;
	vbios_version: string;
	multigpu_board: string;
	board_id: number;
	board_part_number: string;
	gpu_part_number: string;
	gpu_fru_part_number: string;
	platformInfo: PlatformInfo;
	inforom_version: InforomVersion;
	inforom_bbx_flush: InforomBbxFlush;
	gpu_operation_mode: GpuOperationMode;
	c2c_mode: string;
	gpu_virtualization_mode: GpuVirtualizationMode;
	gpu_reset_status: GpuResetStatus;
	gpu_recovery_action: string;
	gsp_firmware_version: string;
	ibmnpu: Ibmnpu;
	pci: Pci;
	fan_speed: string;
	performance_state: string;
	clocks_event_reasons: ClocksEventReasons;
	sparse_operation_mode: string;
	fb_memory_usage: FbMemoryUsage;
	bar1_memory_usage: Bar1MemoryUsage;
	cc_protected_memory_usage: CcProtectedMemoryUsage;
	compute_mode: string;
	utilization: Utilization;
	encoder_stats: EncoderStats;
	fbc_stats: FbcStats;
	dram_encryption_mode: DramEncryptionMode;
	ecc_mode: EccMode;
	ecc_errors: EccErrors;
	retired_pages: RetiredPages;
	remapped_rows: string;
	temperature: Temperature;
	supported_gpu_target_temp: SupportedGpuTargetTemp;
	gpu_power_readings: GpuPowerReadings;
	gpu_memory_power_readings: GpuMemoryPowerReadings;
	module_power_readings: ModulePowerReadings;
	power_smoothing: string;
	power_profiles: PowerProfiles;
	clocks: Clocks;
	applications_clocks: ApplicationsClocks;
	default_applications_clocks: DefaultApplicationsClocks;
	deferred_clocks: DeferredClocks;
	max_clocks: MaxClocks;
	max_customer_boost_clocks: MaxCustomerBoostClocks;
	clock_policy: ClockPolicy;
	voltage: Voltage;
	fabric: Fabric;
	supported_clocks: SupportedClocks;
	processes: Processes;
	accounted_processes: string;
	capabilities: Capabilities;
}

export interface MigMode {
	current_mig: string;
	pending_mig: string;
}

export interface DriverModel {
	current_dm: string;
	pending_dm: string;
}

export interface PlatformInfo {
	chassis_serial_number: string;
	slot_number: string;
	tray_index: string;
	host_id: string;
	peer_type: string;
	module_id: number;
	gpu_fabric_guid: string;
}

export interface InforomVersion {
	img_version: string;
	oem_object: number;
	ecc_object: string;
	pwr_object: string;
}

export interface InforomBbxFlush {
	latest_timestamp: string;
	latest_duration: string;
}

export interface GpuOperationMode {
	current_gom: string;
	pending_gom: string;
}

export interface GpuVirtualizationMode {
	virtualization_mode: string;
	host_vgpu_mode: string;
	vgpu_heterogeneous_mode: string;
}

export interface GpuResetStatus {
	reset_required: string;
	drain_and_reset_recommended: string;
}

export interface Ibmnpu {
	relaxed_ordering_mode: string;
}

export interface Pci {
	pci_bus: number;
	pci_device: number;
	pci_domain: number;
	pci_base_class: number;
	pci_sub_class: number;
	pci_device_id: string;
	pci_bus_id: string;
	pci_sub_system_id: number;
	pci_gpu_link_info: PciGpuLinkInfo;
	pci_bridge_chip: PciBridgeChip;
	replay_counter: number;
	replay_rollover_counter: number;
	tx_util: string;
	rx_util: string;
	atomic_caps_outbound: string;
	atomic_caps_inbound: string;
}

export interface PciGpuLinkInfo {
	pcie_gen: PcieGen;
	link_widths: LinkWidths;
}

export interface PcieGen {
	max_link_gen: number;
	current_link_gen: number;
	device_current_link_gen: number;
	max_device_link_gen: number;
	max_host_link_gen: number;
}

export interface LinkWidths {
	max_link_width: string;
	current_link_width: string;
}

export interface PciBridgeChip {
	bridge_chip_type: string;
	bridge_chip_fw: string;
}

export interface ClocksEventReasons {
	clocks_event_reason_gpu_idle: string;
	clocks_event_reason_applications_clocks_setting: string;
	clocks_event_reason_sw_power_cap: string;
	clocks_event_reason_hw_slowdown: string;
	clocks_event_reason_hw_thermal_slowdown: string;
	clocks_event_reason_hw_power_brake_slowdown: string;
	clocks_event_reason_sync_boost: string;
	clocks_event_reason_sw_thermal_slowdown: string;
	clocks_event_reason_display_clocks_setting: string;
}

export interface FbMemoryUsage {
	total: string;
	reserved: string;
	used: string;
	free: string;
}

export interface Bar1MemoryUsage {
	total: string;
	used: string;
	free: string;
}

export interface CcProtectedMemoryUsage {
	total: string;
	used: string;
	free: string;
}

export interface Utilization {
	gpu_util: string;
	memory_util: string;
	encoder_util: string;
	decoder_util: string;
	jpeg_util: string;
	ofa_util: string;
}

export interface EncoderStats {
	session_count: number;
	average_fps: number;
	average_latency: number;
}

export interface FbcStats {
	session_count: number;
	average_fps: number;
	average_latency: number;
}

export interface DramEncryptionMode {
	current_dram_encryption: string;
	pending_dram_encryption: string;
}

export interface EccMode {
	current_ecc: string;
	pending_ecc: string;
}

export interface EccErrors {
	volatile: Volatile;
	aggregate: Aggregate;
	aggregate_uncorrectable_sram_sources: AggregateUncorrectableSramSources;
}

export interface Volatile {
	sram_correctable: string;
	sram_uncorrectable_parity: string;
	sram_uncorrectable_secded: string;
	dram_correctable: string;
	dram_uncorrectable: string;
}

export interface Aggregate {
	sram_correctable: string;
	sram_uncorrectable_parity: string;
	sram_uncorrectable_secded: string;
	dram_correctable: string;
	dram_uncorrectable: string;
	sram_threshold_exceeded: string;
}

export interface AggregateUncorrectableSramSources {
	sram_l2: string;
	sram_sm: string;
	sram_microcontroller: string;
	sram_pcie: string;
	sram_other: string;
}

export interface RetiredPages {
	multiple_single_bit_retirement: MultipleSingleBitRetirement;
	double_bit_retirement: DoubleBitRetirement;
	pending_blacklist: string;
	pending_retirement: string;
}

export interface MultipleSingleBitRetirement {
	retired_count: string;
	retired_pagelist: string;
}

export interface DoubleBitRetirement {
	retired_count: string;
	retired_pagelist: string;
}

export interface Temperature {
	gpu_temp: string;
	gpu_temp_tlimit: string;
	gpu_temp_max_threshold: string;
	gpu_temp_slow_threshold: string;
	gpu_temp_max_gpu_threshold: string;
	gpu_target_temperature: string;
	memory_temp: string;
	gpu_temp_max_mem_threshold: string;
}

export interface SupportedGpuTargetTemp {
	gpu_target_temp_min: string;
	gpu_target_temp_max: string;
}

export interface GpuPowerReadings {
	power_state: string;
	average_power_draw: string;
	instant_power_draw: string;
	current_power_limit: string;
	requested_power_limit: string;
	default_power_limit: string;
	min_power_limit: string;
	max_power_limit: string;
}

export interface GpuMemoryPowerReadings {
	average_power_draw: string;
	instant_power_draw: string;
}

export interface ModulePowerReadings {
	power_state: string;
	average_power_draw: string;
	instant_power_draw: string;
	current_power_limit: string;
	requested_power_limit: string;
	default_power_limit: string;
	min_power_limit: string;
	max_power_limit: string;
}

export interface PowerProfiles {
	power_profile_requested_profiles: string;
	power_profile_enforced_profiles: string;
}

export interface Clocks {
	graphics_clock: string;
	sm_clock: string;
	mem_clock: string;
	video_clock: string;
}

export interface ApplicationsClocks {
	graphics_clock: string;
	mem_clock: string;
}

export interface DefaultApplicationsClocks {
	graphics_clock: string;
	mem_clock: string;
}

export interface DeferredClocks {
	mem_clock: string;
}

export interface MaxClocks {
	graphics_clock: string;
	sm_clock: string;
	mem_clock: string;
	video_clock: string;
}

export interface MaxCustomerBoostClocks {
	graphics_clock: string;
}

export interface ClockPolicy {
	auto_boost: string;
	auto_boost_default: string;
}

export interface Voltage {
	graphics_volt: string;
}

export interface Fabric {
	state: string;
	status: string;
	cliqueId: string;
	clusterUuid: string;
	health: Health;
}

export interface Health {
	bandwidth: string;
	route_recovery_in_progress: string;
	route_unhealthy: string;
	access_timeout_recovery: string;
}

export interface SupportedClocks {
	supported_mem_clock: SupportedMemClock[];
}

export interface SupportedMemClock {
	value: string;
	supported_graphics_clock: string[];
}

export interface Processes {
	process_info: ProcessInfo;
}

export interface ProcessInfo {
	gpu_instance_id: string;
	compute_instance_id: string;
	pid: number;
	type: string;
	process_name: string;
	used_memory: string;
}

export interface Capabilities {
	egm: string;
}
